const schema = require('../../schemas/user')

/**
 * @param {string} email
 * @param {string} password
 * @param {string} nickName
 */
function saveUser(email,password,nickName)
{
    let values = {
        "email": email,
        "nickName": nickName,
        "password": password,
    };

    var user = new schema(values);

    let result = new Promise((resolve, reject) => {
        user.save(function(err,result){
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

module.exports = saveUser