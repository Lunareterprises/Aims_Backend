var model = require('../../model/purchase/editpurchaseorder')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditPurchaseOrder = async (req, res) => {
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

            var { po_id, po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
                po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
                po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment, po_total_amount, po_terms_condition, purchase_order_items } = fields;

            if (!po_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckPurchaseOrderQuery(po_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(po_id);

                let condition = ``;

                if (po_vendor_id) {
                    if (condition == '') {
                        condition = `set po_vendor_id ='${po_vendor_id}' `
                    } else {
                        condition += `,po_vendor_id='${po_vendor_id}'`
                    }
                }
                if (po_vendor_name) {
                    if (condition == '') {
                        condition = `set po_vendor_name ='${po_vendor_name}' `
                    } else {
                        condition += `,po_vendor_name='${po_vendor_name}'`
                    }
                }
                if (po_delivery_addr_option) {
                    if (condition == '') {
                        condition = `set po_delivery_addr_option='${po_delivery_addr_option}' `
                    } else {
                        condition += `,po_delivery_addr_option='${po_delivery_addr_option}'`
                    }
                }
                if (po_delivery_customer_id) {
                    if (condition == '') {
                        condition = `set po_delivery_customer_id ='${po_delivery_customer_id}' `
                    } else {
                        condition += `,po_delivery_customer_id='${po_delivery_customer_id}'`
                    }
                }
                if (po_delivery_customer_name) {
                    if (condition == '') {
                        condition = `set po_delivery_customer_name ='${po_delivery_customer_name}' `
                    } else {
                        condition += `,po_delivery_customer_name='${po_delivery_customer_name}'`
                    }
                }
                if (po_delivery_address) {
                    if (condition == '') {
                        condition = `set po_delivery_address ='${po_delivery_address}' `
                    } else {
                        condition += `,po_delivery_address='${po_delivery_address}'`
                    }
                }
                if (po_order_id) {
                    if (condition == '') {
                        condition = `set po_order_id ='${po_order_id}' `
                    } else {
                        condition += `,po_order_id='${po_order_id}'`
                    }
                }
                if (po_reference) {
                    if (condition == '') {
                        condition = `set po_reference ='${po_reference}' `
                    } else {
                        condition += `,po_reference='${po_reference}'`
                    }
                }
                if (po_order_date) {
                    if (condition == '') {
                        condition = `set po_order_date ='${po_order_date}' `
                    } else {
                        condition += `,po_order_date='${po_order_date}'`
                    }
                }

                if (po_delivery_date) {
                    if (condition == '') {
                        condition = `set po_delivery_date ='${po_delivery_date}' `
                    } else {
                        condition += `,po_delivery_date='${po_delivery_date}'`
                    }
                }

                if (po_payment_terms) {
                    if (condition == '') {
                        condition = `set po_payment_terms ='${po_payment_terms}' `
                    } else {
                        condition += `,po_payment_terms='${po_payment_terms}'`
                    }
                }

                if (po_shipment_preference) {
                    if (condition == '') {
                        condition = `set po_shipment_preference ='${po_shipment_preference}' `
                    } else {
                        condition += `,po_shipment_preference='${po_shipment_preference}'`
                    }
                }

                if (po_customer_notes) {
                    if (condition == '') {
                        condition = `set po_customer_notes ='${po_customer_notes}' `
                    } else {
                        condition += `,po_customer_notes='${po_customer_notes}'`
                    }
                }

                if (po_discount) {
                    if (condition == '') {
                        condition = `set po_discount ='${po_discount}' `
                    } else {
                        condition += `,po_discount='${po_discount}'`
                    }
                }

                if (po_tds_tcs) {
                    if (condition == '') {
                        condition = `set po_tds_tcs ='${po_tds_tcs}' `
                    } else {
                        condition += `,po_tds_tcs='${po_tds_tcs}'`
                    }
                }

                if (po_tax) {
                    if (condition == '') {
                        condition = `set po_tax ='${po_tax}' `
                    } else {
                        condition += `,po_tax='${po_tax}'`
                    }
                }
                if (po_adjustment) {
                    if (condition == '') {
                        condition = `set po_adjustment ='${po_adjustment}' `
                    } else {
                        condition += `,po_adjustment='${po_adjustment}'`
                    }
                }

                if (po_total_amount) {
                    if (condition == '') {
                        condition = `set po_total_amount ='${po_total_amount}' `
                    } else {
                        condition += `,po_total_amount='${po_total_amount}'`
                    }
                }

                if (po_terms_condition) {
                    if (condition == '') {
                        condition = `set po_terms_condition ='${po_terms_condition}' `
                    } else {
                        condition += `,po_terms_condition='${po_terms_condition}'`
                    }
                }


                if (condition !== '') {
                    var EditPurchaseOrder = await model.ChangePurchaseOrder(condition, po_id, u_id)
                }
                if (EditPurchaseOrder.affectedRows > 0) {

                    if (purchase_order_items) {
                        let purchaseorderitems = [];

                        // Check if purchase_order_items is defined, not null, and not "undefined" or empty string before parsing
                        if (purchase_order_items && purchase_order_items !== "undefined" && purchase_order_items !== "") {
                            try {
                                purchaseorderitems = JSON.parse(purchase_order_items);
                            } catch (e) {
                                console.error("Error parsing purchase_order_items:", e);
                                // Handle the error, e.g., keep purchaseorderitems as an empty array
                                purchaseorderitems = [];
                            }
                        } else {
                            // If purchase_order_items is invalid, default to an empty array
                            purchaseorderitems = [];
                        }

                        console.log(purchaseorderitems);

                        // let with_id = [];
                        // let without_id = [];

                        for (const item of purchaseorderitems) {
                            if (item.is_id) {
                                // with_id.push(item);
                                await model.UpdatePurchaseOrderItem(item, item.is_id, po_id)

                            } else {
                                // without_id.push(item);
                                await model.InsertPurchaseOrderItem(po_id, item);
                            }
                        }


                    }

                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    console.log(files_ids, "files_ids");
                    if (files_ids.length > 0) {
                        let deletefiles = await model.DeleteFilesQuery(po_id, files_ids)
                    }


                    if (files.image) {
                        if (Array.isArray(files.image)) {

                            for (const file of files.image) {
                                var oldPath = file.filepath;
                                var newPath = process.cwd() + "/uploads/purchase_order_doc/" + file.originalFilename;
                                let rawData = fs.readFileSync(oldPath);
                                fs.writeFileSync(newPath, rawData);
                                var imagepath = ("/uploads/purchase_order_doc/" + file.originalFilename);
                                var Insertimages = await model.AddImagesQuery(po_id, imagepath)
                                console.log(Insertimages);
                                if (Insertimages.affectedRows == 0) {
                                    return res.send({
                                        result: false,
                                        message: "failed to add Purchase Order document"
                                    })
                                }

                            }
                        } else {
                            var oldPath = files.image.filepath;
                            var newPath = process.cwd() + "/uploads/purchase_order_doc/" + files.image.originalFilename
                            let rawData = fs.readFileSync(oldPath);
                            // console.log(oldPath, "qqq");

                            fs.writeFileSync(newPath, rawData)
                            var imagepath = "/uploads/purchase_order_doc/" + files.image.originalFilename
                            var Insertimages = await model.AddImagesQuery(po_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Purchase Order document"
                                })
                            }
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Purchase Order details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Purchase Order details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Purchase Order details does not exists"
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

