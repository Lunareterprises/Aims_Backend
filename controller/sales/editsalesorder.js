var model = require('../../model/sales/editsalesorder')
var formidable = require('formidable')
var fs = require('fs')

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

            var { so_id, so_customer_name, so_customer_id, so_sales_order_id, so_reference, so_order_date, so_shipment_date,
                so_payment_terms, so_delivery_method, so_salesperson_name, so_salesperson_id, so_customer_notes,
                so_shipping_charge, so_adjustment_amount, so_tds_tcs, so_selected_tax, so_total_amount, so_terms_conditions, sales_order_items } = fields;

            if (!so_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckSalesOrderQuery(so_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(so_id);

                let condition = ``;

                if (so_customer_name) {
                    if (condition == '') {
                        condition = `set so_customer_name ='${so_customer_name}' `
                    } else {
                        condition += `,so_customer_name='${so_customer_name}'`
                    }
                }
                if (so_customer_id) {
                    if (condition == '') {
                        condition = `set so_customer_id ='${so_customer_id}' `
                    } else {
                        condition += `,so_customer_id='${so_customer_id}'`
                    }
                }
                if (so_sales_order_id) {
                    if (condition == '') {
                        condition = `set so_sales_order_id='${so_sales_order_id}' `
                    } else {
                        condition += `,so_sales_order_id='${so_sales_order_id}'`
                    }
                }
                if (so_reference) {
                    if (condition == '') {
                        condition = `set so_reference ='${so_reference}' `
                    } else {
                        condition += `,so_reference='${so_reference}'`
                    }
                }
                if (so_order_date) {
                    if (condition == '') {
                        condition = `set so_order_date ='${so_order_date}' `
                    } else {
                        condition += `,so_order_date='${so_order_date}'`
                    }
                }
                if (so_shipment_date) {
                    if (condition == '') {
                        condition = `set so_shipment_date ='${so_shipment_date}' `
                    } else {
                        condition += `,so_shipment_date='${so_shipment_date}'`
                    }
                }
                if (so_payment_terms) {
                    if (condition == '') {
                        condition = `set so_payment_terms ='${so_payment_terms}' `
                    } else {
                        condition += `,so_payment_terms='${so_payment_terms}'`
                    }
                }
                if (so_delivery_method) {
                    if (condition == '') {
                        condition = `set so_delivery_method ='${so_delivery_method}' `
                    } else {
                        condition += `,so_delivery_method='${so_delivery_method}'`
                    }
                }
                if (so_salesperson_name) {
                    if (condition == '') {
                        condition = `set so_salesperson_name ='${so_salesperson_name}' `
                    } else {
                        condition += `,so_salesperson_name='${so_salesperson_name}'`
                    }
                }
                if (so_salesperson_id) {
                    if (condition == '') {
                        condition = `set so_salesperson_id ='${so_salesperson_id}' `
                    } else {
                        condition += `,so_salesperson_id='${so_salesperson_id}'`
                    }
                }
                if (so_customer_notes) {
                    if (condition == '') {
                        condition = `set so_customer_notes ='${so_customer_notes}' `
                    } else {
                        condition += `,so_customer_notes='${so_customer_notes}'`
                    }
                }
                if (so_shipping_charge) {
                    if (condition == '') {
                        condition = `set so_shipping_charge ='${so_shipping_charge}' `
                    } else {
                        condition += `,so_shipping_charge='${so_shipping_charge}'`
                    }
                }
                if (so_adjustment_amount) {
                    if (condition == '') {
                        condition = `set so_adjustment_amount ='${so_adjustment_amount}' `
                    } else {
                        condition += `,so_adjustment_amount='${so_adjustment_amount}'`
                    }
                }
                if (so_tds_tcs) {
                    if (condition == '') {
                        condition = `set so_tds_tcs ='${so_tds_tcs}' `
                    } else {
                        condition += `,so_tds_tcs='${so_tds_tcs}'`
                    }
                }
                if (so_selected_tax) {
                    if (condition == '') {
                        condition = `set so_selected_tax ='${so_selected_tax}' `
                    } else {
                        condition += `,so_selected_tax='${so_selected_tax}'`
                    }
                }
                if (so_total_amount) {
                    if (condition == '') {
                        condition = `set so_total_amount ='${so_total_amount}' `
                    } else {
                        condition += `,so_total_amount='${so_total_amount}'`
                    }
                }
                if (so_terms_conditions) {
                    if (condition == '') {
                        condition = `set so_terms_conditions ='${so_terms_conditions}' `
                    } else {
                        condition += `,so_terms_conditions='${so_terms_conditions}'`
                    }
                }



                if (condition !== '') {
                    var EditSalesOrder = await model.ChangeSalesOrder(condition, so_id, u_id)
                }
                if (EditSalesOrder.affectedRows > 0) {

                    if (sales_order_items) {
                        let salesorderitems = [];

                        // Check if sales_order_items is defined, not null, and not "undefined" or empty string before parsing
                        if (sales_order_items && sales_order_items !== "undefined" && sales_order_items !== "") {
                            try {
                                salesorderitems = JSON.parse(sales_order_items);
                            } catch (e) {
                                console.error("Error parsing sales_order_items:", e);
                                // Handle the error, e.g., keep salesorderitems as an empty array
                                salesorderitems = [];
                            }
                        } else {
                            // If sales_order_items is invalid, default to an empty array
                            salesorderitems = [];
                        }

                        console.log(salesorderitems);

                        // let with_id = [];
                        // let without_id = [];

                        for (const item of salesorderitems) {
                            if (item.is_id) {
                                // with_id.push(item);
                                await model.UpdateSalesOrderItem(item, item.is_id, so_id)

                            } else {
                                // without_id.push(item);
                                await model.InsertSalesOrderItem(so_id, item);
                            }
                        }


                    }

                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    console.log(files_ids, "files_ids");
                    if (files_ids.length > 0) {

                        let deletefiles = await model.DeleteFilesQuery(so_id, files_ids)
                    }

                    if (files.image) {
                        if (Array.isArray(files.image)) {

                            for (const file of files.image) {
                                var oldPath = file.filepath;
                                var newPath = process.cwd() + "/uploads/sales_order_doc/" + file.originalFilename;
                                let rawData = fs.readFileSync(oldPath);
                                fs.writeFileSync(newPath, rawData);
                                var imagepath = ("/uploads/sales_order_doc/" + file.originalFilename);
                                var Insertimages = await model.AddImagesQuery(so_id, imagepath)
                                console.log(Insertimages);
                                if (Insertimages.affectedRows == 0) {
                                    return res.send({
                                        result: false,
                                        message: "failed to add Sales Order document"
                                    })
                                }

                            }
                        } else {
                            var oldPath = files.image.filepath;
                            var newPath = process.cwd() + "/uploads/sales_order_doc/" + files.image.originalFilename
                            let rawData = fs.readFileSync(oldPath);
                            // console.log(oldPath, "qqq");

                            fs.writeFileSync(newPath, rawData)
                            var imagepath = "/uploads/sales_order_doc/" + files.image.originalFilename
                            var Insertimages = await model.AddImagesQuery(so_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Sales Order document"
                                })
                            }
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Sales Order details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Sales Order details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Sales Order details does not exists"
                })
            }
        })

    } catch
    (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })

    }
}

