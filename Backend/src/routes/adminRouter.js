var express = require('express');
var router = express.Router();
var { createModsFile,getMods,removeMod,startServer,stopServer,serverStatus,addMods, validateIfModExist, validateIfModsExist } = require('../controllers/adminController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/mods/create',verifyToken,verifyPermissions,createModsFile)
router.get('/mods',verifyToken,getMods)
router.delete('/mods',verifyToken,verifyPermissions,removeMod)
router.get('/server/start',verifyToken,verifyPermissions,startServer)
router.get('/server/stop',verifyToken,verifyPermissions,stopServer)
router.get('/server/status',verifyToken,verifyPermissions,serverStatus)
router.post('/mods/',verifyToken,verifyPermissions,addMods)
router.get('/mods/verify',verifyToken,verifyPermissions,validateIfModExist)
router.post('/mods/verify',verifyToken,verifyPermissions,validateIfModsExist)

module.exports = router;
