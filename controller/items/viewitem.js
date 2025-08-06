var model = require("../../model/items/viewitem");


module.exports.ViewItem = async (req, res) => {
    try {
        let { u_id } = req.user
        var { item_id } = req.body;
        if (!item_id) {
            return res.send({
                result: false,
                message: "Item id is required."
            })
        }
        let checkadmin = await model.CheckAdmin(item_id, u_id);
        if (checkadmin.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived",
                list: checkadmin
            })
        } else {
            res.send({
                result: false,
                message: "No data found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};