var express = require('express');
var router = express.Router();
var { downloadModsToUser, downloadModToUser } = require('../controllers/downloaderController')

router.get('/download',downloadModsToUser)
router.get('/download/mod/:id',downloadModToUser)

module.exports = router;
