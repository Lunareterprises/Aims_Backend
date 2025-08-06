let model = require('../model/payment_mode')


module.exports.CreatePaymentMode = async (req, res) => {
    try {
        let { u_id } = req.user
        let { mode } = req.body
        if (!mode) {
            return res.send({
                result: false,
                message: "Mode is required"
            })
        }
        let checkMode = await model.CheckMode(mode, u_id)
        if (checkMode.length > 0) {
            return res.send({
                result: false,
                message: "Mode is already exist"
            })
        }
        let createMode = await model.CreateMode(mode, u_id)
        if (createMode.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment mode created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create payment mode"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditPaymentMode = async (req, res) => {
    try {
        let { u_id } = req.user
        let { mode_id, mode } = req.body
        if (!mode_id || !mode) {
            return res.send({
                result: false,
                message: "Payment mode id and mode is required"
            })
        }
        let checkMode = await model.CheckPaymentMode(mode_id, u_id)
        if (checkMode.length === 0) {
            return res.send({
                result: false,
                message: "Payment mode not found."
            })
        }
        let editMode = await model.EditMode(mode_id, mode)
        if (editMode.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment mode updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to updated payment mode."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllPaymentMode = async (req, res) => {
    try {
        let { u_id } = req.user
        let modeData = await model.ListAllPaymentModes(u_id)
        if (modeData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: modeData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data",
                data: []
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.SetModeDefault = async (req, res) => {
    try {
        let { u_id } = req.user
        let { mode_id } = req.body
        if (!mode_id) {
            return res.send({
                result: false,
                message: "Payment mode id is required"
            })
        }
        let checkMode = await model.CheckPaymentMode(mode_id, u_id)
        if (checkMode.length === 0) {
            return res.send({
                result: false,
                message: "Payment mode data not found."
            })
        }
        let updated = await model.SetDefault(mode_id, u_id)
        if (updated.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Set as default successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to set as default."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeletePaymentMode = async (req, res) => {
    try {
        let { u_id } = req.user
        let { mode_id } = req.body
        if (!mode_id) {
            return res.send({
                result: false,
                message: "payment mode id is requied"
            })
        }
        let checkMode = await model.CheckPaymentMode(mode_id, u_id)
        if (checkMode.length === 0) {
            return res.send({
                result: false,
                message: "Payment mode data not found."
            })
        }
        let deleteMode = await model.DeleteMode(mode_id, u_id)
        if (deleteMode.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment mode deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete payment mode."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}