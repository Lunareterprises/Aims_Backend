var model = require("../../model/register/deletereg")
module.exports.DeleteReg = async (req, res) => {
    try {
        var { u_id } = req.body;
        let checkuser = await model.CheckUser(u_id);
        if (checkuser.length > 0) {
            let removeuser = await model.RemoveUser(u_id)
            // console.log(removeuser.affectedRows);

            if (removeuser.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "user removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to delete user"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "User does not exist"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};