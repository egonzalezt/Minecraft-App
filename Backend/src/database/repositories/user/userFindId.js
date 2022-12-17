const schema = require('../../schemas/user')

/**
 * @param {string} id
 */
async function findUserById(id)
{
    let result = await schema.findOne({ _id: id }).select({password:0});
    return result;
}

module.exports = findUserById