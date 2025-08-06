var model = require("../../model/sales/addsalesorder");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddSalesOrder = async (req, res) => {
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
                        const Insertfile = await model.InsertFiles(salesorder_id, fileUrl);

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