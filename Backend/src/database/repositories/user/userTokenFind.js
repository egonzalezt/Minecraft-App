const schema = require('../../schemas/userToken')

/**
 * @param {string} token
 */
function findToken(token)
{
    let result = new Promise((resolve, reject) => {
        schema.findOne({ token: token },function(err,result){
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

module.exports = findToken