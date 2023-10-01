import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AdminApi from '../../services/admin';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Swal from 'sweetalert2'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { storeSkin } from '../../states/skinStore';
import { useTranslation } from 'react-i18next';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress'; // Importar componente LinearProgress
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

export default function ModList() {

    const [mods, setMods] = useState([]);
    const [totalMods, setTotalMods] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMods, setSelectedMods] = useState([]);
    const [loadingZipCreation, setLoadingZipCreation] = useState(false);
    const [deletingMods, setDeletingMods] = useState(false);
    const [message, setMessage] = useState({});
    const [socket, setSocket] = useState(null);
    const setAnimation = storeSkin((state) => state.setAnimation);
    const getAnimation = storeSkin(state => state.animation);
    const setSpeed = storeSkin((state) => state.setSpeed);
    const getSpeed = storeSkin(state => state.speed);
    const { t } = useTranslation();

    const columns = [
        {
            field: 'name',
            headerName: t("listMods.table.name"),
            minWidth: 300,
            flex: 1,
            editable: false,
        },
        {
            field: 'version',
            headerName: t("listMods.table.version"),
            minWidth: 150,
            flex: 1,
            editable: false,
        },
        {
            field: 'fileName',
            headerName: t("listMods.table.fileName"),
            minWidth: 300,
            flex: 1,
            editable: false,
        },
        {
            field: 'type',
            headerName: t("listMods.table.type"),
            editable: false,
            minWidth: 200,
            flex: 1,
            valueGetter: (params) =>
                params.row.type.join(", "),
        },
    ];
    
    const initializeSocket = () => {
        const newSocket = SocketClient;
        setSocket(newSocket);
    };

    const createZipRequest = () => {
        if (socket === null) {
            initializeSocket();
        }
        setLoadingZipCreation(true);
        socket.emit('create-zip-file');
        setAnimation(1)
    }

    function searchData(page) {
        setCurrentPage(page);
        setIsLoading(true)
        AdminApi.mods(page + 1, pageSize).then(response => {
            const modsTemp = response.data.mods
            for (let i = 0; i < modsTemp.length; i++) {
                modsTemp[i]["id"] = modsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalMods(response.data.total)
            setMods(modsTemp)
        }).catch(e => {

        });
    }

    useEffect(() => {
        AdminApi.mods(0, pageSize).then(response => {
            const modsTemp = response.data.mods
            for (let i = 0; i < modsTemp.length; i++) {
                modsTemp[i]["id"] = modsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalMods(response.data.total)
            setMods(modsTemp)
        }).catch(e => {

        });
    }, [pageSize]);

    async function removeMods() {
        setIsLoading(true);
        Swal.fire({
            title: t("listMods.deleteMods"),
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: t("commons.yes"),
            denyButtonText: t("commons.no"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeletingMods(true)
                await AdminApi.deleteMods(selectedMods).then(async res => {
                    await Toast.fire({
                        icon: 'info',
                        title: 'Eliminando Mods'
                    })
                    setDeletingMods(false);
                    searchData(currentPage);
                    Swal.fire({
                        icon: 'success',
                        title: 'Completado',
                        text: res.data.message,
                    }).then(() => setIsLoading(false));
                });
            } else if (result.isDenied) {
                await Toast.fire({
                    icon: 'info',
                    title: 'Operacion cancelada'
                })
            }
        }).catch(() => {
            setIsLoading(false);
            setDeletingMods(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error elimiando los mods',
            })
        });
    }

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('authentication-error', () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No posee permisos',
            });
            setLoadingZipCreation(false);
        });

        socket.on('mod-zip-file-creation-status', (data) => {
            !loadingZipCreation && setLoadingZipCreation(true);

            setMessage(data);
            if (data?.taskComplete) {
                setLoadingZipCreation(false);
            }
            if (data?.type === 'statusSuccess' && !data?.error) {
                setAnimation(1);
                setSpeed(1);
                Swal.fire({
                    icon: 'success',
                    title: 'Completado',
                    text: 'Se ha creado el archivo de mods de forma exitosa',
                });
            }
            if (data?.type === 'statusFail' && data?.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                });
            }

            if (data?.type === 'statusPercent') {
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

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                <LoadingButton
                    color="secondary"
                    onClick={removeMods}
                    loading={deletingMods}
                    variant="contained"
                    disabled={selectedMods.length <= 0}
                    sx={{ width: "5%", alignItems: "center", alignContent: "center" }}>
                    <DeleteRoundedIcon />
                </LoadingButton>
                <Button component={Link} to={"/dashboard/upload"}>{t("listMods.addMod")}</Button>
                <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }

    return (
        <Box>
            <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 2 }} variant="h2" component="div">
                {t("listMods.title")}
                </Typography>
                <Box sx={{ height: 450, width: '100%' }}>
                    <DataGrid
                        // autoHeight
                        pagination
                        loading={isLoading}
                        rows={mods}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[3, 5, 8, 15, 30]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowCount={totalMods}
                        paginationMode="server"
                        onPageChange={searchData}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={(newSelectionMod) => {
                            setSelectedMods(newSelectionMod);
                        }}
                        selectionModel={selectedMods}
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
                {t("listMods.createZip")}
            </LoadingButton>
            {message?.value && (
                <Box sx={{ marginTop: "2%" }}>
                    {message.type === "statusPercent" ?
                        <Typography variant="body1" gutterBottom>
                            Progreso: {message.value}%
                        </Typography>
                        :
                        <Typography variant="body1" gutterBottom>
                            Estado: {message.value}
                        </Typography>
                    }
                    {
                        message.type === "statusPercent" && (
                            <LinearProgress variant="determinate" value={message.value} />
                        )
                    }
                </Box>
            )}
        </Box>
    );
}