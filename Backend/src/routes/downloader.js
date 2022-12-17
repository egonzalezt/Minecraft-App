var express = require('express');
var router = express.Router();
var { downloadModsToUser } = require('../controllers/downloaderController')

router.get('/download',downloadModsToUser)

module.exports = router;
