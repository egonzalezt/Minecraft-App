const schema = require('../../schemas/userResetToken')

/**
 * @param {string} userId
 */
async function findResetToken(userId)
{
    return await schema.findOne({ userId: userId });
}

module.exports = findResetToken