const schema = require('../../schemas/user')

/**
 * @param {string} email
 */
function findUser(email)
{
    let result = schema.findOne({ email: email });
    return result;
}

module.exports = findUser