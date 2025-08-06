var model = require("../../model/purchase/addpurchaseorder");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddPurchaseOrder = async (req, res) => {
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
            var { po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
                po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
                po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment, po_total_amount, po_terms_condition, purchase_order_items } = fields;

            if (!po_vendor_id || !po_vendor_name || !po_delivery_date || !po_delivery_address) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let addPurchaseOrder = await model.AddPurchaseOrder(u_id, po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
                po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
                po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment, po_total_amount, po_terms_condition);


            if (addPurchaseOrder.affectedRows > 0) {

                var PurchaseOrder_id = addPurchaseOrder.insertId
                console.log(PurchaseOrder_id, "cus_iddd");

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
                    // If purchase_order_items is invalid, default to empty array
                    purchaseorderitems = [];
                }

                // Now `purchaseorderitems` will be an empty array if input is invalid or couldn't be parsed

                console.log(purchaseorderitems, "so_item");

                for (const el of purchaseorderitems) {
                    await model.InsertPurchaseOrderItem(PurchaseOrder_id, el);
                }


                if (files.image) {
                    console.log(files, "filesssimage");


                    if (Array.isArray(files.image)) {

                        for (const file of files.image) {
                            var oldPath = file.filepath;
                            var newPath = process.cwd() + "/uploads/purchase_order_doc/" + file.originalFilename;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            var imagepath = ("/uploads/purchase_order_doc/" + file.originalFilename);
                            var Insertimages = await model.AddImagesQuery(PurchaseOrder_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add purchase order document"
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
                        var Insertimages = await model.AddImagesQuery(PurchaseOrder_id, imagepath)
                        console.log(Insertimages);
                        if (Insertimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add purchase order document"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "purchase order added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "purchase order added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add purchase order"
                })
            }

        })
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
}; 