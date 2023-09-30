import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AdminApi from '../../services/admin';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ModsApi from '../../services/mods'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next';

export default function UserModList() {
    const { t } = useTranslation();
    const [mods, setMods] = useState([]);
    const [totalMods, setTotalMods] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        {
            field: 'name',
            headerName: t("listMods.table.name"),
            minWidth: 200,
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
            minWidth: 200,
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
                const date = new Date(cellValues.row.createdAt)
                const time_difference = Date.now() - date.getTime();
                const days_difference = time_difference / (1000 * 60 * 60 * 24);
                return (
                    <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={async () => await downloadMod(cellValues)}
                    >
                        {days_difference <= 2 &&
                            <Typography>{t("listMods.newResource")}</Typography>
                        }
                        <DownloadIcon />
                    </IconButton>
                );
            }
        },
    ];

    async function downloadMod(cellValues) {
        setIsLoading(true);
        ModsApi.downloadMod(cellValues.id).then(({ data }) => {
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
            }).then(() => setIsLoading(false));
        }).catch(err => {
            setIsLoading(false);
            Swal.fire({
                timer: 4000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
                text: "Ocurrio un error al intentar descargar el mod porfavor intentelo mas tarde.",
            });
        });
    }

    function searchData(page) {
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

    return (
        <Box>
            <Grid item xs={12} md={6}>
                <Typography sx={{ mb: 2 }} variant="h2" component="div">
                    {t("listMods.title")}
                </Typography>
                <Box sx={{ height: 800, width: '100%' }}>
                    <DataGrid
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
                        disableSelectionOnClick
                        keepNonExistentRowsSelected
                    />
                </Box>
            </Grid>
        </Box>
    );
}