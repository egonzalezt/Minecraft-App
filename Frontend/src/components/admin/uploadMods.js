import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import AdminApi from '../../services/admin';
import Snackbar from '@mui/material/Snackbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ReactComponent as JavaIcon } from '../../img/java-icon.svg';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';

import AdminDrawer from './drawer';


function UploadMod() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isClientChecked, setClientChecked] = useState(false);
    const [isServerChecked, setServerChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [uploadFile, setUploadFile] = useState({});

    const handleClick = () => {
        setOpen(!open);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        const fileList = Array.from(event.target.files);
        const validFiles = fileList.filter((file) => file.name.endsWith('.jar'));

        if (validFiles.length === fileList.length) {
            const newFiles = validFiles.filter((file) => {
                const isDuplicate = files.some((existingFile) => existingFile.name === file.name);
                if (isDuplicate) {
                    Swal.fire({
                        timer: 5000,
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

    const handleUpload = async () => {
        if (!isClientChecked && !isServerChecked) {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: 'Seleccione al menos una opción',
                text: 'Debe seleccionar al menos una opción para Cliente o Servidor',
            });
            return;
        }

        setLoading(true);

        try {

            for (const file of files) {
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('version', file.version);
                formData.append('client', file.isClientChecked);
                formData.append('server', file.isServerChecked);
                formData.append('file', file);
                formData.append('name', file.customName);
                formData.append('url', '');
                setUploadFile(file.id)
                console.log(file)
                const config = {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                        console.log(progress)
                    }
                };

                // await AdminApi.upload(formData, config);
            }

            setFiles([]);
            setClientChecked(false);
            setServerChecked(false);

            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: 'Archivos subidos exitosamente',
                text: 'Los archivos han sido subidos al servidor',
            });
        } catch (error) {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error al subir los archivos',
                text: 'Ha ocurrido un error al intentar subir los archivos',
            });
        } finally {
            setLoading(false);
        }
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

    return (
        <AdminDrawer>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={true} sx={{ backgroundColor: "black", borderRadius: "15px", color: "white" }}>
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
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <JavaIcon />
                                    </ListItemIcon>
                                    <ListItemText sx={{ wordWrap: "break-word" }} primary={value.name} />
                                </ListItem>
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
                        Arrastra y suelta archivos aquí o haz clic para seleccionarlos
                    </Typography>
                    <input ref={inputRef} hidden accept=".jar" type="file" multiple onChange={handleFileChange} />

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
        </AdminDrawer>
    );
}

export default UploadMod;