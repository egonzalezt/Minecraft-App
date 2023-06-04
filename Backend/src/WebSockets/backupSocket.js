const fs = require('fs');
var archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const saveBackup = require('../database/repositories/backups/addBackup')

async function createBackup(io) {
    const backupId = uuidv4();
    const backupPath = `${process.env.BACKUPPATH}${backupId}`;
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    const date = generateDate();
    const fileName = `backup_${date[0]}.zip`;
    const filePath = `${backupPath}/${fileName}`;
    const output = fs.createWriteStream(filePath);
    const archive = archiver('zip');
    const fileCount = await calculateFileCount(process.env.WORLDPATH);
    let processedFileCount = 0;

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    console.log(`File created at ${filePath}`);

    archive.on('error', function (err) {
        throw err;
    });

    archive.on('entry', function () {
        processedFileCount++;
        const percentComplete = Math.round((processedFileCount / fileCount) * 100);
        sendMessage(io, { type: 'statusPercent', value: percentComplete, process: "backupCreator", taskComplete:false, error: false });
    });

    archive.pipe(output);

    archive.directory(process.env.WORLDPATH, false);

    archive.finalize().then(() => {
        saveBackup(fileName, filePath, backupPath).then(() => {
            sendMessage(io, { type: 'statusSuccess', value: "Backup created successfully", process: "backupCreator", taskComplete:true, error: false });
        }).catch(() => {
            sendMessage(io, { type: 'statusFail', value: "Failed to create backup", process: "backupCreator", taskComplete:true, error: true });
        });
    }).catch(() => {
        sendMessage(io, { type: 'statusFail', value: "Failed to create backup", process: "backupCreator", taskComplete:true, error: true });
    });

    async function calculateFileCount(directoryPath) {
        let fileCount = 0;

        function calculateDirectoryFilesCount(dirPath) {
            const files = fs.readdirSync(dirPath);

            files.forEach((file) => {
                const filePath = `${dirPath}/${file}`;
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    calculateDirectoryFilesCount(filePath);
                } else {
                    fileCount++;
                }
            });
        }

        calculateDirectoryFilesCount(directoryPath);

        return fileCount;
    }
}

function generateDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    return [`${mm}_${dd}_${yyyy}`, today]
}

function sendMessage(io, message) {
    try {
        io.emit('backup-creation-status', message);
    } catch (error) {
        console.log('Error al enviar el mensaje al cliente:', error);
    }
}

module.exports = {
    createBackup
};