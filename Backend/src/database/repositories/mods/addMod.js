const schema = require('../../schemas/mods')

/**
 * @param {string} name
 * @param {string} fileName
 * @param {string} version
 * @param {string} type
 * @param {string} url

 */
function saveMod(name,fileName,version,type,url)
{
    let values = {
        "name": name,
        "fileName": fileName,
        "version": version,
        "type":type,
        "url":url
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