import Grid from '@mui/material/Unstable_Grid2';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from "axios";


function Status() {

    const [mods, setMods] = useState([]);
    const [image, setImage] = useState("");
    const [players, setPlayers] = useState([]);
    const [max, setMax] = useState(20);
    const [online, setOnline] = useState(0);
    const [motd, setMotd] = useState("");
    const [status, setStatus] = useState(false);

    useEffect(() => {
        axios.get("https://api.mcsrvstat.us/2/desmadra.arequipet.ga").then(response => {
            console.log(response.data);
            setImage(response.data.icon)
            setPlayers(response.data.players.list)
            setMax(response.data.players.max)
            setOnline(response.data.players.online)
            setMods(response.data.mods.names)
            
            setStatus(response.data.online)
            const temp = response.data.motd.html.reduce((motd, text) => `${motd}${text}<br>`, "")
            setMotd(temp)
        }).catch(e => {
            console.log(e.response.data)
        });
    }, []);

    return (
        <Grid container justifyContent="center" spacing={3} sx={{ color: "white" }}>
            <Grid xs={12}>
                <Typography variant="h2">
                    desmadra.arequipet.ga
                </Typography>
            </Grid>
            <Grid xs={12}>
                <Typography variant="h3">
                    1.16.5
                </Typography>
            </Grid>
            <Grid xs={12} container justifyContent="center" >
                <Card>
                    <CardMedia
                        component="img"
                        image={image}
                        alt="server_logo"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {status ? "Prendido" : "Apagado"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {online}/{max}
                        </Typography>
                        <div dangerouslySetInnerHTML={{__html: motd}}></div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid width="50%">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}>
                        <Typography>Jugadores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {players.map(((player, index) =>
                            <Typography key={index}>
                                {player}
                            </Typography>))}
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid width="80%">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}>
                        <Typography>Mods</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container columnSpacing={5} justifyContent="center">
                            {mods.map(((mod, index) =>
                                <Grid>
                                    <Typography key={index}>
                                        {mod}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
}

export default Status;
