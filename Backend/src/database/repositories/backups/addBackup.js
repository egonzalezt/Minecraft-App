const schema = require('../../schemas/backups')

/**
 * @param {string} fileName
 * @param {string} filePath
 * @param {string} path
 */
function saveBackup(fileName,filePath,path)
{
    let values = {
        "fileName": fileName,
        "filePath": filePath,
        "path": path
    };

    var backup = new schema(values);

    let result = new Promise((resolve, reject) => {
        backup.save(function(err,result){
            if (err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    });
    return result;
}

module.exports = saveBackup