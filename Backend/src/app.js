const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pathCreate = require('./utils/folderCreator')
require('express-async-errors');
require('dotenv').config();
require('./config/database');
global.isModsFileAvailable = true;
const { exec } = require('child_process');

if (process.env.ENABLEAPM == 1) {
    var apm = require('elastic-apm-node').start()
}

const paths = [
    process.env.CLIENTMODSPATH,
    process.env.ZIPPATH,
    process.env.BACKUPPATH,
    process.env.TEMPMODS,
]

pathCreate(paths);

//routes
const modsRouter = require('./routes/downloader');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');
const rconRouter = require('./routes/rconRouter');
const backupRouter = require('./routes/backupRouter')
const serverRouter = require('./routes/commandsRouter')

const app = express();
app.use(express.json({ limit: '1024mb' }))

app.use(fileUpload({
    createParentPath: true
}));

var corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use('/api/v1/mods', modsRouter);

app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/user', userRouter);

app.use('/api/v1/commands', rconRouter);

app.use('/api/v1/backups', backupRouter)

app.use('/api/v1/server', serverRouter)

app.get('/docker-ps', (req, res) => {
    exec('docker logs my-nginx', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing 'docker ps': ${error.message}`);
            return res.status(500).send('Error running docker ps');
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error running docker ps');
        }

        res.send(`<pre>${stdout}</pre>`);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Handler for 404 resource not found
app.use((req, res, next) => {
    res.status(404).send(`Doc, maybe we're lost`)
})

// Global error handler
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    apm.captureError(err);
});

// Handler for error 500
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ status: 404, message: err.message, error: true }); // Bad request
    } else {
        res.status(500).send('Internal server error');
        apm.captureError(err);
    }
});

module.exports = app;
