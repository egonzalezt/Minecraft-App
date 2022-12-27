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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';

import axios from "axios";


function Status() {

    const [mods, setMods] = useState([]);
    const [image, setImage] = useState("");
    const [players, setPlayers] = useState([]);
    const [max, setMax] = useState(20);
    const [online, setOnline] = useState(0);
    const [motd, setMotd] = useState("");
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const matches = useMediaQuery('(min-width:700px)');
    
    useEffect(() => {
        setLoading(true);
        axios.get("https://api.mcsrvstat.us/2/desmadra.arequipet.ga").then(response => {
            console.log(response.data);
            setImage(response.data.icon)
            setPlayers(response.data.players.list ? response.data.players.list : ["Sin jugadores"])
            setMax(response.data.players.max)
            setOnline(response.data.players.online)
            setMods(response.data.mods.names)

            setStatus(response.data.online)
            const temp = response.data.motd.html.reduce((motd, text) => `${motd}${text}<br>`, "")
            setMotd(temp)
            setLoading(false);
        }).catch(e => {
            console.log(e.response.data)
        });
    }, []);

    return (
        <Grid container justifyContent="center" sx={{ color: "white" }}>

            <Grid xs={12}>
                <Typography variant="h2" sx={{ marginBottom: "2%", overflowWrap: "break-word"}}>
                    desmadra.arequipet.ga
                </Typography>
            </Grid>
            <Grid xs={12}>
                <Typography variant="h3" sx={{ marginBottom: "2%" }}>
                    1.16.5
                </Typography>
            </Grid>

            {loading ?
                <>
                    <Grid xs={12} sx={{ marginBottom: "2%" }} container justifyContent="center" >
                        <Skeleton variant="rectangular" width={matches ? '20%' : '80%'} height={400} sx={{ bgcolor: 'grey.900' }} />
                    </Grid>
                    <Grid xs={12} sx={{ marginBottom: "2%" }} container justifyContent="center" >
                        <Skeleton variant="rectangular" width="60%" height={50} sx={{ bgcolor: 'grey.900' }} />
                    </Grid>
                    <Grid xs={12} sx={{ marginBottom: "2%" }} container justifyContent="center" >
                        <Skeleton variant="rectangular" width="80%" height={50} sx={{ bgcolor: 'grey.900' }} />
                    </Grid>
                </>
                :
                <>
                    <Grid xs={12} width="80%" container justifyContent="center"  sx={{ marginBottom: "2%" }}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={image}
                                alt="server_logo"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <FiberManualRecordIcon
                                        fontSize="small"
                                        sx={{
                                            mr: 1,
                                            color: status ? '#4caf50' : '#d9182e',
                                        }}
                                    />
                                    {status ? "Prendido" : "Apagado"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {online}/{max}
                                </Typography>
                                <div dangerouslySetInnerHTML={{ __html: motd }}></div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid width="60%" sx={{ marginBottom: "2%" }}>
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
                    <Grid width="80%" sx={{ marginBottom: "2%" }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}>
                                <Typography>Mods</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container columnSpacing={5} justifyContent="center">
                                    {mods.map(((mod, index) =>
                                        <Grid key={index}>
                                            <Typography>
                                                {mod}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </>
            }

        </Grid>
    );
}

export default Status;
