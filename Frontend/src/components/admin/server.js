import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SocketClient from '../../socketConnection'
import Swal from 'sweetalert2'
import LoadingButton from '@mui/lab/LoadingButton';
import server from '../../services/server';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
const avatars = ["alex", "cave-spider", "cow", "creeper", "enderman", "pig", "sheep",
    "skeleton", "spider", "steve", "villager", "wolf", "zombie"]

export default function BackupList() {
    const { t } = useTranslation();
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverDataLoading, setServerDataLoading] = useState(true);
    const [serverData, setServerData] = useState({
        "name": "",
        "maxplayers": 0,
        "players": [],
        "bots": [],
        "connect": "",
        "ping": 0
    });
    const serverName = "arequipet.server.vasitos.org";
    const matches = useMediaQuery('(min-width:700px)');

    const initializeSocket = () => {
        const newSocket = SocketClient;
        setSocket(newSocket);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await server.getServerInfo();
                console.log(response)
                setServerData(response.data.information);
                setServerDataLoading(false);
            } catch (error) {
                // Handle error
                setServerDataLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        initializeSocket();

        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('authentication-error', () => {
            Swal.fire({
                icon: 'error',
                title: `${t("commons.errors.oops")}...`,
                text: t("commons.errors.authentication"),
            });
        });

        socket.on('c-command', (data) => {
            if (data?.isCompleted) {
                setIsLoading(false);
                let message = "";
                switch (data.type) {
                    case 0:
                        message = t("server.serverStarted")
                        break;
                    case 1:
                        message = t("server.serverStopped")
                        break;
                    case 2:
                        message = t("server.serverRestarted")
                        break;
                    case 3:
                        message = t("server.serverDeleted")
                        break;
                    default:
                        message = t("commons.complete")
                }
                Swal.fire({
                    icon: 'success',
                    title: t("server.actionPerformed"),
                    text: message,
                });
            }
        });

        return () => {
            socket.off('authentication-error');
            socket.off('c-command');
        };
    }, [socket]);

    const handleButtonClick = (action) => {
        if (action === 1 || action === 3) {
            Swal.fire({
                title: t("server.confirmAlert.title"),
                text: t("server.confirmAlert.message"),
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: t("commons.yes"),
                denyButtonText: t("commons.no"),
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    let json = { "type": action }
                    socket.emit('run-c-command', json);
                }
            });
        } else {
            setIsLoading(true);
            let json = { "type": action }
            socket.emit('run-c-command', json);
        }
    };

    return (
        <div>
            <Stack spacing={4} direction="column" justifyContent="center" alignItems="center" >
                <Typography sx={{ mb: 2 }} variant="h2">
                    {t("server.title", { name: serverName })}
                </Typography>
                {
                    serverDataLoading ?
                        <>
                            <Grid xs={12} sx={{ marginBottom: "2%" }} container justifyContent="center" >
                                <Skeleton variant="rounded" width={matches ? '50%' : '100%'} height={50} />
                            </Grid>
                        </>
                        :
                        <>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={5}>
                                <Typography sx={{ mb: 2 }} variant="h3">
                                    {serverData.name}
                                </Typography>
                                <Typography sx={{ mb: 2 }} variant="h3">
                                    {t("server.uploadMod")}: {serverData.maxplayers}
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={5}>
                                <Typography sx={{ mb: 2 }} variant="h3">
                                    {t("server.ping")} {serverData.ping}
                                </Typography>
                            </Stack>
                        </>
                }
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={5}>
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<PlayCircleOutlineIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ width: 'auto' }}
                        onClick={() => handleButtonClick(0)}
                    >
                        {t("server.start")}
                    </LoadingButton>

                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<RestartAltIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ width: 'auto' }}
                        onClick={() => handleButtonClick(2)}
                    >
                        {t("server.restart")}
                    </LoadingButton>

                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<StopCircleIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ width: 'auto' }}
                        onClick={() => handleButtonClick(1)}
                    >
                        {t("server.stop")}
                    </LoadingButton>

                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<DeleteForeverIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ width: 'auto' }}
                        onClick={() => handleButtonClick(3)}
                    >
                        {t("server.delete")}
                    </LoadingButton>
                </Stack>

                <Typography sx={{ mb: 2 }} variant="h2">
                    {t("commons.players")}
                </Typography>

                {
                    serverDataLoading ?
                        <>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Skeleton variant="circular" width={50} height={50} animation="wave" />
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rectangular" width={200} height={50} animation="wave" />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Skeleton variant="circular" width={50} height={50} animation="wave" />
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rectangular" width={200} height={50} animation="wave" />
                                </Grid>
                            </Grid>
                        </>
                        :
                        <>
                            {serverData.players.length === 0 ?
                                <Typography sx={{ mb: 2 }} variant="h3">
                                    Sin Jugadores
                                </Typography>
                                :
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    {serverData.players.map(((player) =>
                                        <>
                                            <ListItem id={player.raw.id} alignItems="center">
                                                <ListItemAvatar>
                                                    <Avatar src={`/assets/images/maincra-icons/${avatars[Math.floor(Math.random() * avatars.length)]}.svg`} alt="photoURL" />                        </ListItemAvatar>
                                                <ListItemText
                                                    primary={player.name}
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </>
                                    ))}
                                </List>
                            }

                        </>
                }
            </Stack>
        </div>
    );
}
