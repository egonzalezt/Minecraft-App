var express = require('express');
var router = express.Router();
var { createBackup,downloadBackup, getBackups, removeBackup } = require('../controllers/backupController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/generate',createBackup)
router.get('/download/:id',downloadBackup)
router.get('/backups',getBackups)
router.delete('/',removeBackup)
module.exports = router;
