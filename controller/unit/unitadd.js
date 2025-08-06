var model = require("../../model/unit/unitadd");
module.exports.AddUnit = async (req, res) => {
    try {
        let { u_id } = req.user
        var { unit_name } = req.body;
        if (!unit_name) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let unitExist = await model.CheckUnit(unit_name,u_id)
        if (unitExist.length > 0) {
            return res.send({
                result: false,
                message: "Unit already exist with same name"
            })
        }
        let addunit = await model.UnitAdd(unit_name,u_id);
        if (addunit.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Unit added successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to add unit"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};