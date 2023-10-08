import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
})

export default function BackupList() {
    const { t } = useTranslation();
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const serverName = "arequipet.server.vasitos.org";
    const initializeSocket = () => {
        const newSocket = SocketClient;
        setSocket(newSocket);
    };

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
                    title: `Accion completada de forma exitosa`,
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
        if(action===1 || action===3){
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
                    let json = {"type": action}
                    socket.emit('run-c-command',json);
                }
            });
        }else{
            setIsLoading(true);
            let json = {"type": action}
            socket.emit('run-c-command',json);
        }
    };

    return (
        <div>
            <Box sx={{ mb: 10 }}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        {t("server.title", {name: serverName})}
                    </Typography>
                </Grid>
            </Box>
            <Stack direction="column">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={5}>
                    <LoadingButton
                        loading = {isLoading}
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
                        loading = {isLoading}
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
                        loading = {isLoading}
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
                        loading = {isLoading}
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
            </Stack>
        </div>
    );
}
