var express = require('express');
var router = express.Router();
var { getServerInformation }
    = require('../controllers/serverController')
var verifyToken = require('../middlewares/verifyToken')
var verifyPermissions = require('../middlewares/verifyPermissions')

router.get('/', verifyToken, verifyPermissions(), getServerInformation)

module.exports = router;
