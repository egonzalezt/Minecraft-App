import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BackupsApi from '../../services/backups';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import AdminDrawer from "./drawer.js";

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

    const columns = [
        {
            field: 'fileName',
            headerName: 'Nombre',
            minWidth: 300,
            flex: 1,
            editable: false,
        },
        {
            field: 'createdAt',
            headerName: 'Fecha de creacion',
            minWidth: 150,
            flex: 1,
            editable: false,
        },
        {
            field: "download",
            minWidth: 150,
            flex: 1,
            headerName: "Descargar",
            sortable: false,
            renderCell: (cellValues) => {
                return (
                <IconButton 
                    aria-label="delete"
                    color="primary"
                    onClick={async () => await downloadBackup(cellValues)}
                >
                    <DownloadIcon/>
                </IconButton>
                );
              }
          },
    ];
    async function downloadBackup(cellValues){
        setIsLoading(true);
        BackupsApi.downloadBackup(cellValues.id).then(({ data }) => {
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
                text: "El recurso de obtuvo de forma exitosa",
            }).then(()=>setIsLoading(false));
        }).catch(err => {
            setIsLoading(false);
            Swal.fire({
                timer: 4000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
                text: "Ocurrio un error al intentar descargar el backup porfavor intentelo mas tarde.",
            });
        });
    }

    const createZipRequest = () => {
        setLoadingZipCreation(true)
        BackupsApi.createBackup().then(response => {
            setLoadingZipCreation(false)
            Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: 'Se creado el backup de forma exitosa',
            })
            searchData(currentPage);
        }).catch(err => {
            setLoadingZipCreation(false)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error',
            })
            console.log(err)
        })
    }

    function searchData(page) {
        setCurrentPage(page);
        setIsLoading(true)
        BackupsApi.backups(page + 1, pageSize).then(response => {
            console.log(response.data)
            const backupsTemp = response.data.backups
            for (let i = 0; i < backupsTemp.length; i++) {
                backupsTemp[i]["id"] = backupsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalBackups(response.data.total)
            setBackups(backupsTemp)
        }).catch(e => {
            console.log(e.response.data.message)
        });
    }

    useEffect(() => {
        BackupsApi.backups(0, pageSize).then(response => {
            console.log(response.data)
            const backupsTemp = response.data.backups
            for (let i = 0; i < backupsTemp.length; i++) {
                backupsTemp[i]["id"] = backupsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalBackups(response.data.total)
            setBackups(backupsTemp)
            console.log(backups);
        }).catch(e => {
            console.log(e.response.data.message)
        });
    }, [pageSize]);

    async function removeBackups() {
        setIsLoading(true);
        Swal.fire({
            title: '¿Estas seguro de eliminar los backups seleccionados?',
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
                        title: 'Eliminando Backups'
                    })
                    setDeletingBackups(false);
                    searchData(currentPage);
                    Swal.fire({
                        icon: 'success',
                        title: 'Completado',
                        text: res.data.message,
                    }).then(()=>setIsLoading(false));
                });
            } else if (result.isDenied) {
                setIsLoading(false);
                await Toast.fire({
                    icon: 'info',
                    title: 'Operacion cancelada'
                })
            }
        }).catch(() => {
            setDeletingBackups(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error elimiando los backups',
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
                    loadingPosition="start"
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
        <AdminDrawer>
            <Box sx={{ flexGrow: 1, width: "85%" }}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        Lista de Backups
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
                    Crear Backup
                </LoadingButton>
            </Box>
        </AdminDrawer>
    );
}