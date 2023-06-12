const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const process = require('process');

const getClientMods = require('../database/repositories/mods/getClientMods');

async function copyModsAndCreateZip(io) {
  const mods = await getClientMods();
  const clientModsPath = process.env.CLIENTMODSPATH;
  const modsPath = process.env.MODSPATH;
  const tempModsPath = process.env.TEMPMODS;
  const zipPath = process.env.ZIPPATH;
  const zipName = process.env.ZIPNAMEWITHEXT;

  mods.forEach(async (mod) => {
    let modType = null;

    if (mod.type.includes('client') && mod.type.includes('server')) {
      modType = 'server';
    } else if (mod.type.includes('client')) {
      modType = 'client';
    } else {
      return;
    }

    const sourcePath = modType === 'server' ? modsPath : clientModsPath;
    const destinationPath = path.join(tempModsPath, mod.fileName);

    try {
      if (fs.existsSync(path.join(sourcePath, mod.fileName))) {
        sendMessage(io,{ type: 'statusCopyFile', error: false, value: `Copiando Archivo ${mod.fileName}`, taskComplete:false})
        fs.copyFileSync(path.join(sourcePath, mod.fileName), destinationPath);
        sendMessage(io,{ type: 'statusCopyFile', error: false, value: `Archivo copiado ${mod.fileName}`, taskComplete:false})
      } else {
        sendMessage(io,{ type: 'statusFileNotFound', error: true, value: `File ${mod.fileName} does not exist`, taskComplete:false})
      }
    } catch (error) {
      console.error(`Error copying ${mod.fileName}: ${error}`);
      sendMessage(io,{ type: 'statusFail', error: true, value: `Error copying ${mod.fileName}`, taskComplete:true})
    }
  });

  // Calculate total size of files in tempModsPath
  const totalSize = await calculateDirectorySize(tempModsPath);

  // Create a zip file
  const outputFilePath = path.join(zipPath, zipName);
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('Archive warning:', err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    sendMessage(io,{ type: 'statusFileNotFound', error: true, value: `File ${mod.fileName} does not exist in ${sourcePath}`, taskComplete:true})
  });

  let processedBytes = 0; // Track the processed bytes

  archive.on('data', (chunk) => {
    processedBytes += chunk.length;
    const progress = Math.round((processedBytes / totalSize) * 100);
    sendMessage(io,{ type: 'statusPercent', error: false, value: progress, taskComplete:false})
  });

  output.on('close', () => {
    sendMessage(io,{ type: 'statusSuccess', error: false, value: `Zip file created successfully.`, taskComplete:true})
    deleteTempFiles(tempModsPath);
  });

  output.on('end', () => {
    sendMessage(io,{ type: 'processEnd', error: false, value: `Data has been drained`, taskComplete:true})
  });

  archive.pipe(output);
  archive.directory(tempModsPath, false);
  archive.finalize();
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

function deleteTempFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });
  });
}

function sendMessage(io, message) {
  try {
      io.emit('mod-zip-file-creation-status', message);
  } catch (error) {
      console.log('Error al enviar el mensaje al cliente:', error);
  }
}

module.exports = copyModsAndCreateZip;
