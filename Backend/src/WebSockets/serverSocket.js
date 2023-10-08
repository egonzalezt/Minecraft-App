const { deleteFolderAsync, runCommand } = require('../utils/deleteServer')
var util = require('util');
const exec = util.promisify(require('child_process').exec);

async function executeDockerCommandAsync(command) {
    try {
        const { stdout, stderr } = await exec(command);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return { error: `Error running ${command}` };
        } else {
            return { result: stdout };
        }
    } catch (error) {
        console.error(`Error executing '${command}': ${error.message}`);
        return { error: `Error running ${command}` };
    }
    return;
}

async function stopServer(io) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker stop ${maincraContainer}`;
    
    try {
        const result = await executeDockerCommandAsync(command);
        if (result.error) {
            io.emit('docker-logs', "There is an error stopping the server");
            io.emit('c-command', {type:1, error: true, message: "There is an error stopping the server"});
        } else {
            io.emit('docker-logs', "Server stopped successfully");
            io.emit('c-command', {type:1, error: false, message: "Server stopped successfully"});
        }
    } catch (error) {
        console.error(error);
        io.emit('c-command', {type:1, error: true, message: "There is an error stopping the server"});
        io.emit('c-command', {type:1, error: true, message: "There is an error stopping the server"});
    }
    return;
}

async function startServer(io) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker start ${maincraContainer}`;
    
    try {
        const result = await executeDockerCommandAsync(command);
        if (result.error) {
            io.emit('docker-logs', "There is an error starting the server");
            io.emit('c-command', {type:0, error: true, isCompleted: false, message: "There is an error starting the server"});
        } else {
            io.emit('docker-logs', "Server started successfully");
            io.emit('c-command', {type:0, error: false, isCompleted: false, message: "Server started successfully"});
        }
    } catch (error) {
        console.error(error);
        io.emit('docker-logs', "There is an error starting the server");
        io.emit('c-command', {type:0, error: true, isCompleted: false, message: "There is an error starting the server"});
    }
    return new Promise(async (resolve, reject) => {
        async function waitForSuccess() {
            const success = await runCommand(io);
            if (success) {
                console.log('Command was successful');
                io.emit('c-command', {type: 3, error: false, isCompleted: false, message: "Server started successfully"});
                io.emit('docker-logs', "Server successfully started");
                resolve();
            } else {
                setTimeout(waitForSuccess, 5000);
            }
        }

        waitForSuccess();
    });
}

async function restartServer(io) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker restart ${maincraContainer}`;
    
    try {
        const result = await executeDockerCommandAsync(command);
        if (result.error) {
            io.emit('docker-logs', "There is an error restarting the server");
            io.emit('c-command', {type:2, error: true, isCompleted: false, message: "There is an error restarting the server"});
        } else {
            io.emit('docker-logs', "Server restarted successfully");
            io.emit('c-command', {type:2, error: false, isCompleted: false, message: "Server restarted successfully"});
        }
    } catch (error) {
        console.error(error);
        io.emit('docker-logs', "There is an error restarting the server");
        io.emit('c-command', {type:2, error: true, isCompleted: false, message: "There is an error restarting the server"});
    }
    return;
}

async function deleteServer(io) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const commandStop = `docker stop ${maincraContainer}`;
    const commandStart = `docker start ${maincraContainer}`;
    io.emit('docker-logs', "Start process to restart world");

    try {
        await executeDockerCommandAsync(commandStop);
        io.emit('docker-logs', "Stopping server");
    } catch (error) {
        console.log(error)
        io.emit('c-command', {type:3, error: true, isCompleted: false, message: "There is an error stopping the server"});
        io.emit('docker-logs', "There is an error stopping the server");
        return;
    }

    try {
        io.emit('docker-logs', "Deleting world");
        await deleteFolderAsync(io);
    } catch (error) {
        io.emit('docker-logs', "There is an error deleting the world");
        console.log(error);
    }

    try {
        await executeDockerCommandAsync(commandStart);
        io.emit('docker-logs', "Server started, waiting to be ready");
    } catch (error) {
        io.emit('docker-logs', "There is an error starting the server");
        io.emit('c-command', {type:3, error: true, isCompleted: false, message: "There is an error starting the server"});
        return;
    }

    // Wrap waitForSuccess in a Promise to ensure it returns
    return new Promise(async (resolve, reject) => {
        async function waitForSuccess() {
            const success = await runCommand(io);
            if (success) {
                console.log('Command was successful');
                io.emit('c-command', {type: 3, error: false, isCompleted: false, message: "World deleted successfully"});
                io.emit('docker-logs', "World deleted and recreated successfully");
                resolve();
            } else {
                setTimeout(waitForSuccess, 5000);
            }
        }

        waitForSuccess();
    });
}

module.exports = { startServer, restartServer, stopServer, deleteServer };