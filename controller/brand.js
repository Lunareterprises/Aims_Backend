let model = require('../model/brand')

module.exports.CreateBrand = async (req, res) => {
    try {
        let { u_id } = req.user
        let { name } = req.body
        if (!name) {
            return res.send({
                result: false,
                message: "Name is required"
            })
        }
        let brandExist = await model.CheckName(name, u_id)
        if (brandExist.length > 0) {
            return res.send({
                result: false,
                message: "Brand already exist with this name."
            })
        }
        let createbrand = await model.CreateBrand(name, u_id)
        if (createbrand.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Brand created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create brand."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.EditBrand = async (req, res) => {
    try {
        let { u_id } = req.user
        let { brand_id, name } = req.body
        if (!brand_id || !name) {
            return res.send({
                result: false,
                message: "Brand id and name is required"
            })
        }
        let brandData = await model.CheckById(brand_id, u_id)
        if (brandData.length === 0) {
            return res.send({
                result: false,
                message: "Brand not found. Invalid brand id"
            })
        }
        let brandExist = await model.CheckName(name, u_id)
        if (brandExist.length > 0) {
            return res.send({
                result: false,
                message: "Brand already exist with this name."
            })
        }
        let updatedData = await model.UpdateBrand(brand_id, name)
        if (updatedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Updated brand successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update brand."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListBrands = async (req, res) => {
    try {
        let { u_id } = req.user
        let brandList = await model.ListBrand(u_id)
        if (brandList.length > 0) {
            return res.send({
                result: true,
                message: "Brand data retrieved successfully",
                data: brandList
            })
        } else if (brandList.length === 0) {
            return res.send({
                result: true,
                message: "No Data found",
                data: brandList
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

module.exports.DeleteBrand = async (req, res) => {
    try {
        let { u_id } = req.user
        let { brand_id } = req.body
        if (!brand_id) {
            return res.send({
                result: false,
                message: "Brand id is required"
            })
        }
        let checkBrand = await model.CheckById(brand_id, u_id)
        if (checkBrand.length === 0) {
            return res.send({
                result: false,
                message: "Brand not found. Invalid brand id"
            })
        }
        let deletedData = await model.DeleteBrand(brand_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Successfully deleted brand."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete brand."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetBrandData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { brand_id } = req.body
        if (!brand_id) {
            return res.send({
                result: false,
                message: "Brand id is required"
            })
        }
        let checkBrand = await model.CheckById(brand_id, u_id)
        if (checkBrand.length === 0) {
            return res.send({
                result: false,
                message: "Brand not found. Invalid brand id"
            })
        } else {
            return res.send({
                result: true,
                message: "Data found",
                data: checkBrand
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}