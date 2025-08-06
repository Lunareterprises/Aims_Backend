var model = require("../../model/unit/listunit");

module.exports.ListUnit = async (req, res) => {
    try {
        let { u_id } = req.user
        let listunit = await model.UnitList(u_id);
        if (listunit.length > 0) {
            return res.send({
                result: true,
                message: "Data kitti",
                list: listunit
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrived data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};