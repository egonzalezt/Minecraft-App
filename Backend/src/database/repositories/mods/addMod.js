const schema = require('../../schemas/resources')

/**
 * @param {string} name
 * @param {string} fileName
 * @param {string} version
 * @param {string} type
 * @param {string} url
 * @param {string} category
 */
function saveMod(name,fileName,version,type,url,category)
{
    let values = {
        "name": name,
        "fileName": fileName,
        "version": version,
        "type":type,
        "url":url,
        "category":category
    };

    var resource = new schema(values);

    let result = new Promise((resolve, reject) => {
        resource.save(function(err,result){
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