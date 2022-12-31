import React from 'react';
import AdminDrawer from "./drawer";
import Terminal from 'terminal-in-react';
import Typography from '@mui/material/Typography';
import RconApi from '../../services/rcon';
function Server() {

    return (
        <AdminDrawer>
            <Typography margin={3} variant="h2" gutterBottom>
                Ejecutar comando
            </Typography>
            <Terminal
                color='green'
                backgroundColor='black'
                barColor='black'
                style={{ fontWeight: "bold", fontSize: "1em", width:"100%" }}
                allowTabs={false}
                commands={{
                    'mine-help': ((data,print) => {
                        RconApi.runCommand("help").then((res) => {
                            print(res.data.message)
                        }).catch((err) => {
                            print("Ocurrio un error al ejecutar el comando")
                        })
                    }),
                }}
                descriptions={{
                    'mine-help': 'obten los comandos de apoyo',
                }}
                commandPassThrough={(cmd, print) => {
                    RconApi.runCommand(cmd.join(' ')).then((res) => {
                        print(res.data.message)
                    }).catch((err) => {
                        print("Ocurrio un error al ejecutar el comando")
                    })
                }}
                msg='Minecraft Terminal escriba help para mas informacion'
            />
        </AdminDrawer>
    );
}

export default Server;
