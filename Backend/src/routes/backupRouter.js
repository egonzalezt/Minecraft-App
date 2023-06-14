var express = require('express');
var router = express.Router();
var { createBackup,downloadBackup, getBackups, removeBackup } = require('../controllers/backupController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/generate',verifyToken,verifyPermissions(),createBackup)
router.get('/download/:id',verifyToken,verifyPermissions(),downloadBackup)
router.get('/backups',verifyToken,verifyPermissions(),getBackups)
router.delete('/',verifyToken,verifyPermissions(),removeBackup)
module.exports = router;
