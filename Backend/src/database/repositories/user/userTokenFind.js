const schema = require('../../schemas/user')

/**
 * @param {string} token
 */
function findUser(token)
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

module.exports = findUser