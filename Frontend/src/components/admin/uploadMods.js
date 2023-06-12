import React, { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import UploadModStatus from '../uploadModStatus';
import admin from '../../services/admin';
import { enqueueSnackbar } from 'notistack';

function UploadMod() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [totalFiles, setTotalFiles] = useState(0);

    const handleClick = () => {
        setOpen(!open);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const createFileObject = (file) => {
        return {
            name: file.name,
            version: '1.19.2',
            isClientChecked: true,
            isServerChecked: true,
            customName: file.name.split('.jar')[0],
            file: file,
            status: 'Pendiente'
        };
    };

    const handleFileChange = async (event) => {
        const fileList = Array.from(event.target.files);
        const validFiles = fileList.filter((file) => file.name.endsWith('.jar'));

        if (validFiles.length === fileList.length) {
            const newFiles = [];
            const modsFileName = fileList.map((file) => file.name);

            try {
                const response = await admin.verifyIfModsExists(modsFileName);
                console.log(response.data)
                const modsResponse = response.data.mods;

                for (const file of validFiles) {
                    const alreadyAdded = modsResponse[file.name];
                    if (alreadyAdded) {
                        enqueueSnackbar(`El archivo ${file.name} ya existe en el servidor y sera ignorado.`, { variant: 'warning' });
                    } else {
                        const isDuplicate = files.some((existingFile) => existingFile.name === file.name);
                        if (isDuplicate) {
                            enqueueSnackbar(`El archivo ${file.name} ya existe en la lista y sera ignorado.`, { variant: 'warning' });
                        } else {
                            newFiles.push(file);
                        }
                    }
                }

                const fileObjects = newFiles.map((file) => createFileObject(file));
                setFiles([...files, ...fileObjects]);
            } catch (error) {
                console.log(error)
                Swal.fire({
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: 'Ocurrió un error al verificar los mods existentes. Por favor, inténtelo de nuevo.',
                });
            }
        } else {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: 'Cargue un archivo válido',
                text: 'Verifique que todos los mods seleccionados sean archivos .jar',
            });
        }
    };




    const handleClientCheckboxChange = (checked, index) => {
        const updatedFiles = [...files];
        files[index].isClientChecked = checked;
        setFiles(updatedFiles);
    };

    const handleServerCheckboxChange = (checked, index) => {
        const updatedFiles = [...files];
        files[index].isServerChecked = checked;
        setFiles(updatedFiles);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handleCustomNameChange = (index, value) => {
        const updatedFiles = [...files];
        updatedFiles[index].customName = value;
        setFiles(updatedFiles);
    };

    const handleVersionChange = (index, value) => {
        const updatedFiles = [...files];
        updatedFiles[index].version = value;
        setFiles(updatedFiles);
    };

    const handleComponentFinish = (componentId, successUpload) => {
        setFiles(prevFiles => {
            return prevFiles.map(file => {
                if (file.id === componentId) {
                    if (successUpload) {
                        return {
                            ...file,
                            status: 'Completado'
                        };
                    } else {
                        return {
                            ...file,
                            status: 'Error'
                        };
                    }
                }
                return file;
            });
        });
        setTotalFiles(prevTotalFiles => prevTotalFiles - 1);
    };

    const handleUpload = async () => {
        setTotalFiles(files.length)
        setLoading(true);
    };

    const checkValue = (value) => {
        if (value === undefined) {
            return true
        }
        return value
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const fileList = Array.from(event.dataTransfer.files);
        const validFiles = fileList.filter((file) => file.name.endsWith('.jar'));
        if (validFiles.length === fileList.length) {
            const newFiles = validFiles.filter((file) => {
                const isDuplicate = files.some((existingFile) => existingFile.name === file.name);
                if (isDuplicate) {
                    Swal.fire({
                        timer: 3000,
                        timerProgressBar: true,
                        icon: 'warning',
                        title: 'Archivo duplicado',
                        text: `El archivo ${file.name} ya existe en la lista y será ignorado.`,
                    });
                }
                return !isDuplicate;
            });

            setFiles([...files, ...newFiles]);
        } else {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: 'Cargue un archivo válido',
                text: 'Rectifique que todos los mods seleccionados sean .Jar',
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'customName',
            headerName: 'Nombre',
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.row.customName || params.row.name.split('.jar')[0]}
                    onChange={(event) => handleCustomNameChange(params.row.id, event.target.value)}
                    fullWidth
                />
            ),
        },
        { field: 'name', headerName: 'Nombre de archivo', flex: 1 },
        {
            field: 'version',
            headerName: 'Version',
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.row.version || ''}
                    onChange={(event) => handleVersionChange(params.row.id, event.target.value)}
                    fullWidth
                />
            ),
        },
        {
            field: 'client',
            headerName: 'Cliente',
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.isClientChecked}
                    onChange={(event) => handleClientCheckboxChange(event.target.checked, params.row.id)}
                    color="success"
                />
            ),
        },
        {
            field: 'server',
            headerName: 'Servidor',
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.isServerChecked}
                    onChange={(event) => handleServerCheckboxChange(event.target.checked, params.row.id)}
                    color="success"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
        },
        {
            field: 'actions',
            headerName: 'Eliminar',
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleDeleteFile(params.row.id)}
                    startIcon={<DeleteIcon />}
                    style={{ backgroundColor: 'transparent' }}
                    disableElevation
                />
            ),
        },
    ];

    useEffect(() => {
        if (totalFiles <= 0 && loading) {
            setLoading(false);
        }
    }, [totalFiles, loading]);

    return (
        <div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={loading} sx={{ backgroundColor: "black", borderRadius: "15px", color: "white" }}>
                <List
                    sx={{ maxWidth: 360, borderRadius: "15px" }}
                    component="nav"
                >
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Descargas" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open}>
                        <List component="div" disablePadding>
                            {files.map((value, index) =>
                                <UploadModStatus file={value} key={index} onComponentFinish={handleComponentFinish} />
                            )}
                        </List>
                    </Collapse>
                </List>
            </Snackbar>
            <Typography variant="h2" gutterBottom>
                Subir mod
            </Typography>
            <Grid container marginTop={2} justifyContent="center" spacing={5}>
                <Grid item
                    xs={10}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                    sx={{
                        borderRadius: "1rem",
                        borderStyle: "dashed",
                        transition: "background-color .5s",
                        '&:hover': {
                            cursor: "pointer",
                            backgroundColor: "grey",
                            MozBoxShadow: "0 0 15px #ccc",
                            WebkitBoxShadow: "0 0 15px #ccc",
                            boxShadow: "0 0 15px #ccc",
                        }
                    }}>
                    <Typography paragraph>
                        Arrastra y suelta archivos aqui o haz clic para seleccionarlos
                    </Typography>
                    <input
                        ref={inputRef}
                        hidden
                        accept=".jar"
                        type="file"
                        multiple
                        onClick={(e) => {
                            e.target.value = null;
                        }}
                        onChange={handleFileChange}
                    />
                </Grid>

                <Grid item xs={12} style={{ height: 400 }}>
                    <DataGrid columns={columns} rows={files.map((file, index) => ({
                        id: index,
                        name: file.name,
                        customName: file.customName || '',
                        version: file.version || '1.19.2',
                        status: file.status || 'Pendiente',
                        isClientChecked: checkValue(file.isClientChecked),
                        isServerChecked: checkValue(file.isServerChecked),
                    }))} autoHeight pageSize={5} rowsPerPageOptions={[5]} />
                </Grid>

                {files.length > 0 && (
                    <LoadingButton
                        color="secondary"
                        onClick={handleUpload}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        Subir
                    </LoadingButton>
                )}
            </Grid>
        </div>
    );
}

export default UploadMod;