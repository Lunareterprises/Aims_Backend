var model = require('../../model/items/deleteitem');
module.exports.DeleteItem = async (req, res) => {
    try {
        let { items } = req.body;
        let result = []
        for (const item of items) {
            let checkitem = await model.CheckItem(item);
            if (checkitem.length > 0) {
                let removeitem = await model.RemoveItem(item);
                if (removeitem.affectedRows > 0) {
                    result.push({
                        item_id: item,
                        result: true,
                        message: "Item removed successfully"
                    })
                } else {
                    result.push({
                        item_id: item,
                        result: false,
                        message: "Failed to remove item"
                    })
                }
            } else {
                result.push({
                    item_id: item,
                    result: false,
                    message: "Item does not exist"
                })
            }
        }
        return res.send({
            result
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};