const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
require('express-async-errors');
require('dotenv').config()
require('./config/database')

//routes

const modsRouter = require('./routes/downloader')
const adminRouter = require('./routes/adminRouter')
const userRouter = require('./routes/userRouter')
const app = express();
app.use(express.json());

app.use(fileUpload({
    createParentPath: true
}));

var corsOptions = {
    origin: ['*'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin:true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(bodyParser.json())


app.use('/mods', modsRouter)

app.use('/admin', adminRouter)

app.use('/user', userRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


//Handler for 404 resoruce not found
app.use((req, res, next) => {
    res.status(404).send(`Doc maybe we're lost`)
})

// Handler for error 500
app.use((err, req, res, next) => {
    //console.error(err.stack)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ status: 404, message: err.message, error: true }); // Bad request
    } else {
        res.status(500).send('Internal server error')
    }
})

module.exports = app