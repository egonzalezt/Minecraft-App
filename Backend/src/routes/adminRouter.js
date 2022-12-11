var express = require('express');
var router = express.Router();
var { createModsFile,getMods,deleteMod,startServer,stopServer,serverStatus } = require('../Controllers/adminController')

router.get('/mods/create',createModsFile)
router.get('/mods/',getMods)
router.delete('/mods/:name',deleteMod)
router.get('/server/start',startServer)
router.get('/server/stop',stopServer)
router.get('/server/status',serverStatus)
module.exports = router;
