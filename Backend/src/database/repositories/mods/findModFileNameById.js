const schema = require('../../schemas/mods')

/**
 * @param {string} id
 */
async function findModFileNameById(id)
{
    return await schema.findById(id).select({fileName:1, type:1})
}

module.exports = findModFileNameById