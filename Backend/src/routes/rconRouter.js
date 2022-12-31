var express = require('express');
var router = express.Router();
var { runCommand } = require('../controllers/rconController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/run',verifyToken,verifyPermissions,runCommand)
module.exports = router;