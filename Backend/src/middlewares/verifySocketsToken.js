const findUser = require('../database/repositories/user/userFindId');
const jwt = require('jsonwebtoken');

async function verifySocketsToken(socket, next) {
    const token = socket.request.headers.authorization;

    if (!token) {
        return socket.emit('authorization-error', 'Unauthorized access');
    }

    try {
        const tokenValue = token.split(' ')[1];
        const decoded = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await findUser(decoded._id);

        if (user) {
            socket.usrId = decoded._id;
            return next();
        } else {
            socket.emit('authorization-error', 'Unauthorized access');
        }
    } catch (error) {
        socket.emit('authorization-error', 'Unauthorized access');
    }
}

module.exports = verifySocketsToken;