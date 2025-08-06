let model = require('../model/reason')

module.exports.CreateReason = async (req, res) => {
    try {
        let { u_id } = req.user
        let { reason } = req.body
        if (!reason) {
            return res.send({
                result: false,
                message: "Reason is required."
            })
        }
        let checkName = await model.CheckName(reason, u_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Reason already exist."
            })
        }
        let created = await model.CreateReason(reason, u_id)
        if (created.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Reason created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create reason."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.EditReason = async (req, res) => {
    try {
        let { u_id } = req.user
        let { reason_id, reason } = req.body
        if (!reason || !reason_id) {
            return res.send({
                result: false,
                message: "Reason and Reason ID are required."
            })
        }
        let reasonData = await model.GetReasonData(reason_id, u_id)
        if (reasonData.length === 0) {
            return res.send({
                result: false,
                message: "Reason data not found."
            })
        }
        let updated = await model.EditReason(reason, reason_id)
        if (updated.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Reason updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update reason."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.UpdateStatus = async (req, res) => {
    try {
        let { u_id } = req.user
        let { reason_id } = req.body
        if (!reason_id) {
            return res.send({
                result: false,
                message: "Reason id is required."
            })
        }
        let reasonData = await model.GetReasonData(reason_id, u_id);
        if (reasonData.length === 0) {
            return res.send({
                result: false,
                message: "Reason data not found."
            })
        }
        let status = reasonData[0].r_status === 'active' ? 'inactive' : 'active'
        let updateStatus = await model.UpdateStatus(reason_id, status)
        if (updateStatus.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Status updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update status."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListAllReasons = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        let reasons = await model.GetAllReasons(u_id, type);
        if (reasons.length > 0) {
            return res.send({
                result: true,
                message: "Data found",
                data: reasons
            })
        } else {
            return res.send({
                result: false,
                message: "No reasons found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetReasonData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { reason_id } = req.body
        if (!reason_id) {
            return res.send({
                result: false,
                message: "Reason id is required."
            })
        }
        let reasonData = await model.GetReasonData(reason_id, u_id)
        if (reasonData.length > 0) {
            return res.send({
                result: true,
                message: "Data found.",
                data: reasonData
            })
        } else {
            return res.send({
                result: false,
                message: "Data not found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteReason = async (req, res) => {
    try {
        let { u_id } = req.user
        let { reason_id } = req.body
        if (!reason_id) {
            return res.send({
                result: false,
                message: "Reason id is required."
            })
        }
        let reasonData = await model.GetReasonData(reason_id, u_id)
        if (reasonData.length > 0) {
            return res.send({
                result: true,
                message: "Data found.",
                data: reasonData
            })
        }
        let deletedData = await model.DeleteReason(reason_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Reason deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete reason."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}