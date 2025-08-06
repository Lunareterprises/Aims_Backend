let model = require('../model/tax')


module.exports.CreateTax = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_name, tax_rate } = req.body
        if (!tax_name || !tax_rate) {
            return res.send({
                result: false,
                message: "Tax name and rate is required."
            })
        }
        let checkName = await model.CheckName(tax_name, u_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Name already exist."
            })
        }
        let createdTax = await model.CreateTax(tax_name, tax_rate, u_id)
        if (createdTax.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Tax created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create tax"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditTax = async (req, res) => {
    try {
        let { u_id } = req.user
        let { tax_id, tax_name, tax_rate } = req.body
        if (!tax_name || !tax_rate) {
            return res.send({
                result: false,
                message: "Tax name and rate is required."
            })
        }
        let taxData = await model.CheckTax(tax_id, u_id)
        if (taxData.length === 0) {
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
        let EditTax = await model.EditTax(tax_id, tax_name, tax_rate)
        if (EditTax.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Tax Updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update tax"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllTax = async (req, res) => {
    try {
        let { u_id } = req.user
        let taxData = await model.ListAllTax(u_id)
        if (taxData.length) {
            return res.send({
                result: true,
                message: "Data retreived successfully.",
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


module.exports.GetSingleTaxData = async (req, res) => {
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
                message: "Data retreived successfully.",
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


module.exports.DeleteTax = async (req, res) => {
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
                result: false,
                message: "Tax data not found."
            })
        }
        let deletedTax = await model.DeleteTax(tax_id, u_id)
        if (deletedTax.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Tax deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete tax."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}