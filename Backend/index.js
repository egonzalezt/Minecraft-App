const app = require('./src/app');
const PORT = process.env.PORT || 8000;
const http = require('http').createServer(app);
const configureSockets = require('./src/WebSockets/socketController')
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

configureSockets(io);


http.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Server shutting down...');
    http.close(() => {
        console.log('Server shut down successfully.');
        process.exit(0);
    });
});

/*
const { google } = require('googleapis');
const fs = require('fs');

// Load the credentials from the JSON file
const credentials = require('./vasitos-company-95e8eed5822b.json');

// Create a new instance of the drive service
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

// Define the file metadata and content
const fileMetadata = {
    name: 'backup.zip', // Name of the file in Google Drive
    parents: ['1CkD7FkNjhtge36UbJqh-6p9ydM3IKQiX'], // ID of the folder in which you want to upload the file (optional)
};

const media = {
    mimeType: 'application/zip',
    body: fs.createReadStream('J:/Documents/GitHub/Minecraft-App/upload_data/Other/backup.zip'),
};

// Upload the file to Google Drive
drive.files.create(
    {
        resource: fileMetadata,
        media: media,
        fields: 'id',
    },
    (err, file) => {
        if (err) {
            console.error('Error uploading file:', err);
        } else {
            console.log('File uploaded successfully. File ID:', file.data.id);
            fileId = file.data.id
        }
    }
);
*/



/*// Download the file from Google Drive
const dest = fs.createWriteStream("J:/Documents/GitHub/Minecraft-App/upload_data/test.zip");
drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' },
    (err, res) => {
        if (err) {
            console.error('Error downloading file:', err);
            return;
        }

        res.data
            .on('end', () => {
                console.log('File downloaded successfully.');
            })
            .on('error', (err) => {
                console.error('Error downloading file:', err);
            })
            .pipe(dest);
    }
);
*/

/*
const { google } = require('googleapis');
const fs = require('fs');

// Load the credentials from the JSON file
const credentials = JSON.parse(fs.readFileSync('./vasitos-company-95e8eed5822b.json'));

// Create a new auth client using the credentials
const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive.readonly'],
    null
);

// Create a new Drive API client
const drive = google.drive({ version: 'v3', auth });

// Set the file ID and email address
const fileId = '1dgfnsST-YNrKc5YN1IPrMMgBhjIL81pA';
const email = 'esteban210301@gmail.com';

// Generate a download link for the file
drive.permissions.create({
    fileId: fileId,
    requestBody: {
        role: 'reader',
        type: 'user',
        emailAddress: email
    },
    sendNotificationEmail: false
}, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Download link: https://drive.google.com/uc?id=${fileId}&export=download`);
});

*/