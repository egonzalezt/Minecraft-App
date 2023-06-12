const copyModsAndCreateZipSocket = require('../utils/copyModsAndCreateZipSocket')
const net = require('net');

async function createModsFile(io) {
    await copyModsAndCreateZipSocket(io)
}

function performTcpPing(io) {
    const client = new net.Socket();
    const host = process.env.AREQUIPET_MINESERVER_HOST
    const port = process.env.AREQUIPET_MINESERVER_PORT

    client.connect(port, host, () => {
        io.emit('tcpPingResult', {isAvailable:true,message:"Disponible"});
        client.end();
    });

    client.on('error', (err) => {
        io.emit('tcpPingResult', {isAvailable:false,message:"No Disponible"});
    });

    client.on('close', () => {
        //console.log("Cerrado")
    });
}

module.exports = {
    createModsFile,
    performTcpPing
};