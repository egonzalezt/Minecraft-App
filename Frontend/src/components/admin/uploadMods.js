import React, { useState, useEffect } from 'react';
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

import AdminDrawer from './drawer';

function UploadMod() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isClientChecked, setClientChecked] = useState(false);
    const [isServerChecked, setServerChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleClientCheckboxChange = (event, row) => {
        const updatedFiles = [...files];
        console.log(updatedFiles[row.id])
        updatedFiles[row.id].isClientChecked = true;
        setFiles(updatedFiles);
    };
    
    const handleServerCheckboxChange = (event, row) => {
        const updatedFiles = [...files];
        updatedFiles[row.id].isServerChecked = true;
        setFiles(updatedFiles);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handleNombreChange = (index, value) => {
        const updatedFiles = [...files];
        updatedFiles[index].nombre = value;
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
            const formDataArray = files.map((file) => {
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('version', file.version || '');
                formData.append('client', file.isClientChecked);
                formData.append('server', file.isServerChecked);
                formData.append('file', file);
                formData.append('name', file.name);
                formData.append('url', '');
                return formData;
            });

            for (const formData of formDataArray) {
                const config = {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                        console.log(progress)
                    }
                };

                await AdminApi.upload(formData, config);
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
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.row.nombre || params.row.name.split('.jar')[0]}
                    onChange={(event) => handleNombreChange(params.row.id, event.target.value)}
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
                    onChange={(event) => handleClientCheckboxChange(event, params.row)}
                    color="primary"
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
                    onChange={(event) => handleServerCheckboxChange(event, params.row)}
                    color="primary"
                />
            ),
        },
        {
            field: 'estado',
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

    const rows = files.map((file, index) => ({
        id: index,
        nombre: file.nombre || '',
        name: file.name,
        version: file.version || '',
        estado: 'Pendiente',
        isClientChecked: false,
        isServerChecked: false,
    }));
    /*useEffect(() => {
        console.log(files)
    }, [files]);*/
    return (
        <AdminDrawer>
            <Typography margin={3} variant="h2" gutterBottom>
                Subir mod
            </Typography>
            <Grid container justifyContent="center" spacing={5}>
                <Grid item xs={12}>
                    <div
                        style={{
                            border: '2px dashed #ccc',
                            padding: '1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                        <Typography variant="body1" component="p" gutterBottom>
                            Arrastra y suelta archivos aquí o haz clic para seleccionarlos
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={12} style={{ height: 400, width: '100%' }}>
                    <DataGrid columns={columns} rows={rows} autoHeight pageSize={5} rowsPerPageOptions={[5]} />
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