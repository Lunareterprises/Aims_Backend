let model = require('../../model/sales/salesPerson')


module.exports.createSalesPerson = async (req, res) => {
    try {
        let { u_id } = req.user
        let { name, email } = req.body
        if (!name || !email) {
            return res.send({
                result: false,
                message: "All fields are required"
            })
        }
        let createdData = await model.createSalesPerson(name, email, u_id)
        if (createdData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Sales person created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create sales person"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.updateStatus = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesperson_id, status } = req.body
        if (!salesperson_id || !status) {
            return res.send({
                result: false,
                message: "sales person id and status are required "
            })
        }
        let salesPersonData = await model.GetSalespersonData(salesperson_id, u_id)
        if (salesPersonData.length === 0) {
            return res.send({
                result: false,
                message: "Sales person data not found."
            })
        }
        let updatedStatus = await model.updateStatus(salesperson_id, status, u_id)
        if (updatedStatus.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Updated status successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update status"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.listSalesPerson = async (req, res) => {
    try {
        let { u_id } = req.user
        let salesPersonData = await model.listSalesperson(u_id)
        if (salesPersonData.length === 0) {
            return res.send({
                result: false,
                message: "Data not found"
            })
        } else {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: salesPersonData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.deleteSalesPerson = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesperson_id } = req.body
        if (!salesperson_id) {
            return res.send({
                result: false,
                message: "Sales person id is required"
            })
        }
        let deletedData = await model.deleteSalesperson(salesperson_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Sales person deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete sales person"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetSalespersonData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesperson_id } = req.body
        if (!salesperson_id) {
            return res.send({
                result: false,
                message: "Sales person id is required"
            })
        }
        let data = await model.GetSalespersonData(salesperson_id, u_id)
        if (data.length > 0) {
            return res.send({
                result: true,
                message: "Data found",
                data
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