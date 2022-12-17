var express = require('express');
var router = express.Router();
var { createModsFile,getMods,deleteMod,startServer,stopServer,serverStatus } = require('../controllers/adminController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/mods/create',verifyToken,verifyPermissions,createModsFile)
router.get('/mods/',verifyToken,verifyPermissions,getMods)
router.delete('/mods/:name',verifyToken,verifyPermissions,deleteMod)
router.get('/server/start',verifyToken,verifyPermissions,startServer)
router.get('/server/stop',verifyToken,verifyPermissions,stopServer)
router.get('/server/status',verifyToken,verifyPermissions,serverStatus)
module.exports = router;
