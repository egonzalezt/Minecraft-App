const schema = require('../../schemas/userResetToken')

/**
 * @param {string} token
 */
async function deleteResetToken(token)
{
    return await schema.findOneAndDelete({ resetToken: token });
}

module.exports = deleteResetToken