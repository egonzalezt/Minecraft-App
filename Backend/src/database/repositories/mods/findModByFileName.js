const schema = require('../../schemas/resources')

/**
 * @param {string} fileName
 */
async function findModByFileName(fileName)
{
    return await schema.exists({fileName:fileName})
}

module.exports = findModByFileName