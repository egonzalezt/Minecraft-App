const schema = require('../../schemas/user')

/**
 * @param {string} id
 */
async function findRolesById(id)
{
    return await schema.findOne({ _id: id }).select({roles:1});
}

module.exports = findRolesById