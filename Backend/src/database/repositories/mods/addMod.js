const schema = require('../../schemas/mods')

/**
 * @param {string} name
 * @param {string} fileName
 * @param {string} version
 * @param {string} type
 */
function saveMod(name,fileName,version,type)
{
    let values = {
        "name": name,
        "fileName": fileName,
        "version": version,
        "type":type
    };

    var mod = new schema(values);

    let result = new Promise((resolve, reject) => {
        mod.save(function(err,result){
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

module.exports = saveMod