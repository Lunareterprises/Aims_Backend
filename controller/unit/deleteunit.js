var model = require("../../model/unit/deleteunit");
module.exports.DeleteUnit = async (req, res) => {
    try {
        let { u_id } = req.user
        var { unit_id } = req.body;
        if (!unit_id) {
            return res.send({
                result: false,
                message: "Unit id is required."
            })
        }
        let checkunit = await model.CheckUnit(unit_id, u_id);
        if (checkunit.length > 0) {
            let removeunit = await model.RemoveUnit(unit_id, u_id);
            if (removeunit.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Unit removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to remove unit"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Unit does not exists"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};