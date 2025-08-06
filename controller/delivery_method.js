let model = require('../model/delivery_method')


module.exports.CreateDeliveryMethod = async (req, res) => {
    try {
        let {u_id}=req.user
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListAllDeliveryMethod = async (req, res) => {
    try {
        let { u_id } = req.user
        let deliveryMethods = await model.ListAllDeliveryMethods(u_id)
        if (deliveryMethods.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: deliveryMethods
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


module.exports.DeleteDeliveryMethod = async (req, res) => {
    try {
        let { u_id } = req.user
        let { delivery_method_id } = req.body
        if (!delivery_method_id) {
            return res.send({
                result: false,
                message: "Delivery method id is required"
            })
        }
        let checkData = await model.CheckData(delivery_method_id, u_id)
        if (checkData.length === 0) {
            return res.send({
                result: false,
                message: "Delivery method data not found."
            })
        }
        let deleted = await model.DeleteDeliveryMethod(delivery_method_id, u_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delivery method deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete delivery method."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}