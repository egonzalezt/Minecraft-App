const schema = require('../../schemas/mods')

/**
 * @param {string} id
 */
async function deleteModById(id)
{
    return await schema.findByIdAndDelete(id);
}

module.exports = deleteModById