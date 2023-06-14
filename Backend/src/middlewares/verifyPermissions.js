const findRolesById = require('../database/repositories/user/userGetPermissions');

function verifyPermissions(acceptedRoles = ["super_admin"]) {
  return function(req, res, next) {
    const values = req.body;

    findRolesById(values.usrId)
      .then(result => {
        const roles = result.roles;

        if (roles && roles.find(rol => acceptedRoles.includes(rol))) {
          return next();
        } else {
          return res.status(403).json({ error: false, message: "Sorry, you don't have permissions" });
        }
      })
      .catch(error => {
        return res.status(500).json({ error: true, message: "Internal server error" });
      });
  };
}

module.exports = verifyPermissions;
