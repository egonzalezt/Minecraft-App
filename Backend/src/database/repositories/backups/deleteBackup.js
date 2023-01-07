const schema = require('../../schemas/backups')

/**
 * @param {string} id
 */
async function deleteBackupById(id)
{
    return await schema.findByIdAndDelete(id);
}

module.exports = deleteBackupById