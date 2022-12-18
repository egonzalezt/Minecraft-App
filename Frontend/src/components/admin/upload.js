import React, { useState, useRef } from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import SendIcon from '@mui/icons-material/Send';

import AdminDrawer from "./drawer";
import axios from "axios";

function UploadMod() {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [client, setClient] = useState(false);
    const [server, setServer] = useState(false);
    const [fileName, setFileName] = useState("Cargar mod");
    const inputRef = useRef(null);

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const submitMod = () => {
        let formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('version', version);
        formData.append('client', client);
        formData.append('server', server);
        formData.append('file', file);
        formData.append('name', name);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        console.log(formData)
        // axios.post("/mods/upload", formData, config)
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0])
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
                        required
                        label="Nombre del mod"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField
                        required
                        label="version del mod"
                        fullWidth
                        variant="standard"
                        value={version}
                        onChange={(event) => setVersion(event.target.value)}
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
                    <Button variant="contained" endIcon={<SendIcon />} onClick={submitMod}>
                        Subir
                    </Button>
                </Grid>
            </Grid>
        </AdminDrawer>
    );
}

export default UploadMod;
