const schema = require('../../schemas/backups')
/**
 * @param {int} page
 * @param {int} limit
 */
async function getBackupsPaginated(page,limit)
{
    if(limit > 50){
        limit = 50
    }
    if(limit < 1){
        limit = 1
    }
    if(page < 1){
        page = 1;
    }
    var data = await schema.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await schema.count();
    
    return {
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalBackups: count
    }
}

module.exports = getBackupsPaginated