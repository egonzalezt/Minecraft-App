const Gamedig = require('gamedig');

function getServerInformation(req, res) {
    Gamedig.query({
        type: 'minecraft',
        host: process.env.MINECRAFT_HOST
    }).then((state) => {
        const newJson = {
            name: state.name,
            maxplayers: state.maxplayers,
            players: state.players,
            bots: state.bots,
            connect: state.connect,
            ping: state.ping
        };
        return res.status(200).json({ error: false, message: "Information successfully obtained", information: newJson });
    }).catch(() => {
        return res.status(503).json({ error: false, message: "Cannot get the required information, server is down" });
    });
}

module.exports = {getServerInformation};