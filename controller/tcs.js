let model = require('../model/tcs')


module.exports.CreateTcsTds = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, higher_rate, rate_reason, start_date, end_date, tax_type } = req.body
        if (!tax_name || !tax_rate || !nature_of_collection || !tax_type) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let checkName = await model.CheckName(tax_name, u_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Name already exist."
            })
        }
        let createTcs = await model.CreateTcsTds(tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, higher_rate, rate_reason, start_date, end_date, tax_type, u_id)
        if (createTcs.affectedRows > 0) {
            return res.send({
                result: true,
                message: "TCS created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create TCS."
            })
        }
    } catch (error) {
        return res.send({
            ersult: false,
            message: error.message
        })
    }
}


module.exports.EditTcsTds = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_id, tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, higher_rate, rate_reason, start_date, end_date } = req.body
        if (!tax_id || !tax_name || !tax_rate || !nature_of_collection) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let checkTax = await model.CheckTax(tax_id, u_id)
        if (checkTax.length === 0) {
            return res.send({
                result: false,
                message: "Tax data not found."
            })
        }
        let checkName = await model.CheckName(tax_name, u_id, tax_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Name already exist."
            })
        }
        let updateTcs = await model.EditTcsTds(tax_id, tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, higher_rate, rate_reason, start_date, end_date)
        if (updateTcs.affectedRows > 0) {
            return res.send({
                result: true,
                message: "TCS updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update TCS."
            })
        }
    } catch (error) {
        return res.send({
            ersult: false,
            message: error.message
        })
    }
}


module.exports.ListAllTcsTds = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_type } = req.body
        if (!tax_type) {
            return res.send({
                result: false,
                message: "Tax type is required"
            })
        }
        let tcsList = await model.ListAllTcsTds(u_id,tax_type)
        if (tcsList.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: tcsList
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSingleTcsTds = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_id } = req.body
        if (!tax_id) {
            return res.send({
                result: false,
                message: "Tax id is required"
            })
        }
        let taxData = await model.CheckTax(tax_id, u_id)
        if (taxData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: taxData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteTcsTds = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_id } = req.body
        if (!tax_id) {
            return res.send({
                result: false,
                message: "Tax id is required"
            })
        }
        let taxData = await model.CheckTax(tax_id, u_id)
        if (taxData.length === 0) {
            return res.send({
                result: false,
                message: "Tax data not found"
            })
        }
        let deletedTax = await model.DeleteTcsTds(tax_id, u_id)
        if (deletedTax.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Tax deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete tax"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}