const fs = require('fs');
const path = require('path');
const findModFileNameById = require('../database/repositories/mods/findModFileNameById');

function downloadModsToUser(req, res) {
    const status = global.isModsFileAvailable;
    if (status) {
        const filePath = path.join(process.env.ZIPPATH, process.env.ZIPNAMEWITHEXT);

        if (fs.existsSync(filePath)) {
            console.log(`Getting file from: ${filePath}`);

            // Get the file stats to determine the file size
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;

            // Set headers for the response
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=' + process.env.ZIPNAMEWITHEXT);
            res.setHeader('Content-Length', fileSize);

            // Create a readable stream from the file
            const fileStream = fs.createReadStream(filePath);

            // Pipe the file stream to the response stream in chunks
            fileStream.pipe(res);

            // Handle any errors during the streaming
            fileStream.on('error', (err) => {
                console.error('Error while streaming file:', err);
                res.status(500).json({ error: true, message: 'Internal server error' });
            });

            // Log the progress of the download
            let downloadedBytes = 0;
            res.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = (downloadedBytes / fileSize) * 100;
                console.log(`Download progress: ${progress.toFixed(2)}%`);
            });

            res.on('end', () => {
                console.log('Download completed');
            });
        } else {
            return res.status(410).json({ error: true, message: 'Mods file is currently unavailable, try again later' });
        }
    } else {
        return res.status(410).json({ error: true, message: 'Mods file is currently unavailable, try again later' });
    }
}

async function downloadModToUser(req, res) {
    const modId = req.params.id;
    const mod = await findModFileNameById(modId);

    if (mod) {
        const modType = mod.type;
        let filePath = '';

        if (modType.includes('server')) {
            filePath = path.join(process.env.MODSPATH, mod.fileName);
        } else {
            filePath = path.join(process.env.CLIENTMODSPATH, mod.fileName);
        }

        if (fs.existsSync(filePath)) {
            console.log(`Getting file from: ${filePath}`);

            // Get the file stats to determine the file size
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;

            // Set headers for the response
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=' + mod.fileName);
            res.setHeader('Content-Length', fileSize);

            // Create a readable stream from the file
            const fileStream = fs.createReadStream(filePath);

            // Pipe the file stream to the response stream in chunks
            fileStream.pipe(res);

            // Handle any errors during the streaming
            fileStream.on('error', (err) => {
                console.error('Error while streaming file:', err);
                res.status(500).json({ error: true, message: 'Internal server error' });
            });

            // Log the progress of the download
            let downloadedBytes = 0;
            res.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = (downloadedBytes / fileSize) * 100;
                console.log(`Download progress: ${progress.toFixed(2)}%`);
            });

            res.on('end', () => {
                console.log('Download completed');
            });
        } else {
            return res.status(410).json({ error: true, message: 'Mod file is currently unavailable, try again later' });
        }
    }
}

module.exports = {
    downloadModsToUser,
    downloadModToUser,
};
