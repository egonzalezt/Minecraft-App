var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var userTokenController = require('../controllers/userTokenController')
var {verifyContentLogIn} = require('../middlewares/userLogInValidation')
var {verifyContentSignUp} = require('../middlewares/userSignUpValidation')
var {verifyRefreshToken} = require('../middlewares/refreshTokenValidator')
var verifyToken = require('../middlewares/verifyToken')
var verifyTokenAndGetUser = require('../middlewares/verifyTokenAndGetUser')
//Post Methods
router.post('/signup',verifyContentSignUp,userController.registerUser)
router.post('/login',verifyContentLogIn,userController.loginUser)
router.post('/refresh',verifyRefreshToken,userTokenController.renewAccessToken)
router.delete('/logout',verifyRefreshToken,userTokenController.deleteTokens)
router.get('/',verifyToken,userController.getUserInfo)
router.get('/verify',verifyTokenAndGetUser)
module.exports = router;