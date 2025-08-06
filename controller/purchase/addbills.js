var model = require("../../model/purchase/addbills");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddBills = async (req, res) => {
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
            var { pb_vendor_id, pb_vendor_name, pb_bill_id, pb_order_no, pb_date,
                pb_payment_terms, pb_subject, pb_discount, pb_tds_tcs, pb_tax, pb_adjustment, pb_total_amount,
                pb_notes, pb_payment_status, bills_items } = fields;

            if ( !pb_vendor_id || !pb_vendor_name || !pb_date || !pb_payment_status) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let addbills = await model.AddBillsQuery(u_id, pb_vendor_id, pb_vendor_name, pb_bill_id, pb_order_no, pb_date,
                pb_payment_terms, pb_subject, pb_discount, pb_tds_tcs, pb_tax, pb_adjustment, pb_total_amount,
                pb_notes, pb_payment_status);

            if (addbills.affectedRows > 0) {

                var bills_id = addbills.insertId
                console.log(bills_id, "cus_iddd");

                let billsitems = [];

                // Check if bills_items is defined, not null, and not "undefined" or empty string before parsing
                if (bills_items && bills_items !== "undefined" && bills_items !== "") {
                    try {
                        billsitems = JSON.parse(bills_items);
                    } catch (e) {
                        console.error("Error parsing bills_items:", e);
                        // Handle the error, e.g., keep billsitems as an empty array
                        billsitems = [];
                    }
                } else {
                    // If bills_items is invalid, default to empty array
                    billsitems = [];
                }

                // Now `billsitems` will be an empty array if input is invalid or couldn't be parsed

                console.log(billsitems, "so_item");

                for (const el of billsitems) {
                    await model.InsertbillsItem(bills_id, el);
                }


                if (files.image) {
                    console.log(files, "filesssimage");


                    if (Array.isArray(files.image)) {

                        for (const file of files.image) {
                            var oldPath = file.filepath;
                            var newPath = process.cwd() + "/uploads/bills_docs/" + file.originalFilename;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            var imagepath = ("/uploads/bills_docs/" + file.originalFilename);
                            var Insertimages = await model.AddImagesQuery(bills_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Purchase bills document"
                                })
                            }

                        }
                    } else {
                        var oldPath = files.image.filepath;
                        var newPath = process.cwd() + "/uploads/bills_docs/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        // console.log(oldPath, "qqq");

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/bills_docs/" + files.image.originalFilename
                        var Insertimages = await model.AddImagesQuery(bills_id, imagepath)
                        console.log(Insertimages);
                        if (Insertimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add Purchase bills document"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Purchase bills added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "Purchase bills added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Purchase bills"
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