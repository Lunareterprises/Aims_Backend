var model = require("../model/delivery_challan");
var formidable = require("formidable");
const ExcelJS = require('exceljs')
let fs = require("fs");
let path = require('path')
const moment = require('moment');


module.exports.CreateDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { dc_customer_id, dc_delivery_challan_id, dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment, delivery_challan_items, dc_total, dc_subtotal, dc_discount, dc_tax_rate, dc_tax_type, dc_shipping_charge } = fields;

            if (!dc_customer_id || !dc_date || !dc_type) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let checkCustomer = await model.CheckCustomer(dc_customer_id, u_id)
            if (checkCustomer.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found."
                })
            }

            let adddeliverychallan = await model.CreateDeliveryChallan(u_id, dc_customer_id, dc_delivery_challan_id, dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment, dc_total, dc_subtotal, dc_discount, dc_tax_rate, dc_tax_type, dc_shipping_charge)


            if (adddeliverychallan.affectedRows > 0) {
                if (delivery_challan_items && delivery_challan_items.length > 0) {
                    for (let item of delivery_challan_items) {
                        let { item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount } = item
                        await model.InsertItems(item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount, adddeliverychallan.inserId)
                    }
                }

                const readFile = util.promisify(fs.readFile);
                const writeFile = util.promisify(fs.writeFile);
                if (files.image) {
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                    for (const file of imageFiles) {
                        try {
                            const oldPath = file.filepath;
                            const filename = file.originalFilename;
                            const newPath = path.join(process.cwd(), "uploads", "delivery_challan_docs", filename);
                            const imagePath = "/uploads/delivery_challan_docs/" + filename;

                            const rawData = await readFile(oldPath);
                            await writeFile(newPath, rawData);

                            const InsertImages = await model.InsertFiles(imagePath, adddeliverychallan.inserId);
                            if (InsertImages.affectedRows === 0) {
                                return res.send({
                                    result: false,
                                    message: "Failed to add delivery challan document"
                                });
                            }
                        } catch (err) {
                            console.error("File handling error:", err);
                            return res.status(500).send({
                                result: false,
                                message: "Internal server error while uploading documents"
                            });
                        }
                    }
                    return res.send({
                        result: true,
                        message: "delivery challan added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "delivery challan added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add delivery challan"
                })
            }

        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { delivery_challan_id, dc_customer_id, dc_delivery_challan_id, dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment, delivery_challan_items, dc_total, dc_subtotal, dc_discount, dc_tax_rate, dc_tax_type, dc_shipping_charge } = fields;

            if (!delivery_challan_id || !dc_customer_id || !dc_date || !dc_type) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkDeliveryChallan = await model.CheckDeliverChallan(u_id, delivery_challan_id)
            if (checkDeliveryChallan.length === 0) {
                return res.send({
                    result: false,
                    message: "Delivery challan data not found."
                })
            }

            let checkCustomer = await model.CheckCustomer(dc_customer_id, u_id)
            if (checkCustomer.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found."
                })
            }

            let editdeliverychallan = await model.EditDeliveryChallan(dc_delivery_challan_id, dc_customer_id, dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment, dc_total, dc_subtotal, dc_discount, dc_tax_rate, dc_tax_type, dc_shipping_charge, delivery_challan_id)


            if (editdeliverychallan.affectedRows > 0) {
                if (delivery_challan_items && delivery_challan_items.length > 0) {
                    for (let item of delivery_challan_items) {
                        let { is_id, item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount } = item
                        if (is_id) {
                            let checkItems = await model.CheckItems(is_id, delivery_challan_id)
                            if (checkItems.length === 0) {
                                return res.send({
                                    result: false,
                                    message: "Created item not found"
                                })
                            }
                            await model.UpdateItems(item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount, is_id)
                        } else {
                            await model.InsertItems(item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount, adddeliverychallan.inserId)
                        }
                    }
                }

                const readFile = util.promisify(fs.readFile);
                const writeFile = util.promisify(fs.writeFile);
                if (files.image) {
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                    for (const file of imageFiles) {
                        try {
                            const oldPath = file.filepath;
                            const filename = file.originalFilename;
                            const newPath = path.join(process.cwd(), "uploads", "delivery_challan_docs", filename);
                            const imagePath = "/uploads/delivery_challan_docs/" + filename;

                            const rawData = await readFile(oldPath);
                            await writeFile(newPath, rawData);

                            const InsertImages = await model.InsertFiles(imagePath, adddeliverychallan.inserId);
                            if (InsertImages.affectedRows === 0) {
                                return res.send({
                                    result: false,
                                    message: "Failed to add delivery challan document"
                                });
                            }
                        } catch (err) {
                            console.error("File handling error:", err);
                            return res.status(500).send({
                                result: false,
                                message: "Internal server error while uploading documents"
                            });
                        }
                    }
                    return res.send({
                        result: true,
                        message: "delivery challan added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "delivery challan added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add delivery challan"
                })
            }

        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        let delivery_challan = await model.ListAllDeliveryChallan(u_id)
        if (delivery_challan.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: delivery_challan
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrived data",
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


module.exports.GetSingleDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        let { delivery_challan_id } = req.body
        if (!delivery_challan_id) {
            return res.send({
                result: false,
                message: "Delivery challan id is required"
            })
        }
        let challanData = await model.CheckDeliverChallan(u_id, delivery_challan_id)
        if (challanData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: challanData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrived data",
                data: challanData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteChallanItems = async (req, res) => {
    try {
        let { u_id } = req.user
        let { delivery_challan_id, item_id } = req.body
        if (!delivery_challan_id || !item_id) {
            return res.send({
                result: false,
                message: "Delivery challan id and item id is required"
            })
        }
        let challanData = await model.CheckDeliverChallan(u_id, delivery_challan_id)
        if (challanData.length == 0) {
            return res.send({
                result: false,
                message: "No delivery challan found"
            })
        }
        let itemData = await model.CheckItems(item_id, delivery_challan_id)
        if (itemData.length === 0) {
            return res.send({
                result: false,
                message: "Item data not found."
            })
        }
        let deleteItem = await model.DeleteDeliveryChallanItem(delivery_challan_id, item_id)
        if (deleteItem.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delivery challan item deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete delviery challan item."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteDeliveryChallanDocument = async (req, res) => {
    try {
        let { u_id } = -req.user
        let { delivery_challan_id, document_id } = req.body
        if (!delivery_challan_id || !document_id) {
            return res.send({
                result: false,
                message: "Delivery challan id and document id is required"
            })
        }
        let challanData = await model.CheckDeliverChallan(u_id, delivery_challan_id)
        if (challanData.length == 0) {
            return res.send({
                result: false,
                message: "No delivery challan found"
            })
        }
        let checkDocument = await model.CheckDeliveryDocument(delivery_challan_id, document_id)
        if (checkDocument.length === 0) {
            return res.send({
                result: false,
                message: "Delivery challan document not found."
            })
        }
        let deleteDocument = await model.DeleteDeliveryDocument(delivery_challan_id, document_id)
        if (deleteDocument.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delivery challan document deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete delivery challan document"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        let { delivery_challan_id } = req.body
        if (!delivery_challan_id) {
            return res.send({
                result: false,
                message: "Delivery challan id is required"
            })
        }
        let challanData = await model.CheckDeliverChallan(u_id, delivery_challan_id)
        if (challanData.length == 0) {
            return res.send({
                result: false,
                message: "No delivery challan found"
            })
        }
        let deletedChallan = await model.DeleteDeliveryChallan(u_id, delivery_challan_id)
        if (deletedChallan.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delviery challan deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete delivery challan."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ExportDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        let delivery_challan_data = await model.ListAllDeliveryChallan(u_id)
        if (!delivery_challan_data || delivery_challan_data.length === 0) {
            return res.send({
                result: false,
                message: "No package data found"
            })
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Delivery Challans');
        const headers = [
            // Delivery Challan Info
            { header: 'Delivery Challan ID', key: 'dc_id', width: 18 },
            { header: 'User ID', key: 'dc_user_id', width: 12 },
            { header: 'Customer ID', key: 'dc_customer_id', width: 16 },
            { header: 'Challan Reference', key: 'dc_reference', width: 22 },
            { header: 'Delivery Challan Date', key: 'dc_date', width: 20 },
            { header: 'Challan Type', key: 'dc_type', width: 18 },
            { header: 'Customer Notes', key: 'dc_customer_notes', width: 30 },
            { header: 'Adjustment', key: 'dc_adjustment', width: 14 },
            { header: 'Challan Status', key: 'dc_status', width: 16 },
            { header: 'Total', key: 'dc_total', width: 12 },
            { header: 'Subtotal', key: 'dc_subtotal', width: 14 },
            { header: 'Discount', key: 'dc_discount', width: 14 },
            { header: 'Tax Rate', key: 'dc_tax_rate', width: 14 },
            { header: 'Tax Type', key: 'dc_tax_type', width: 14 },
            { header: 'Shipping Charge', key: 'dc_shipping_charge', width: 20 },

            // Customer Info
            { header: 'Customer First Name', key: 'cu_first_name', width: 20 },
            { header: 'Customer Last Name', key: 'cu_last_name', width: 20 },
            { header: 'Company Name', key: 'cu_company_name', width: 25 },
            { header: 'Display Name', key: 'cu_display_name', width: 20 },
            { header: 'Email', key: 'cu_email', width: 30 },
            { header: 'Mobile', key: 'cu_mobile', width: 20 },
            { header: 'PAN No', key: 'cu_pan_no', width: 18 },
            { header: 'Customer Type', key: 'cu_type', width: 18 },
            { header: 'Currency', key: 'cu_currency', width: 22 },
            { header: 'Payment Terms', key: 'cu_payment_terms', width: 22 },

            // Billing Address
            { header: 'Billing Attention', key: 'cu_b_addr_attention', width: 22 },
            { header: 'Billing Country', key: 'cu_b_addr_country', width: 20 },
            { header: 'Billing Address', key: 'cu_b_addr_address', width: 30 },
            { header: 'Billing City', key: 'cu_b_addr_city', width: 20 },
            { header: 'Billing State', key: 'cu_b_addr_state', width: 20 },
            { header: 'Billing Pincode', key: 'cu_b_addr_pincode', width: 16 },

            // Shipping Address
            { header: 'Shipping Attention', key: 'cu_s_addr_attention', width: 22 },
            { header: 'Shipping Country', key: 'cu_s_addr_country', width: 20 },
            { header: 'Shipping Address', key: 'cu_s_addr_address', width: 30 },
            { header: 'Shipping City', key: 'cu_s_addr_city', width: 20 },
            { header: 'Shipping State', key: 'cu_s_addr_state', width: 20 },
            { header: 'Shipping Pincode', key: 'cu_s_addr_pincode', width: 16 },

            // Misc
            { header: 'Tax Preference', key: 'cu_tax_preference', width: 20 },
            { header: 'Place of Supply', key: 'cu_place_supply', width: 20 },
        ];

        worksheet.columns = headers;
        // Add data rows
        delivery_challan_data.forEach(row => {
            worksheet.addRow(row);
        });
        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'delivery_challan');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `delivery_challan_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `delivery_challan_${timestamp}.csv`);
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