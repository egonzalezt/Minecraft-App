const findUser = require('../database/repositories/user/userFindId');
const jwt = require('jsonwebtoken');

async function verifySocketsToken(token) {

    if (!token) {
        return {isValid:false, hasToken: false, error: false, message:"Authentication failed. No token provided."}
    }

    try {
        const tokenValue = token.split(' ')[1];
        const decoded = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await findUser(decoded._id);

        if (user) {
            return {isValid:true, hasToken: true, error: false, message:"User found", nickName: user.nickName, id: decoded._id}
        } else {
            return {isValid:false, hasToken: true, error: false, message:"User not found with token provided"}
        }
    } catch (error) {
        return {isValid:false, hasToken: true, error: true, message:"Authentication failed."}
    }
}

module.exports = verifySocketsToken;