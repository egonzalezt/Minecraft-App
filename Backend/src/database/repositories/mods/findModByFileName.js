const schema = require('../../schemas/mods')

/**
 * @param {string} fileName
 */
async function findModByFileName(fileName)
{
    return await schema.exists({fileName:fileName})
}

module.exports = findModByFileName