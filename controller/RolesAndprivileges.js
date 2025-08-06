let model = require('../model/RolesAndPrivileges')

module.exports.CreateRole = async (req, res) => {
    try {
        let { u_id } = req.user;
        let { role_name, role_description, role_permissions } = req.body;
        if (!role_name ||
            !Array.isArray(role_permissions) ||
            role_permissions.length === 0 ||
            !role_permissions.every(item => typeof item === 'string')
        ) {
            return res.send({
                result: false,
                message: "Role name is required and permissions must be a non-empty array of strings"
            });
        }
        let roleExist = await model.CheckName(role_name, u_id);
        if (roleExist.length > 0) {
            return res.send({
                result: false,
                message: "Role name already exists."
            });
        }
        let createRole = await model.CreateRole(role_name, role_description, u_id);
        if (createRole.affectedRows > 0) {
            let permissionString = JSON.stringify(role_permissions)
            let createPermission = await model.AssignPermissionToRole(createRole.insertId, permissionString)
            if (createPermission.affectedRows == 0) {
                await model.DeleteRole(createRole.insertId, u_id)
                return res.send({
                    result: false,
                    message: "Failed to create role."
                });
            }
            return res.send({
                result: true,
                message: "Role created successfully."
            });
        } else {
            return res.send({
                result: false,
                message: "Failed to create role."
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
}


module.exports.EditRole = async (req, res) => {
    try {
        let { u_id } = req.user
        let { role_id, role_name, role_description, role_permissions } = req.body;
        if (!role_id ||
            !role_name ||
            !Array.isArray(role_permissions) ||
            role_permissions.length === 0 ||
            !role_permissions.every(item => typeof item === 'string')
        ) {
            return res.send({
                result: false,
                message: "Role id, name is required and permissions must be a non-empty array of strings"
            });
        }
        let roleData = await model.GetRoleData(role_id, u_id)
        if (roleData.length === 0) {
            return res.send({
                result: false,
                message: "Role data not found."
            })
        }
        let roleExist = await model.CheckName(role_name, u_id, role_id);
        if (roleExist.length > 0) {
            return res.send({
                result: false,
                message: "Role name already exists."
            });
        }
        let editedRole = await model.EditRole(role_id, role_name, role_description);
        if (editedRole.affectedRows > 0) {
            let permissionString = JSON.stringify(role_permissions)
            let editPermission = await model.UpdatePermission(role_id, permissionString)
            if (editPermission.affectedRows == 0) {
                await model.DeleteRole(role_id, u_id)
                return res.send({
                    result: false,
                    message: "Failed to update role."
                });
            }
            return res.send({
                result: true,
                message: "Role updated successfully."
            });
        } else {
            return res.send({
                result: false,
                message: "Failed to update role."
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllRoles = async (req, res) => {
    try {
        let { u_id } = req.user
        let roleList = await model.ListAllRoles(u_id)
        if (roleList.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: roleList
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSingleRoleData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { role_id } = req.body
        if (!role_id) {
            return res.send({
                result: false,
                message: "Role id is required"
            })
        }
        let roleData = await model.GetRoleData(role_id, u_id)
        if (roleData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: roleData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteRole = async (req, res) => {
    try {
        let { u_id } = req.user
        let { role_id } = req.body
        if (!role_id) {
            return res.send({
                result: false,
                message: "Role id is required"
            })
        }
        let roleData = await model.GetRoleData(role_id, u_id)
        if (roleData.length === 0) {
            return res.send({
                result: false,
                message: "Role data not found."
            })
        }
        let deletedData = await model.DeleteRole(role_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Role deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete role."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}