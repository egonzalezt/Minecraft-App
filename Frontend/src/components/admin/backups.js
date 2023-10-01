import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BackupsApi from '../../services/backups';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { storeSkin } from '../../states/skinStore';
import { useTranslation } from 'react-i18next';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';

import SocketClient from '../../socketConnection'

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

    const [backups, setBackups] = useState([]);
    const [totalBackups, setTotalBackups] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBackups, setSelectedBackups] = useState([]);
    const [loadingZipCreation, setLoadingZipCreation] = useState(false);
    const [deletingBackups, setDeletingBackups] = useState(false);
    const [message, setMessage] = useState({});
    const [socket, setSocket] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const setAnimation = storeSkin((state) => state.setAnimation);
    const getAnimation = storeSkin(state => state.animation);
    const setSpeed = storeSkin((state) => state.setSpeed);
    const getSpeed = storeSkin(state => state.speed);
    const { t } = useTranslation();

    const columns = [
        {
            field: 'fileName',
            headerName: t("backups.table.fileName"),
            minWidth: 300,
            flex: 1,
            editable: false,
        },
        {
            field: 'createdAt',
            headerName: t("backups.table.createdAt"),
            minWidth: 150,
            flex: 1,
            editable: false,
        },
        {
            field: "download",
            minWidth: 150,
            flex: 1,
            headerName: t("commons.download"),
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={async () => await downloadBackup(cellValues)}
                    >
                        <DownloadIcon />
                    </IconButton>
                );
            }
        },
    ];

    async function downloadBackup(cellValues) {

        const downloadLink = `https://drive.google.com/uc?id=${cellValues.row.gdriveId}&export=download`
        window.open(downloadLink, '_blank');

        /*setIsLoading(true);
        setDownloadProgress(0);

        try {
            const { data } = await BackupsApi.downloadBackup(cellValues.id, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setDownloadProgress(progress);
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', cellValues.row.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();

            Swal.fire({
                timer: 2000,
                timerProgressBar: true,
                icon: 'success',
                title: 'Completado',
                text: 'El recurso se obtuvo de forma exitosa',
            }).then(() => setIsLoading(false));
        } catch (err) {
            setIsLoading(false);
            Swal.fire({
                timer: 4000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar descargar el backup. Por favor, inténtelo más tarde.',
            });
        }*/
    }

    const createZipRequest = () => {
        if (socket === null) {
            initializeSocket();
        }
        setLoadingZipCreation(true);
        socket.emit('create-backup-file');
        setAnimation(1)
    };

    const initializeSocket = () => {
        const newSocket = SocketClient;
        setSocket(newSocket);
    };

    function searchData(page) {
        setCurrentPage(page);
        setIsLoading(true)
        BackupsApi.backups(page + 1, pageSize).then(response => {
            const backupsTemp = response.data.backups
            for (let i = 0; i < backupsTemp.length; i++) {
                backupsTemp[i]["id"] = backupsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalBackups(response.data.total)
            setBackups(backupsTemp)
        }).catch(e => {

        });
    }

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
            setLoadingZipCreation(false);
        });

        socket.on('backup-creation-status', (data) => {
            !loadingZipCreation && setLoadingZipCreation(true);

            setMessage(data);
            if (data?.taskComplete) {
                setLoadingZipCreation(false);
            }
            if (data?.type === 'statusSuccess' && !data?.error) {
                setSpeed(1);
                setAnimation(1);
                Swal.fire({
                    icon: 'success',
                    title: t("backups.completePopUp.title"),
                    text: t("backups.completePopUp.text"),
                }).then(() => window.location.reload());
            }
            if (data?.type === 'statusFail' && data?.error) {
                Swal.fire({
                    icon: 'error',
                    title: `${t("commons.errors.oops")}...`,
                    text: t("commons.errors.genericMessage"),
                });
            }

            if (data?.type === 'statusPercentZip') {
                if(getAnimation!==1){
                    setAnimation(1);
                }
                var speedValue = parseInt(data.value);
                var currentSpeed = parseInt(getSpeed);
                if(speedValue !== currentSpeed){
                    let newSpeed = speedValue/100;
                    setSpeed(newSpeed);
                }
            } 
            if (data?.type === 'statusPercentGdrive') {
                if(getAnimation!==2){
                    setAnimation(2);
                }
                var speedValue = parseInt(data.value);
                var currentSpeed = parseInt(getSpeed);
                if(speedValue !== currentSpeed){
                    let newSpeed = speedValue/100;
                    setSpeed(newSpeed);
                }
            } 
        });

        socket.on('disconnect', () => {
            setLoadingZipCreation(false);
        });

        return () => {
            socket.off('authentication-error');
            socket.off('backup-creation-status');
            socket.off('disconnect');
        };
    }, [socket]);

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
        BackupsApi.backups(0, pageSize).then(response => {
            const backupsTemp = response.data.backups
            for (let i = 0; i < backupsTemp.length; i++) {
                backupsTemp[i]["id"] = backupsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalBackups(response.data.total)
            setBackups(backupsTemp)
        }).catch(e => {

        });
    }, [pageSize]);

    async function removeBackups() {
        setIsLoading(true);
        Swal.fire({
            title: t("backups.deleteQuestion"),
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `Nel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeletingBackups(true)
                await BackupsApi.deleteBackups(selectedBackups).then(async res => {
                    await Toast.fire({
                        icon: 'info',
                        title: t("backups.deletingBackups")
                    })
                    setDeletingBackups(false);
                    searchData(currentPage);
                    Swal.fire({
                        icon: 'success',
                        title: t("commons.complete"),
                        text: res.data.message,
                    }).then(() => setIsLoading(false));
                });
            } else if (result.isDenied) {
                setIsLoading(false);
                await Toast.fire({
                    icon: 'info',
                    title: t("commmons.operationCancel")
                })
            }
        }).catch(() => {
            setDeletingBackups(false);
            Swal.fire({
                icon: 'error',
                title: t("commons.errors.oops"),
                text: t("backups.backupErrorTitle"),
            })
        });
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                <LoadingButton
                    color="secondary"
                    onClick={removeBackups}
                    loading={deletingBackups}
                    variant="contained"
                    disabled={selectedBackups.length <= 0}
                    sx={{ width: "5%", alignItems: "center", alignContent: "center" }}>
                    <DeleteRoundedIcon />
                </LoadingButton>
                <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }

    return (
        <div>
            <Box >
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        {t("backups.title")}
                    </Typography>
                    <Box sx={{ height: 450, width: '100%' }}>
                        <DataGrid
                            // autoHeight
                            pagination
                            loading={isLoading}
                            rows={backups}
                            columns={columns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[3, 5, 8, 15, 30]}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowCount={totalBackups}
                            paginationMode="server"
                            onPageChange={searchData}
                            checkboxSelection
                            disableSelectionOnClick
                            onSelectionModelChange={(newSelectionBackup) => {
                                setSelectedBackups(newSelectionBackup);
                            }}
                            selectionModel={selectedBackups}
                            keepNonExistentRowsSelected
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                        />
                    </Box>
                </Grid>
                <LoadingButton
                    color="secondary"
                    onClick={createZipRequest}
                    loading={loadingZipCreation}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    sx={{ marginTop: "5%", width: "20%" }}
                >
                    {t("backups.createBackups")}
                </LoadingButton>

                {(message?.value && message.type === "statusPercentZip") && (
                    <Box sx={{ marginTop: "2%" }}>
                        <Typography variant="body1" gutterBottom>
                            {t("backups.creationProgress",{value: message.value})}
                        </Typography>
                        <LinearProgress variant="determinate" value={message.value} />
                    </Box>
                )}

                {(message?.value && message.type === "statusGdrive") && (
                    <Box sx={{ marginTop: "2%" }}>
                        <Typography variant="body1" gutterBottom>
                            {message.value}
                        </Typography>
                    </Box>
                )}

                {(message?.value && message.type === "statusPercentGdrive") && (
                    <Box sx={{ marginTop: "2%" }}>
                        <Typography variant="body1" gutterBottom>
                            {t("backups.driveProgress",{value: message.value})}
                        </Typography>
                        <LinearProgress variant="determinate" value={message.value} />
                    </Box>
                )}

                {(message?.value && message.type === "statusSuccess") && (
                    <Box sx={{ marginTop: "2%" }}>
                        <Typography variant="body1" gutterBottom>
                            {message.value}
                        </Typography>
                    </Box>
                )}

                {isLoading && downloadProgress > 0 &&
                    (
                        <Box sx={{ marginTop: "2%" }}>
                            <Typography variant="body1" gutterBottom>
                                {t("backups.downloadBackup",{value: message.value})}
                            </Typography>
                            <LinearProgress variant="determinate" value={downloadProgress} />
                        </Box>
                    )}
            </Box>
        </div>
    );
}