const schema = require('../../schemas/user')

/**
 * @param {string} userId
 */
async function userUpdatePassword(userId, password)
{
    let result = await schema.updateOne(
        { _id: userId },
        { $set: { password: password } },
        { new: true }
      );
    return result;
}

module.exports = userUpdatePassword