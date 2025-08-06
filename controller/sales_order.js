let model = require("../model/sales_order");
let formidable = require("formidable");
let fs = require("fs");
let path = require('path')
let util = require('util')
const ExcelJS = require('exceljs')
const moment = require('moment');


module.exports.CreateSalesOrder = async (req, res) => {
    try {
        var { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_supply_place, so_discount_type, so_discount_value, so_subtotal,
                so_payment_terms_id, so_delivery_method, so_delivery_method_id, so_salesperson_id, so_customer_notes,
                so_shipping_charge, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, sales_order_items } = fields;

            if (!so_customer_id || !so_order_date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let customerData = await model.CheckCustomer(so_customer_id, u_id)
            if (customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found."
                })
            }
            let paymentTerms = await model.CheckPaymentTerm(so_payment_terms_id, u_id)
            if (so_payment_terms_id && paymentTerms.length === 0) {
                return res.send({
                    result: false,
                    message: "Payment terms data not found."
                })
            }
            let salespersonData = await model.CheckSalesPerson(so_salesperson_id, u_id)
            if (so_salesperson_id && salespersonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Sales person data not found."
                })
            }
            let checkDeliverymethodName = await model.CheckDeliveryMethodName(so_delivery_method, u_id)
            if (so_delivery_method && checkDeliverymethodName.length > 0) {
                return res.send({
                    result: false,
                    message: "Delivery method already exist"
                })
            }
            let createdDeliverymethod = await model.CreateDeliveryMethod(so_delivery_method, u_id)
            if (so_delivery_method && createdDeliverymethod.affectedRows === 0) {
                return res.send({
                    result: false,
                    message: "Failed to create delivery method."
                })
            }
            let deliveryMethodData = await model.CheckDeliveryMethodData(so_delivery_method_id, u_id)
            if (so_delivery_method_id && deliveryMethodData.length === 0) {
                return res.send({
                    result: false,
                    message: "Delivery method data not found."
                })
            }
            let tds_tcs_data = await model.CheckTdsTcs(so_tds_tcs_id, u_id)
            if (so_tds_tcs_id && tds_tcs_data.length === 0) {
                return res.send({
                    result: false,
                    message: `${so_tds_tcs} data not found.`
                })
            }
            let deliveryMethod_id = so_delivery_method_id ? so_delivery_method_id : so_delivery_method ? createdDeliverymethod.insertId : null
            let addsalesorder = await model.AddSalesOrder(u_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, deliveryMethod_id, so_salesperson_id, so_customer_notes, so_shipping_charge, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_supply_place, so_subtotal, so_discount_type, so_discount_value);
            if (addsalesorder.affectedRows > 0) {
                for (let item of sales_order_items) {
                    let { item_id, description, quantity, rate, amount, discount_type, discount_value, tax_id } = item
                    let checkItem = await model.CheckItem(item_id, u_id)
                    if (checkItem.length === 0) {
                        return res.send({
                            result: false,
                            message: "Item data not found."
                        })
                    }
                    let taxData = await model.CheckTax(tax_id, u_id)
                    if (tax_id && taxData.length === 0) {
                        return res.send({
                            result: false,
                            message: "Tax data not found."
                        })
                    }
                    let insertItems = await model.InsertSalesOrderItem(addsalesorder.insertId, item_id, description, quantity, rate, amount, discount_type, discount_value, tax_id)
                    if (insertItems.affectedRows === 0) {
                        await model.DeleteSalesOrder(addsalesorder.insertId, u_id)
                        return res.send({
                            result: false,
                            message: "Failed to insert items"
                        })
                    }
                }

                const uploadDir = path.join(process.cwd(), "uploads", "sales_order_doc");

                // ✅ Ensure directory exists
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const fileArray = Array.isArray(files.file) ? files.file : [files.file];

                const readFile = util.promisify(fs.readFile);
                const writeFile = util.promisify(fs.writeFile);

                for (const file of fileArray) {
                    try {
                        const oldPath = file.filepath;
                        const filename = Date.now() + "_" + file.originalFilename;
                        const newPath = path.join(uploadDir, filename);

                        const fileData = await readFile(oldPath);
                        await writeFile(newPath, fileData);

                        const fileUrl = `/uploads/sales_order_doc/${filename}`;
                        const Insertfile = await model.InsertFiles(addsalesorder.insertId, fileUrl);

                        if (Insertfile.affectedRows === 0) {
                            return {
                                result: false,
                                message: "Failed to add Sales Order document"
                            };
                        }
                    } catch (err) {
                        console.error("File processing error:", err);
                        return {
                            result: false,
                            message: "Error while processing files"
                        };
                    }
                }
                return res.send({
                    result: true,
                    message: "Sales Order added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Sales Order"
                })
            }

        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};


module.exports.EditSalesOrder = async (req, res) => {
    try {
        var { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { so_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_supply_place, so_discount_type, so_discount_value, so_subtotal,
                so_payment_terms_id, so_delivery_method, so_delivery_method_id, so_salesperson_id, so_customer_notes,
                so_shipping_charge, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, sales_order_items } = fields;

            if (!so_id || !so_customer_id || !so_order_date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let salesOrderData = await model.CheckSalesOrder(so_id, u_id)
            if (salesOrderData.length === 0) {
                return res.send({
                    result: false,
                    message: "Sales order data not found."
                })
            }
            let customerData = await model.CheckCustomer(so_customer_id, u_id)
            if (customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found."
                })
            }
            let paymentTerms = await model.CheckPaymentTerm(so_payment_terms_id, u_id)
            if (so_payment_terms_id && paymentTerms.length === 0) {
                return res.send({
                    result: false,
                    message: "Payment terms data not found."
                })
            }
            let salespersonData = await model.CheckSalesPerson(so_salesperson_id, u_id)
            if (so_salesperson_id && salespersonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Sales person data not found."
                })
            }
            let checkDeliverymethodName = await model.CheckDeliveryMethodName(so_delivery_method, u_id)
            if (so_delivery_method && checkDeliverymethodName.length > 0) {
                return res.send({
                    result: false,
                    message: "Delivery method already exist"
                })
            }
            let createdDeliverymethod = await model.CreateDeliveryMethod(so_delivery_method, u_id)
            if (so_delivery_method && createdDeliverymethod.affectedRows === 0) {
                return res.send({
                    result: false,
                    message: "Failed to create delivery method."
                })
            }
            let deliveryMethodData = await model.CheckDeliveryMethodData(so_delivery_method_id, u_id)
            if (so_delivery_method_id && deliveryMethodData.length === 0) {
                return res.send({
                    result: false,
                    message: "Delivery method data not found."
                })
            }
            let tds_tcs_data = await model.CheckTdsTcs(so_tds_tcs_id, u_id)
            if (so_tds_tcs_id && tds_tcs_data.length === 0) {
                return res.send({
                    result: false,
                    message: `${so_tds_tcs} data not found.`
                })
            }
            let deliveryMethod_id = so_delivery_method_id ? so_delivery_method_id : so_delivery_method ? createdDeliverymethod.insertId : null
            let updateSalesOrder = await model.EditSalesOrder(so_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, deliveryMethod_id, so_salesperson_id, so_customer_notes, so_shipping_charge, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_supply_place, so_subtotal, so_discount_type, so_discount_value);
            if (updateSalesOrder.affectedRows > 0) {
                for (let item of sales_order_items) {
                    let { soi_id, item_id, description, quantity, rate, amount, discount_type, discount_value, tax_id } = item
                    if (soi_id) {
                        let checkSalesOrderItem = await model.CheckSalesOrderItem(so_id, soi_id)
                        if (checkSalesOrderItem.length === 0) {
                            return res.send({
                                result: false,
                                message: "Sales order item not found."
                            })
                        }
                        let updatedItemData = await model.UpdateSalesOrderItem(soi_id, description, quantity, rate, amount, discount_type, discount_value, tax_id)
                        if (updatedItemData.affectedRows === 0) {
                            return res.send({
                                result: false,
                                message: "Failed to update sales order item"
                            })
                        }
                    } else {
                        let checkItem = await model.CheckItem(item_id, u_id)
                        if (checkItem.length === 0) {
                            return res.send({
                                result: false,
                                message: "Item data not found."
                            })
                        }
                        let taxData = await model.CheckTax(tax_id, u_id)
                        if (tax_id && taxData.length === 0) {
                            return res.send({
                                result: false,
                                message: "Tax data not found."
                            })
                        }
                        let insertItems = await model.InsertSalesOrderItem(so_id, item_id, description, quantity, rate, amount, discount_type, discount_value, tax_id)
                        if (insertItems.affectedRows === 0) {
                            await model.DeleteSalesOrder(so_id, u_id)
                            return res.send({
                                result: false,
                                message: "Failed to insert items"
                            })
                        }
                    }
                }

                const uploadDir = path.join(process.cwd(), "uploads", "sales_order_doc");

                // ✅ Ensure directory exists
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const fileArray = Array.isArray(files.file) ? files.file : [files.file];

                const readFile = util.promisify(fs.readFile);
                const writeFile = util.promisify(fs.writeFile);

                for (const file of fileArray) {
                    try {
                        const oldPath = file.filepath;
                        const filename = Date.now() + "_" + file.originalFilename;
                        const newPath = path.join(uploadDir, filename);

                        const fileData = await readFile(oldPath);
                        await writeFile(newPath, fileData);

                        const fileUrl = `/uploads/sales_order_doc/${filename}`;
                        const Insertfile = await model.InsertFiles(so_id, fileUrl);

                        if (Insertfile.affectedRows === 0) {
                            return {
                                result: false,
                                message: "Failed to add Sales Order document"
                            };
                        }
                    } catch (err) {
                        console.error("File processing error:", err);
                        return {
                            result: false,
                            message: "Error while processing files"
                        };
                    }
                }
                return res.send({
                    result: true,
                    message: "Sales Order added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Sales Order"
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


module.exports.ListAllSales = async (req, res) => {
    try {
        let { u_id } = req.user
        let listAllSalesOrder = await model.ListAllSalesOrder(u_id)
        if (listAllSalesOrder.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: listAllSalesOrder
            })
        } else {
            return res.send({
                restult: false,
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


module.exports.GetSingleSalesOrderData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id } = req.body
        if (!salesorder_id) {
            return res.send({
                result: false,
                message: "Sales order id is required"
            })
        }
        let salesOrderData = await model.CheckSalesOrder(salesorder_id, u_id)
        if (salesOrderData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: salesOrderData
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


module.exports.DeleteSalesOrderItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id, sales_order_item_id } = req.body
        if (!salesorder_id || !sales_order_item_id) {
            return res.send({
                result: false,
                message: "sales order id and sales order item id is required."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order not found."
            })
        }
        let checkSalesOrderItem = await model.CheckSalesOrderItem(salesorder_id, sales_order_item_id)
        if (checkSalesOrderItem.length === 0) {
            return res.send({
                result: false,
                message: "Sales order item not found."
            })
        }
        let deleted = await model.DeleteSalesOrderItem(salesorder_id, sales_order_item_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Sales order item deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete sales order item"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteSalesOrderDocument = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id, salesorder_document_id } = req.body
        if (!salesorder_id || !salesorder_document_id) {
            return res.send({
                result: false,
                message: "Sales order id and sales order document id is required."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order not found."
            })
        }
        let checkSalesOrderDocument = await model.CheckSalesOrderDocument(salesorder_id, salesorder_document_id)
        if (checkSalesOrderDocument.length === 0) {
            return res.send({
                result: false,
                message: "Sales order document not found."
            })
        }
        let deleted = await model.DeleteSalesOrderDocument(salesorder_id, salesorder_document_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Sales order document deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete sales order document."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteSalesOrder = async (req, res) => {
    try {
        let { u_id } = req.user
        let { salesorder_id } = req.body
        if (!salesorder_id) {
            return res.send({
                result: false,
                message: "Sales order id is required."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(salesorder_id, u_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order data not found."
            })
        }
        let deleted = await model.DeleteSalesOrder(salesorder_id, u_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Sales order deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete sales order."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ExportSalesOrder = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        let listAllSalesOrder = await model.ListAllSalesOrder(u_id)
        if (!listAllSalesOrder || listAllSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "No Sales order data found"
            })
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('sales order');
        const headers = [
            { header: 'Sales Order ID', key: 'so_id', width: 16 },

            // Customer Info
            { header: 'Customer Name', key: 'customer_name', width: 24 },
            { header: 'Customer Email', key: 'customer_email', width: 24 },
            { header: 'Customer Phone', key: 'customer_phone', width: 18 },

            // Sales Order Info
            { header: 'Sales Order Number', key: 'so_number', width: 22 },
            { header: 'Reference Number', key: 'so_reference', width: 22 },
            { header: 'Order Date', key: 'so_order_date', width: 18 },
            { header: 'Shipment Date', key: 'so_shipment_date', width: 18 },
            { header: 'Status', key: 'so_status', width: 14 },

            // Salesperson Info
            { header: 'Salesperson Name', key: 'salesperson_name', width: 24 },
            { header: 'Salesperson Email', key: 'salesperson_email', width: 24 },

            // Payment & Delivery Info
            { header: 'Payment Term Name', key: 'payment_term_name', width: 24 },
            { header: 'Payment Term Days', key: 'payment_term_total_days', width: 20 },
            { header: 'Delivery Method Name', key: 'delivery_method_name', width: 24 },

            // TDS/TCS Info
            { header: 'TDS/TCS Type', key: 'so_tds_tcs', width: 14 },
            { header: 'TDS/TCS Name', key: 'tcs_tds_name', width: 22 },
            { header: 'TDS/TCS Rate (%)', key: 'tcs_tds_rate', width: 18 },

            // Financial Details
            { header: 'Subtotal', key: 'so_subtotal', width: 16 },
            { header: 'Shipping Charge', key: 'so_shipping_charge', width: 18 },
            { header: 'Adjustment', key: 'so_adjustment', width: 14 },
            { header: 'Discount Type', key: 'so_discount_type', width: 18 },
            { header: 'Discount Value', key: 'so_discount_value', width: 18 },
            { header: 'Total Amount', key: 'so_total_amount', width: 18 },

            // Misc
            { header: 'Customer Notes', key: 'so_customer_notes', width: 30 },
            { header: 'Terms & Conditions', key: 'so_terms_conditions', width: 30 },
            { header: 'Place of Supply', key: 'so_place_supply', width: 20 },
        ];

        worksheet.columns = headers;
        // Add data rows
        listAllSalesOrder.forEach(row => {
            worksheet.addRow(row);
        });
        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'sales_order');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `sales_order_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `sales_order_${timestamp}.csv`);
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