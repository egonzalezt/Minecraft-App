const schema = require('../../schemas/resources')

/**
 * @param {string} id
 */
async function deleteModById(id)
{
    return await schema.findByIdAndDelete(id);
}

module.exports = deleteModById