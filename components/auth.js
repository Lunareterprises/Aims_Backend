let { userHasPermission } = require('../model/Auth')

module.exports.authorize = (permissionName) => {
    return async function (req, res, next) {
        const userId = req.user.u_id; // assuming JWT has decoded this
        const allowed = await userHasPermission(userId, permissionName);

        if (!allowed || allowed.length === 0) {
            return res.send({
                result: false,
                message: 'Forbidden: You do not have permission'
            });
        }
        next();
    };
}