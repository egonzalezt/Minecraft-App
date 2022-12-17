const schema = require('../../schemas/user')

/**
 * @param {string} email
 */
function findUser(email)
{
    let result = new Promise((resolve, reject) => {
        schema.findOne({ email: email },function(err,result){
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