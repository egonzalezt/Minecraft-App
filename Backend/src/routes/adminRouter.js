var express = require('express');
var router = express.Router();
var { createModsFile, getMods, removeMod, startServer, stopServer, serverStatus,
    addMods, validateIfModExist, validateIfModsExist, editProperties, updateProperties,
    getServerModsConfig, getModConfigFile,updateModProperties }
    = require('../controllers/adminController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/mods/create', verifyToken, verifyPermissions(), createModsFile)
router.get('/mods', verifyToken, getMods)
router.delete('/mods', verifyToken, verifyPermissions(), removeMod)
router.get('/server/start', verifyToken, verifyPermissions(), startServer)
router.get('/server/stop', verifyToken, verifyPermissions(), stopServer)
router.get('/server/status', verifyToken, verifyPermissions(), serverStatus)
router.post('/mods/', verifyToken, verifyPermissions(), addMods)
router.get('/mods/verify', verifyToken, verifyPermissions(), validateIfModExist)
router.post('/mods/verify', verifyToken, verifyPermissions(), validateIfModsExist)
router.get('/server/edit/serverprops', verifyToken, verifyPermissions(), editProperties)
router.post('/server/edit/serverprops', verifyToken, verifyPermissions(), updateProperties)
router.get('/server/edit/modsprops', verifyToken, verifyPermissions(), getServerModsConfig)
router.get('/server/edit/modprops', verifyToken, verifyPermissions(), getModConfigFile)
router.post('/server/edit/modprops', verifyToken, verifyPermissions(), updateModProperties)

module.exports = router;
