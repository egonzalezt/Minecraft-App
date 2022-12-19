const schema = require('../../schemas/userToken')

/**
 * @param {string} token
 */
function removeToken(token)
{
    let result = new Promise((resolve, reject) => {
        schema.deleteOne({ token: token },function(err,result){
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

module.exports = removeToken