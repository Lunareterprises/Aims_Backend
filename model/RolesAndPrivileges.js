var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.AssignPermissionToRole = async (roleId, permissions) => {
    return await query('INSERT INTO role_permissions (role_id, permissions) VALUES (?, ?)', [roleId, permissions]);
}

module.exports.CheckName = async (role_name, user_id, role_id) => {
    let Query = `select * from roles where role_name=? and role_user_id=?`
    let values = [role_name, user_id]
    if (role_id) {
        Query += ` AND role_id <> ?`;
        values.push(role_id);
    }
    return await query(Query, values)
}

module.exports.CreateRole = async (role_name, role_description, user_id) => {
    let Query = `insert into roles (role_name,role_description,role_user_id) values (?,?,?)`
    return await query(Query, [role_name, role_description, user_id])
}

module.exports.DeleteRole = async (role_id, user_id) => {
    let Query = `delete from roles where role_id=? and role_user_id=?`
    return await query(Query, [role_id, user_id])
}

module.exports.GetRoleData = async (role_id, user_id) => {
    const Query = `
        SELECT 
            r.role_id,
            r.role_name,
            r.role_description,
            rp.permissions
        FROM roles r
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        WHERE r.role_id = ? AND r.role_user_id = ?
    `;
    const data = await query(Query, [role_id, user_id]);

    return data.map(item => ({
        ...item,
        permissions: item.permissions ? JSON.parse(item.permissions) : []
    }));
};



module.exports.EditRole = async (role_id, role_name, role_description) => {
    let Query = `update roles set role_name=? ,role_description=? where role_id=?`
    return await query(Query, [role_name, role_description, role_id])
}

module.exports.UpdatePermission = async (roleId, permissions) => {
    let Query = `update role_permissions set permissions=? where role_id=?`
    return await query(Query, [permissions, roleId])
}

module.exports.ListAllRoles = async (user_id) => {
    let Query = `SELECT role_id, role_name, role_description FROM roles WHERE role_user_id = ?`
    return await query(Query, [user_id])
}