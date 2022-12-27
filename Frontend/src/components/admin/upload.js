import React, { useState, useRef } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import AdminDrawer from "./drawer";
import AdminApi from '../../services/admin';

function UploadMod() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [version, setVersion] = useState("");
    const [client, setClient] = useState(false);
    const [server, setServer] = useState(false);
    const [isValidFile, setIsValidFile] = useState();
    const [fileName, setFileName] = useState("Cargar mod");
    const [loading, setLoading] = useState(false);
    const [isInvalidName, setIsInvalidName] = useState(true);
    const [isInvalidVersion, setIsInvalidVersion] = useState(true);

    const inputRef = useRef(null);
    const onButtonClick = () => {
        inputRef.current.click();
    };

    const submitMod = () => {
        let errors = []
        if(!client && !server){
            errors.push("<li>Seleccione el tipo de mod Server/Client</li>");
        }
        if(isInvalidName){
            errors.push("<li>Revise el nombre del mod</li>");
        }
        if(isInvalidVersion){
            errors.push("<li>Revise la version del mod</li>");
        }
        if(!isValidFile){
            errors.push("<li>Revise el archivo</li>");
        }


        if(errors.length > 0){
            Swal.fire({
                icon: 'warning',
                title: 'Hey te falto algo en el formulario',
                footer: `<ul>${errors.join("")}</ul>`
            })
            return;
        }

        setLoading(true);
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('version', version);
        formData.append('client', client);
        formData.append('server', server);
        formData.append('file', file);
        formData.append('name', name);
        formData.append('url', url)
        AdminApi.upload(formData).then(res => {
            setLoading(false);
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: `Mod creado`,
                text: `El mod  ${name}  se a creado correctamente`,
            }).then(() => navigate("/admin"));
        }).catch(err => {
            setLoading(false);
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
                text: err.response.data.message,
            })
        });
    };

    const handleChange = (e) => {
        const fileName = e.target.files[0].name;
        if (fileName.endsWith('.jar')) {
            setIsValidFile(true);
            e.preventDefault();
            if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
                setFile(e.target.files[0])
            }
        } else {
            setIsValidFile(false);
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: `Cargue un archivo valido`,
                text: `Rectifique que haya seleccionado el mod y no otro archivo`,
            })
        }
    };

    return (
        <AdminDrawer>
            <Typography margin={3} variant="h2" gutterBottom>
                Subir mod
            </Typography>
            <Grid container justifyContent="center" spacing={5}>
                <Grid xs={12} sm={6}>
                    <TextField
                        error = {isInvalidName}
                        helperText ={isInvalidName&& "Nombre es invalido"}
                        required
                        label="Nombre del mod"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(event) => {
                            if(event.target.value.length<1){
                                setIsInvalidName(true)
                            }else{
                                setIsInvalidName(false)
                            }
                            setName(event.target.value) 
                        }}
                    />
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField
                        error = {isInvalidVersion}
                        helperText ={isInvalidVersion && "La version es invalido"}
                        required
                        label="Version del mod"
                        fullWidth
                        variant="standard"
                        value={version}
                        onChange={(event) => {
                            if(event.target.value.length<1){
                                setIsInvalidVersion(true)
                            }else{
                                setIsInvalidVersion(false)
                            }
                            setVersion(event.target.value) 
                        }}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        label="Url Mod"
                        fullWidth
                        variant="standard"
                        value={url}
                        onChange={(event) => {
                            setUrl(event.target.value) 
                        }}
                    />
                </Grid>
                <Grid xs={12}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={server} onChange={(event) => setServer(event.target.checked)} />} label="Servidor" />
                        <FormControlLabel control={<Checkbox checked={client} onChange={(event) => setClient(event.target.checked)} />} label="Cliente" />
                    </FormGroup>
                </Grid>
                <Grid width="50%" xs={12} border={5} padding={5} sx={{
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
                }} onClick={onButtonClick}>
                    <input ref={inputRef} hidden accept=".jar" type="file" onChange={handleChange} />
                    <Typography paragraph>
                        {fileName}
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <LoadingButton
                        color="secondary"
                        onClick={submitMod}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        Subir
                    </LoadingButton>
                </Grid>
            </Grid>
        </AdminDrawer>
    );
}

export default UploadMod;
