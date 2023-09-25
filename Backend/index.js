const app = require('./src/app');
const PORT = process.env.PORT || 8000;
const http = require('http').createServer(app);
const configureSockets = require('./src/WebSockets/socketController')
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

configureSockets(io);


http.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Server shutting down...');
    http.close(() => {
        console.log('Server shut down successfully.');
        process.exit(0);
    });
});