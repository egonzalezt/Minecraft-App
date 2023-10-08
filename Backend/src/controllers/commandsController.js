const { exec } = require('child_process');

function executeDockerCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing '${command}': ${error.message}`);
            callback({ error: `Error running ${command}` });
        } else if (stderr) {
            console.error(`stderr: ${stderr}`);
            callback({ error: `Error running ${command}` });
        } else {
            callback({ result: stdout });
        }
    });
}

function sendJsonResponse(res, error, message) {
    res.json({ error, message });
}

function stopServer(req, res) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker stop ${maincraContainer}`;
    
    executeDockerCommand(command, (result) => {
        if (result.error) {
            sendJsonResponse(res, true, result.message);
        } else {
            sendJsonResponse(res, false, result.message);
        }
    });
}

function startServer(req, res) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker start ${maincraContainer}`;
    
    executeDockerCommand(command, (result) => {
        if (result.error) {
            sendJsonResponse(res, true, result.message);
        } else {
            sendJsonResponse(res, false, result.message);
        }
    });
}

function restartServer(req, res) {
    const maincraContainer = process.env.MAINCRA_CONTAINER_NAME;
    const command = `docker restart ${maincraContainer}`;
    
    executeDockerCommand(command, (result) => {
        if (result.error) {
            sendJsonResponse(res, true, result.message);
        } else {
            sendJsonResponse(res, false, result.message);
        }
    });
}

module.exports = { startServer, restartServer, stopServer };