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


const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function ModList() {

    const [mods, setMods] = useState([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

    // useEffect(() => {
    //     AdminApi.mods().then(response => {
    //         console.log(response.data);
    //         setMods(response.data.mods)
    //     }).catch(e => {
    //         console.log(e.response.data.message)
    //     });
    // }, []);

    return (
        <AdminDrawer>
            <Box sx={{ flexGrow: 1, width: "80%" }}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 2 }} variant="h2" component="div">
                        Lista de Mods
                    </Typography>
                    <Demo>
                        <List>
                            {mods.map((mod, index) => {
                                return <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ArchiveOutlinedIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={mod}
                                    />
                                </ListItem>
                            })}
                        </List>
                    </Demo>
                </Grid>
            </Box>
        </AdminDrawer>
    );
}