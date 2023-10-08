const Rcon = require('rcon');
const fs = require('fs/promises');

async function runCommand(io) {
    const command = "seed";
    const host = process.env.RCONHOST;
    const password = process.env.RCONPASSWORD;
    const port = process.env.RCONPORT;
    const conn = new Rcon(host, port, password);
    let response = "Se ejecutó de forma exitosa";
    let isReady = false;

    try {
        await new Promise((resolve, reject) => {
            conn.on('auth', function () {
                console.log("Authenticated");
                console.log(`Sending command: ${command}`);
                conn.send(command);
            }).on('response', function (str) {
                if (str.length > 1) {
                    response = str;
                }
                conn.disconnect();
                isReady = true;
                //resolve(isReady);
            }).on('error', function (err) {
                response = err;
                conn.disconnect();
                isReady = false;
                //resolve(response);
            }).on('end', function () {
                resolve(response)
            });

            conn.connect();
        });
    } catch (err) {
        // Handle any errors here.
        console.error("An error occurred:", err);
        response = err.toString();
        isReady = false;
    } finally {
        if (isReady) {
            io.emit('docker-logs', "Server is ready");
        } else {
            io.emit('docker-logs', "Server is not ready");
        }
        return isReady;
    }
}

async function deleteFolderAsync(io) {
    try {
        const folderPath = process.env.WORLDPATH
        io.emit('docker-logs', "Deleting world");
        console.log(`Deleting World on folder ${folderPath}`);
        await fs.rm(folderPath, { recursive: true, force: true });
        console.log(`Successfully deleted ${folderPath}`);
        io.emit('docker-logs', "World successfully deleted");
    } catch (err) {
        console.error(`Error while deleting ${folderPath}. ${err}`);
        io.emit('docker-logs', "Something happens deleting the world, please contact the admins");
    }
}

module.exports = { runCommand, deleteFolderAsync };