let express = require('express');
let router = express.Router();
let { stopServer, startServer, restartServer }
    = require('../controllers/commandsController')
let verifyToken = require('../middlewares/verifyToken')
let verifyPermissions = require('../middlewares/verifyPermissions')
router.get('/start', verifyToken, verifyPermissions(), startServer)
router.get('/stop', verifyToken, verifyPermissions(), stopServer)
router.get('/restart', verifyToken, verifyPermissions(), restartServer)

module.exports = router;
