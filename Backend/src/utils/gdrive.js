const { google } = require('googleapis');
const fs = require('fs');

async function uploadBackUp(io,fileName, filePath) {
  console.log('Starting the process to upload the file into google drive',fileName);
  try {
    const credentials = require(process.env.AUTHFILE);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
      name: fileName,
      parents: [process.env.FOLDERID || ''],
    };
    const media = {
      mimeType: 'application/zip',
      body: fs.createReadStream(filePath),
    };

    const fileSize = getFileSize(filePath);

    const { data: file } = await drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: 'id',
      },
      {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.bytesRead / fileSize) * 100);
          sendMessage(io, { type: 'statusPercentGdrive', value: progress, process: "backupCreator", taskComplete: false, error: false });
        },
      }
    );
    console.log('File uploaded successfully. File ID:', file.id);
    return file.id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

function sendMessage(io, message) {
  try {
      io.emit('backup-creation-status', message);
  } catch (error) {
      console.log('Error al enviar el mensaje al cliente:', error);
  }
}

module.exports = uploadBackUp;
