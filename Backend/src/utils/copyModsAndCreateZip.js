const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const process = require('process');

const getClientMods = require('../database/repositories/mods/getClientMods');

async function copyModsAndCreateZip(req, res) {
  const mods = await getClientMods();
  const clientModsPath = process.env.CLIENTMODSPATH;
  const modsPath = process.env.MODSPATH;
  const tempModsPath = process.env.TEMPMODS;
  const zipPath = process.env.ZIPPATH;
  const zipName = process.env.ZIPNAMEWITHEXT;

  mods.forEach(async (mod) => {
    const modType = mod.type.includes('server') ? 'server' : 'client';
    const sourcePath = modType === 'server' ? modsPath : clientModsPath;
    const destinationPath = path.join(tempModsPath, mod.fileName);

    try {
      if (fs.existsSync(path.join(sourcePath, mod.fileName))) {
        fs.copyFileSync(path.join(sourcePath, mod.fileName), destinationPath);
        console.log(`Copied ${mod.fileName} to ${tempModsPath}`);
      } else {
        console.log(`File ${mod.fileName} does not exist in ${sourcePath}`);
      }
    } catch (error) {
      console.error(`Error copying ${mod.fileName}: ${error}`);
      return res.status(500).json({ error: true, message: `Error copying ${mod.fileName}`});
    }
  });

  // Create a zip file
  const outputFilePath = path.join(zipPath, zipName);
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Zip file created: ${outputFilePath}`);
    deleteTempFiles(tempModsPath);
    res.json({ success: true, message: 'Zip file created successfully.' });
  });

  output.on('end', () => {
    console.log('Data has been drained');
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('Archive warning:', err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    return res.status(500).json({ error: true, message: "Fail compressing mods" });
  });

  archive.pipe(output);
  archive.directory(tempModsPath, false);
  archive.finalize();
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

module.exports = copyModsAndCreateZip;
