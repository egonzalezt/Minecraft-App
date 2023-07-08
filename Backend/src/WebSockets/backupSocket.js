const fs = require('fs');
var archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const saveBackup = require('../database/repositories/backups/addBackup')
const path = require('path');
const uploadBackUp = require('../utils/gdrive');

async function createBackup(io) {
    const backupId = uuidv4();
    const backupPath = `${process.env.BACKUPPATH}${backupId}`;
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    const date = generateDate();
    const fileName = `backup_${date[0]}-${backupId}.zip`;
    const filePath = `${backupPath}/${fileName}`;
    const output = fs.createWriteStream(filePath);
    const archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    console.log(`File created at ${filePath}`);

    archive.on('error', function (err) {
        throw err;
    });

    const totalSize = await calculateDirectorySize(process.env.WORLDPATH);

    let processedBytes = 0;

    archive.on('data', (chunk) => {
        processedBytes += chunk.length;
        const progress = Math.round((processedBytes / totalSize) * 100);
        sendMessage(io, { type: 'statusPercentZip', value: progress, process: "backupCreator", taskComplete: false, error: false });
    });


    archive.pipe(output);

    archive.directory(process.env.WORLDPATH, false);

    try {
        await archive.finalize();
        sendMessage(io, { type: 'statusGdrive', value: "Uploading into Google Drive", process: "backupCreator", taskComplete: false, error: false });
        const id = await uploadBackUp(io, fileName, filePath);
        sendMessage(io, { type: 'statusGdrive', value: "Successfully uploaded into Google Drive", process: "backupCreator", taskComplete: false, error: false });

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
        await saveBackup(fileName, null, null, id);
        sendMessage(io, { type: 'statusSuccess', value: "Backup created and saved successfully", process: "backupCreator", taskComplete: true, error: false });
    } catch (error) {
        sendMessage(io, { type: 'statusFail', value: "Failed to create backup", process: "backupCreator", taskComplete: true, error: true });
    }
}

function calculateDirectorySize(directory) {
    return new Promise((resolve, reject) => {
        let totalSize = 0;

        const calculateFileSize = (filePath) => {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                const nestedFiles = fs.readdirSync(filePath);
                nestedFiles.forEach((file) => calculateFileSize(path.join(filePath, file)));
            } else if (stats.isFile()) {
                totalSize += stats.size;
            }
        };

        calculateFileSize(directory);

        resolve(totalSize);
    });
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