const findRolesById = require('../database/repositories/user/userGetPermissions')

async function verifyPermissions(req,res,next)
{
    let values = req.body
    try {
        await findRolesById(values.usrId).then(result => {
            const roles = result.roles
            if (roles && roles.find(rol => rol === "super_admin"))
            {
                return next();
            }else{
                return res.status(401).json({ error: false, message: "Sorry you don't have permissions" });
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}
module.exports = verifyPermissions