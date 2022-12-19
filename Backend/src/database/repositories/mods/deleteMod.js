const schema = require('../../schemas/mods')

/**
 * @param {string} id
 */
async function saveUser(id)
{
    return await schema.deleteOne({_id:id})
}

module.exports = saveUser