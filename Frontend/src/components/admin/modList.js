import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminApi from '../../services/admin';

import { DataGrid } from '@mui/x-data-grid';
import AdminDrawer from "./drawer.js";

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
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
      params.row.type.reduce((type, text) => `${type}${text} `, ""),
    },
  ];

export default function ModList() {

    const [mods, setMods] = useState([]);
    const pageSize = 10;
    useEffect(() => {
        AdminApi.mods(0,pageSize).then(response => {
            const modsTemp = response.data.mods
            for (let i = 0; i < modsTemp.length; i++) {
                modsTemp[i]["id"]=i+1;
            }
            setMods(modsTemp)
        }).catch(e => {
            console.log(e.response.data.message)
        });
    }, []);

    return (
        <AdminDrawer>
            <Box sx={{ flexGrow: 1, width: "80%" }}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        Lista de Mods
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={mods}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                    </Box>
                </Grid>
            </Box>
        </AdminDrawer>
    );
}