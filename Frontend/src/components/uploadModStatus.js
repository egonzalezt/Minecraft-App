import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ReactComponent as JavaIcon } from '../img/java-icon.svg';
import CircularProgress from '@mui/material/CircularProgress';
import AdminApi from '../services/admin';
import { enqueueSnackbar } from 'notistack';

function UploadModStatus({ file, onComponentFinish }) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isComponentMounted, setComponentMounted] = useState(true);

    const handleUpload = async () => {
        let status = false;
        try {
            const formData = new FormData();
            formData.append('fileName', file.name);
            formData.append('version', file.version);
            formData.append('client', file.isClientChecked);
            formData.append('server', file.isServerChecked);
            formData.append('file', file.file);
            formData.append('name', file.customName);
            formData.append('url', '');
            formData.append('category', 'mod');

            const config = {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                }
            };
            await AdminApi.upload(formData, config);
            status = true;
            enqueueSnackbar(`El mod ${file.name} se ha subido exitosamente`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(`Ocurrio un error al subir el mod ${file.name}`, { variant: 'error' });
            status = false;
        } finally {
            setComponentMounted(false);
            onComponentFinish(file.id, status);
        }
    };

    useEffect(() => {
        if (isComponentMounted) {
            handleUpload();
        }
    }, []);


    if (!isComponentMounted) {
        return null;
    }

    return (
        <ListItem key={file.id}>
            <ListItemIcon>
                <JavaIcon />
            </ListItemIcon>
            <ListItemText sx={{ wordWrap: 'break-word' }} primary={file.name} />
            <CircularProgress variant="determinate" value={uploadProgress} />
        </ListItem>
    );
}

export default UploadModStatus;
