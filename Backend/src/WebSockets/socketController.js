const backupSocketController = require('./backupSocket');
const adminSocketController = require('./adminSocket');
const serverSocketController = require('./serverSocket');
const verifySocketsToken = require('../middlewares/verifySocketsToken');
const { spawn } = require('child_process');

let dockerLogsProcess;
let isDockerLogsProcessRunning = false;
let isRunCCommandRunning = false;
let commandType = 0;
async function configureSockets(io) {
    io.on('connection', async (socket) => {
        console.log('Client connected');

        const token = socket.handshake.auth.token;

        if (!token) {
            console.log('A client tried to connect, No token provided.');
            socket.emit('authentication-error', 'Authentication failed. No token provided.');
            socket.disconnect(true);
            return;
        }

        try {
            const result = await verifySocketsToken(token);

            if (!result.isValid) {
                console.log('A client tried to connect, Unauthorized access');
                socket.emit('authentication-error', 'Authentication failed. Invalid token.');
                socket.disconnect(true);
                return;
            }

            if (!dockerLogsProcess) {
                startDockerLogs(io);
            }

            socket.on('create-backup-file', (message) => {
                console.log('Starting creating backup');
                backupSocketController.createBackup(io);
            });

            socket.on('create-zip-file', (message) => {
                console.log('Starting creating zip mods file');
                adminSocketController.createModsFile(io);
            });

            setInterval(() => adminSocketController.performTcpPing(io), 5000);

            socket.on('run-c-command', async (message) => {
                if (isRunCCommandRunning) {
                    console.log('run-c-command is already running, ignoring the request.');
                    socket.emit('c-command', {type:-1, error: false, isCompleted: false, message: "There is a command currently running"});
                    return;
                }

                try {
                    socket.emit('c-command', {type:message.type, error: false, isCompleted: false, message: `Process started by ${result.nickName}`});
                    io.emit('docker-logs', `Process started by ${result.nickName}`);
                    switch (message.type) {
                        case 0:
                            commandType = 0;
                            await serverSocketController.startServer(io);
                            break;
                        case 1:
                            commandType = 1;
                            await serverSocketController.stopServer(io);
                            break;
                        case 2:
                            commandType = 2;
                            await serverSocketController.restartServer(io);
                            break;
                        case 3:
                            commandType = 3;
                            await serverSocketController.deleteServer(io);
                            break;
                        default:
                            commandType = -1;
                            console.log('Unknown message type:', message.type);
                            break;
                    }
                } catch (error) {
                    console.error('Error during run-c-command:', error);
                    socket.emit('c-command', {type:commandType, error: true, isCompleted: false, message: "There was an error running the command"});
                } finally {
                    isRunCCommandRunning = false;
                    io.emit('c-command', {type: commandType, isCompleted: true, error: false, message: "Process Completed"});
                    io.emit('docker-logs', `The process requested by ${result.nickName} is done`);
                }
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

async function startDockerLogs(io) {
    if (isDockerLogsProcessRunning) {
        return; // If the process is already running, do nothing
    }

    console.log('Starting Docker logs stream');
    isDockerLogsProcessRunning = true;
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    dockerLogsProcess = spawn('docker', ['attach', '--no-stdin', maincraContainer]);

    dockerLogsProcess.stdout.on('data', (data) => {
        const logMessage = data.toString();
        io.emit('docker-logs', logMessage);
    });

    dockerLogsProcess.stderr.on('data', (data) => {
        const logMessage = data.toString();
        io.emit('docker-logs-error', logMessage);
    });

    dockerLogsProcess.on('exit', (code) => {
        console.error(`Docker logs process exited with code ${code}`);
        isDockerLogsProcessRunning = false;

        // Schedule a restart attempt after 5 seconds
        setTimeout(() => {
            startDockerLogs(io);
        }, 5000);
    });
}

module.exports = configureSockets;
