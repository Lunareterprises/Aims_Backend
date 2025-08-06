let model = require('../model/custom_view')


module.exports.CreateCustomView = async (req, res) => {
    try {
        let { u_id } = req.user
        let { cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_table_name } = req.body
        if (!cv_name || !cv_selected_columns || !cv_table_name) {
            return res.send({
                result: false,
                message: "Name, selected column and table name are required. "
            })
        }
        let checkName = await model.CheckName(cv_name, u_id, cv_table_name)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Name already exist."
            })
        }
        let createData = await model.CreateCustomView(cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, u_id, cv_table_name)
        if (createData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Custom view created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create custom view."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListCustomViewFields = async (req, res) => {
    try {
        let { u_id } = req.user
        let { table } = req.body
        if (!table) {
            return res.send({
                result: false,
                message: "Table is required"
            })
        }
        if (table === 'item') {

        }
        let tableData = await model.GetTableData(table)
        if (tableData.length === 0) {
            return res.send({
                result: false,
                message: "Table data not found."
            })
        } else {
            return res.send({
                result: true,
                message: "Table data found.",
                data: tableData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetTables = async (req, res) => {
    try {
        let tables = await model.GetTables()
        if (tables.length === 0) {
            return res.send({
                result: false,
                message: "No tables found"
            })
        } else {
            return res.send({
                result: true,
                message: "Tables found successfully",
                data: tables
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.EditCustomView = async (req, res) => {
    try {
        let { u_id } = req.user
        let { cv_id, cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_table_name } = req.body
        if (!cv_id) {
            return res.send({
                result: false,
                message: "Custom view id is required."
            })
        }
        if (!cv_name || !cv_selected_columns || !cv_table_name) {
            return res.send({
                result: false,
                message: "Name, selected column and table name are required. "
            })
        }
        let customData = await model.GetCustomViewData(cv_id, u_id)
        if (customData.length === 0) {
            return res.send({
                result: false,
                message: "Custom view data not found. Invalid custom view id."
            })
        }
        let checkName = await model.CheckName(cv_name, u_id, cv_table_name, cv_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Name already exist."
            })
        }
        let updatedData = await model.EditCustomView(cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_id)
        if (updatedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "custom view updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update custom view."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListCustomView = async (req, res) => {
    try {
        let { u_id } = req.user
        let { table } = req.body
        if (!table) {
            return res.send({
                result: false,
                message: "Table is required."
            })
        }
        let customData = await model.ListCustomView(u_id, table)
        if (customData.length === 0) {
            return res.send({
                result: false,
                message: "No custom view data found"
            })
        } else {
            return res.send({
                result: true,
                message: "Custom view data found successfully.",
                data: customData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetCustomViewData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { cv_id } = req.body
        if (!cv_id) {
            return res.send({
                result: false,
                message: "Custom view id is required"
            })
        }
        let customData = await model.GetCustomViewData(cv_id, u_id)
        if (customData.length === 0) {
            return res.send({
                result: false,
                message: "Custom view data not found. Invalid custom view id."
            })
        }
        let data = await model.GetDataOfCustomView(customData[0]?.cv_selected_columns, customData[0]?.cv_table_name)
        if (data.length === 0) {
            return res.send({
                result: false,
                message: "Data not found."
            })
        } else {
            return res.send({
                result: true,
                message: "Data found.",
                data
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteCustomView = async (req, res) => {
    try {
        let { u_id } = req.user
        let { cv_id } = req.body
        if (!cv_id) {
            return res.send({
                result: false,
                message: "Custom view id is required."
            })
        }
        let customData = await model.GetCustomViewData(cv_id, u_id)
        if (customData.length === 0) {
            return res.send({
                result: false,
                message: "Custom view not found. Invalid custom view id."
            })
        }
        let deletedData = await model.DeleteCustomView(cv_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Custom view deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete custom view."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}