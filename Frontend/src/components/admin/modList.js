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

import AdminDrawer from "./drawer.js";

function generate(element) {
    return [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function ModList() {

    // const [mods, setMods] = useState([]);

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
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h2" component="div">
                        Lista de Mods
                    </Typography>
                    <Demo>
                        <List>
                            {generate(
                                <ListItem
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
                                        primary="Single-line item"
                                    />
                                </ListItem>,
                            )}
                        </List>
                    </Demo>
                </Grid>
            </Box>
        </AdminDrawer>
    );
}