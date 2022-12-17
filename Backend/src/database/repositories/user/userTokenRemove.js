const schema = require('../database/schemas/userToken')

/**
 * @param {string} token
 */
function findUser(token)
{
    let result = new Promise((resolve, reject) => {
        schema.remove({ token: token },function(err,result){
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

module.exports = findUser