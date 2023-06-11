const backupSocketController = require('./backupSocket');
const adminSocketController = require('./adminSocket');
const verifySocketsToken = require('../middlewares/verifySocketsToken');

async function configureSockets(io) {
    io.on('connection', async (socket) => {
        console.log('Client connected');

        const token = socket.handshake.auth.token;

        if (!token) {
            console.log('A client try to connect, No token provided.');
            socket.emit('authentication-error', 'Authentication failed. No token provided.');
            socket.disconnect(true);
            return;
        }

        try {
            const result = await verifySocketsToken(token);

            if (!result.isValid) {
                console.log('A client try to connect, Unauthorized access');
                socket.emit('authentication-error', 'Authentication failed. Invalid token.');
                socket.disconnect(true);
                return;
            }
            //this could be socket or io
            //socket if is only for current client
            socket.on('create-backup-file', (message) => {
                console.log('Starting creating backup');
                backupSocketController.createBackup(io);
            });

            socket.on('create-zip-file', (message) => {
                console.log('Starting creating zip mods file');
                adminSocketController.createModsFile(io);
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
                socket.emit('socket-error', 'An error occurred on the server');
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');
            });
        } catch (error) {
            console.log('Error during token verification:', error);
            socket.emit('authentication-error', 'Authentication failed. Error during token verification.');
            socket.disconnect(true);
        }
    });
}

module.exports = configureSockets;