let model = require('../model/package')
const ExcelJS = require('exceljs')
let fs = require("fs");
let path = require('path')
let util = require('util')
const moment = require('moment');

module.exports.CreatePackage = async (req, res) => {
    try {
        let { u_id } = req.user
        let { package_slip, date, package_items, salesorder_id, internal_notes, customer_id } = req.body
        if (!package_slip || !salesorder_id || !date) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        if (package_items.length === 0) {
            return res.send({
                result: false,
                message: "Package item should contain atleast 1 item."
            })
        }
        let checkCustomer = await model.CheckCustomer(customer_id, u_id)
        if (checkCustomer.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id, customer_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order data not found."
            })
        }
        let checkSlip = await model.CheckSlip(package_slip, u_id)
        if (checkSlip.length > 0) {
            return res.send({
                result: false,
                message: "Package slip already exist"
            })
        }
        for (let item of package_items) {
            let { salesorder_item_id } = item
            let checkSalesOrderItems = await model.CheckSalesOrderItems(salesorder_item_id, salesorder_id)
            if (checkSalesOrderItems.length === 0) {
                return res.send({
                    result: false,
                    message: `Item not found for ${salesorder_item_id}`
                })
            }
        }
        let insertPackage = await model.CreatePackage(package_slip, date, salesorder_id, u_id, internal_notes)
        if (insertPackage.affectedRows > 0) {
            for (let item of package_items) {
                let { salesorder_item_id, ordered, packed, quantity_left } = item
                let insertItem = await model.InsertPackageItems(salesorder_item_id, ordered, packed, quantity_left, insertPackage.insertId)
                if (insertItem.affectedRows === 0) {
                    await model.DeletePackage(insertPackage.insertId, u_id)
                    return res.send({
                        result: false,
                        message: `Failed to insert item of id : ${salesorder_item_id}`
                    })
                }
            }
            return res.send({
                result: true,
                message: "Package created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create package."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditPackage = async (req, res) => {
    try {
        let { u_id } = req.user
        let { package_id, package_slip, date, package_items, salesorder_id, internal_notes, customer_id } = req.body
        if (!package_id || !package_slip || !salesorder_id || !date) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        if (package_items.length === 0) {
            return res.send({
                result: false,
                message: "Package item should contain atleast 1 item."
            })
        }
        let checkPackage = await model.CheckPackage(package_id, u_id, salesorder_id)
        if (checkPackage.length === 0) {
            return res.send({
                result: false,
                message: "Package not found."
            })
        }
        let checkCustomer = await model.CheckCustomer(customer_id, u_id)
        if (checkCustomer.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id, customer_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order data not found."
            })
        }
        let checkSlip = await model.CheckSlip(package_slip, u_id)
        if (checkSlip.length > 0) {
            return res.send({
                result: false,
                message: "Package slip already exist"
            })
        }
        for (let item of package_items) {
            let { salesorder_item_id } = item
            let checkSalesOrderItems = await model.CheckSalesOrderItems(salesorder_item_id, salesorder_id)
            if (checkSalesOrderItems.length === 0) {
                return res.send({
                    result: false,
                    message: `Item not found for ${salesorder_item_id}`
                })
            }
        }
        let editedPackage = await model.EditPackage(package_id, package_slip, date, internal_notes)
        if (editedPackage.affectedRows > 0) {
            for (let item of package_items) {
                let { pi_id, salesorder_item_id, ordered, packed, quantity_left } = item
                if (pi_id) {
                    let updateItem = await model.UpdatePackageItem(pi_id, salesorder_item_id, ordered, packed, quantity_left)
                    if (updateItem.affectedRows === 0) {
                        return res.send({
                            result: false,
                            message: "Failed to update package item"
                        })
                    }
                } else {
                    let insertItem = await model.InsertPackageItems(salesorder_item_id, ordered, packed, quantity_left, insertPackage.insertId)
                    if (insertItem.affectedRows === 0) {
                        await model.DeletePackage(insertPackage.insertId, u_id)
                        return res.send({
                            result: false,
                            message: `Failed to insert item of id : ${salesorder_item_id}`
                        })
                    }
                }
            }
            return res.send({
                result: true,
                message: "Package updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update package."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllPackages = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id } = req.body
        if (!salesorder_id) {
            return res.send({
                result: false,
                message: "Sales order id is required"
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order data not found."
            })
        }
        let packages = await model.ListAllPackage(u_id, salesorder_id)
        if (packages.length) {
            return res.send({
                result: true,
                message: "Data retreived successfully.",
                data: packages
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retreive data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSinglePackageData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id, package_id, customer_id } = req.body
        if (!salesorder_id || !package_id || !customer_id) {
            return res.send({
                result: false,
                message: "Sales order id , package id and customer id is required."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id, customer_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order data not found."
            })
        }
        let packageData = await model.CheckPackage(package_id, u_id, salesorder_id)
        if (packageData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: packageData
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


module.exports.DeletePackageItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { package_id, package_item_id, salesorder_id } = req.body
        if (!package_id || !package_item_id || !salesorder_id) {
            return res.send({
                result: false,
                message: "Package id, package item id and sales order id is required"
            })
        }
        let checkPackage = await model.CheckPackage(package_id, u_id, salesorder_id)
        if (checkPackage.length === 0) {
            return res.send({
                result: false,
                message: "Package data not found."
            })
        }
        let checkPackageItem = await model.CheckPackageItem(package_id, salesorder_id, package_item_id)
        if (checkPackageItem.length === 0) {
            return res.send({
                result: false,
                message: "Package item not found."
            })
        }
        let deletePackageItem = await model.DeletePackageItem(package_id, salesorder_id, package_item_id)
        if (deletePackageItem.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Package item deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete package item"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeletePackage = async (req, res) => {
    try {
        let { u_id } = req.user
        let { package_id, salesorder_id } = req.body
        if (!package_id || !salesorder_id) {
            return res.send({
                result: false,
                message: "Package id and sales order id is required."
            })
        }
        let checkPackage = await model.CheckPackage(package_id, u_id, salesorder_id)
        if (checkPackage.length === 0) {
            return res.send({
                result: false,
                message: "Package data not found."
            })
        }
        let deletePackage = await model.DeletePackage(package_id, u_id)
        if (deletePackage.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Package deletd successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete package."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ExportPackages = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type, status } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        if (!status) {
            return res.send({
                result: false,
                message: "Status is required"
            })
        }
        let packageData = await model.ExportPackages(u_id, status)
        if (!packageData || packageData.length === 0) {
            return res.send({
                result: false,
                message: "No package data found"
            })
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Packages');
        const headers = [
            // Package Info
            { header: 'Package ID', key: 'p_id', width: 14 },
            { header: 'Package Slip Number', key: 'p_package_slip', width: 22 },
            { header: 'Package Date', key: 'p_date', width: 18 },
            { header: 'Package Status', key: 'p_package_status', width: 16 },
            { header: 'Internal Notes', key: 'p_internal_notes', width: 30 },
            { header: 'Created At', key: 'p_created_at', width: 22 },
            { header: 'Updated At', key: 'p_updated_at', width: 22 },

            // Linked Sales Order Info
            { header: 'Sales Order Number', key: 'so_number', width: 22 },
            { header: 'Reference Number', key: 'so_reference', width: 22 },
            { header: 'Order Date', key: 'so_order_date', width: 18 },
            { header: 'Sales Order Total', key: 'so_total_amount', width: 20 },
            { header: 'Sales Order Status', key: 'so_status', width: 18 },
        ];
        worksheet.columns = headers;
        // Add data rows
        packageData.forEach(row => {
            worksheet.addRow(row);
        });
        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'packages');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `packages_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `packages_${timestamp}.csv`);
            await workbook.csv.writeFile(returnPath);
        }
        return res.send({
            result: true,
            message: "Data exported successfully.",
            file: req.protocol + "://" + req.get("host") + returnPath.replace(process.cwd(), '')
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}