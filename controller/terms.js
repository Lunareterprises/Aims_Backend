let model = require('../model/terms')


module.exports.CreatePaymentTerm = async (req, res) => {
    try {
        let { u_id } = req.user
        let { term_name, total_days } = req.body
        if (!term_name || !total_days) {
            return res.send({
                result: false,
                message: "Term name and total days are required."
            })
        }
        let checkName = await model.CheckName(term_name, u_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Term name already exist."
            })
        }
        let created = await model.CreateTerm(term_name, total_days, u_id)
        if (created.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment term created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create payment term"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditPaymentTerm = async (req, res) => {
    try {
        let { u_id } = req.user
        let { term_id, term_name, total_days } = req.body
        if (!term_id || !term_name || !total_days) {
            return res.send({
                result: false,
                message: "Term id, name and total days are required."
            })
        }
        let checkTerm = await model.CheckTerm(term_id, u_id)
        if (checkTerm.length === 0) {
            return res.send({
                result: false,
                message: "Payment term not found."
            })
        }
        let checkName = await model.CheckName(term_name, u_id, term_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Term name already exist."
            })
        }
        let edited = await model.EditTerm(term_id, term_name, total_days)
        if (edited.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment term updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update payment term"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllPaymentTerms = async (req, res) => {
    try {
        let { u_id } = req.user
        let paymentTerms = await model.ListAllPaymentTerms(u_id)
        if (paymentTerms.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: paymentTerms
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


module.exports.GetPaymentTerm = async (req, res) => {
    try {
        let { u_id } = req.user
        let { term_id } = req.body
        if (!term_id) {
            return res.send({
                result: false,
                message: "Payment term id is required."
            })
        }
        let checkTerm = await model.CheckTerm(term_id, u_id)
        if (checkTerm.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: checkTerm
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


module.exports.DeletePaymentTerm = async (req, res) => {
    try {
        let { u_id } = req.user
        let { term_id } = req.body
        if (!term_id) {
            return res.send({
                result: false,
                message: "Payment term id is required"
            })
        }
        let checkTerm = await model.CheckTerm(term_id, u_id)
        if (checkTerm.length === 0) {
            return res.send({
                result: false,
                message: "Term data not found."
            })
        }
        let deleted = await model.DeletePaymentTerm(term_id, u_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment term deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete payment term."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.SetDefault = async (req, res) => {
    try {
        let { u_id } = req.user
        let { term_id } = req.body
        if (!term_id) {
            return res.send({
                result: false,
                message: "Term id is required"
            })
        }
        let checkTerm = await model.CheckTerm(term_id, u_id)
        if (checkTerm.length === 0) {
            return res.send({
                result: false,
                message: "Term data not found."
            })
        }
        let setDefault = await model.SetDefault(term_id, u_id)
        if (setDefault.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Set as default successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to set as default"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}