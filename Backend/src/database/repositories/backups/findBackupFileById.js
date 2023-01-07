const schema = require('../../schemas/backups')

/**
 * @param {string} id
 */
async function findBackupFileById(id)
{
    return await schema.findById(id);
}

module.exports = findBackupFileById