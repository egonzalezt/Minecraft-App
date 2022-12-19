const findRolesById = require('../database/repositories/user/userGetPermissions')

async function verifyPermissions(req, res, next) {
    let values = req.body

    await findRolesById(values.usrId).then(result => {
        const roles = result.roles
        if (roles && roles.find(rol => rol === "super_admin")) {
            return next();
        } else {
            return res.status(401).json({ error: false, message: "Sorry you don't have permissions" });
        }
    })

}
module.exports = verifyPermissions