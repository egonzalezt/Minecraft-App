const app = require('./src/app');
const PORT = process.env.PORT || 8000;
const http = require('http').createServer(app);
const backupSocketController = require('./src/WebSockets/backupSocket')
const adminSocketController = require('./src/WebSockets/adminSocket')

const verifySocketsToken = require('./src/middlewares/verifySocketsToken')
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('create-backup-file', (message) => {
        verifySocketsToken(socket, () => {
            backupSocketController.createBackup(io)
        })
    });

    socket.on('create-zip-file', (message) => {
        verifySocketsToken(socket, () => {
            adminSocketController.createModsFile(io)
        })
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

http.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});