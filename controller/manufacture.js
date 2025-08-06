let model = require('../model/manufacture')

module.exports.CreateManufacture = async (req, res) => {
    try {
        let { u_id } = req.user
        let { name } = req.body
        if (!name) {
            return res.send({
                result: false,
                message: "Name is required"
            })
        }
        let manufatureData = await model.CheckManufacture(name, u_id)
        if (manufatureData.length > 0) {
            return res.send({
                result: false,
                message: "Manufacture already exist"
            })
        }
        let manufactureCreated = await model.CreateManufacture(name, u_id)
        if (manufactureCreated.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Manufacture created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create manufacture"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.EditManufacture = async (req, res) => {
    try {
        let { u_id } = req.user
        let { manufacture_id, name } = req.body
        if (!manufacture_id || !name) {
            return res.send({
                result: false,
                message: "Name and manufacture id are required"
            })
        }
        let manufatureData = await model.CheckWithId(manufacture_id, u_id)
        if (manufatureData.length === 0) {
            return res.send({
                result: false,
                message: "Manufacture data not found. Invalid manufacture id"
            })
        }
        let checkName = await model.CheckManufacture(name, u_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Manufacture already exist"
            })
        }
        let updateData = await model.UpdateManufacture(manufacture_id, name)
        if (updateData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Successfully updated manufacture"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update manufacture"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListManufactures = async (req, res) => {
    try {
        let { u_id } = req.user
        let manufactureData = await model.ListAllManufacture(u_id)
        if (manufactureData.length > 0) {
            return res.send({
                result: true,
                message: "Retrieved manufacture data successfully",
                data: manufactureData
            })
        } else if (manufactureData.length === 0) {
            return res.send({
                result: true,
                message: "No data found",
                data: manufactureData
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

module.exports.DeleteManufacture = async (req, res) => {
    try {
        let { u_id } = req.user
        let { manufacture_id } = req.body
        if (!manufacture_id) {
            return res.send({
                result: false,
                message: "Manufacture id is is required"
            })
        }
        let deletedData = await model.DeleteManufacture(manufacture_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Successfully deleted manufacture"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete manufacture"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetManufactureData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { manufacture_id } = req.body
        if (!manufacture_id) {
            return res.send({
                result: false,
                message: "Manufacture id is is required"
            })
        }
        let data = await model.CheckWithId(manufacture_id, u_id)
        if (data.length > 0) {
            return res.send({
                result: true,
                message: "Data found.",
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