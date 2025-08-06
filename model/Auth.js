var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.userHasPermission = async (userId, permissionName) => {
  return await query(`
      SELECT 1
    FROM users u
    JOIN roles r ON u.u_role_id = r.role_id
    JOIN role_permissions rp ON rp.role_id = r.role_id
    WHERE u.u_id = ?
      AND JSON_CONTAINS(rp.permissions, JSON_QUOTE(?))
    `, [userId, permissionName]);
}

