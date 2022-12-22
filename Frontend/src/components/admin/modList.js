import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AdminApi from '../../services/admin';
import Button from '@mui/material/Button';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Swal from 'sweetalert2'

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save'; 
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import AdminDrawer from "./drawer.js";

const columns = [
    {
        field: 'name',
        headerName: 'Nombre',
        width: 300,
        editable: false,
    },
    {
        field: 'version',
        headerName: 'Version',
        width: 150,
        editable: false,
    },
    {
        field: 'fileName',
        headerName: 'Archivo',
        width: 300,
        editable: false,
    },
    {
        field: 'type',
        headerName: 'Tipo Mod',
        editable: false,
        width: 200,
        valueGetter: (params) =>
            params.row.type.join(", "),
    },
];

export default function ModList() {

    const [mods, setMods] = useState([]);
    const [totalMods, setTotalMods] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMods, setSelectedMods] = useState([]);
    const [loadingZipCreation, setLoadingZipCreation] = useState(false);

    const createZipRequest = () => {
        setLoadingZipCreation(true)
        AdminApi.createZip().then(response => {
            setLoadingZipCreation(false)
            Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: 'Se han creado los mods en un archivo .Zip',
                footer: '<a href="/api/v1/mods/download">Descargar zip generado</a>'
            })  
        }).catch(err => {
            setLoadingZipCreation(false)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error',
            })
        })
    }

    function searchData(page) {
        setIsLoading(true)
        AdminApi.mods(page + 1, pageSize).then(response => {
            console.log(response.data)
            const modsTemp = response.data.mods
            for (let i = 0; i < modsTemp.length; i++) {
                modsTemp[i]["id"] = modsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalMods(response.data.total)
            setMods(modsTemp)
        }).catch(e => {
            console.log(e.response.data.message)
        });
    }

    useEffect(() => {
        AdminApi.mods(0, pageSize).then(response => {
            console.log(response.data)
            const modsTemp = response.data.mods
            for (let i = 0; i < modsTemp.length; i++) {
                modsTemp[i]["id"] = modsTemp[i]._id;
            }
            setIsLoading(false)
            setTotalMods(response.data.total)
            setMods(modsTemp)
        }).catch(e => {
            console.log(e.response.data.message)
        });
    }, [pageSize]);

    function deleteMods() {
        alert(selectedMods.join(" | "))
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                <Button disabled={ selectedMods.length <= 0 } sx={{ width: "5%" }} onClick={deleteMods}>
                    <DeleteRoundedIcon />
                </Button>
                <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }

    return (
        <AdminDrawer>
            <Box sx={{ flexGrow: 1, width: "85%" }}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        Lista de Mods
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
                        sx={{marginTop:"5%", width:"20%"}}
                    >
                        Crear .ZIP
                </LoadingButton>
            </Box>
        </AdminDrawer>
    );
}