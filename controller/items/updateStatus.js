let model = require('../../model/items/updateStatus')


module.exports.UpdateItemStatus = async (req, res) => {
    try {
        let { u_id } = req.user
        let { item_id } = req.body
        if (!item_id) {
            return res.send({
                result: false,
                message: "Item id is requried"
            })
        }
        let checkItem = await model.CheckItem(item_id, u_id)
        if (checkItem.length === 0) {
            return res.send({
                result: false,
                message: "Item data not found."
            })
        }
        let status = checkItem[0]?.i_status === "active" ? "inactive" : "active"
        let updateStatus = await model.UpdateStatus(item_id, status)
        if (updateStatus.affectedRows > 0) {
            return res.send({
                result: true,
                message: `The item has been marked as ${status}`
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update item status"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}