var model = require("../../model/purchase/addrecurringbills");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddRecurringBills = async (req, res) => {
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
            var { rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
                rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
                rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes, recurring_bills_items } = fields;

            if ( !rb_vendor_name || !rb_vendor_id || !rb_repeat_every) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let addrecurringbills = await model.AddRecurringBillsQuery(u_id, rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
                rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
                rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes);

            if (addrecurringbills.affectedRows > 0) {

                var bills_id = addrecurringbills.insertId
                console.log(bills_id, "cus_iddd");

                let recurringbillsitems = [];

                // Check if recurring_bills_items is defined, not null, and not "undefined" or empty string before parsing
                if (recurring_bills_items && recurring_bills_items !== "undefined" && recurring_bills_items !== "") {
                    try {
                        recurringbillsitems = JSON.parse(recurring_bills_items);
                    } catch (e) {
                        console.error("Error parsing recurring_bills_items:", e);
                        // Handle the error, e.g., keep recurringbillsitems as an empty array
                        recurringbillsitems = [];
                    }
                } else {
                    // If recurring_bills_items is invalid, default to empty array
                    recurringbillsitems = [];
                }

                // Now `recurringbillsitems` will be an empty array if input is invalid or couldn't be parsed

                console.log(recurringbillsitems, "so_item");

                for (const el of recurringbillsitems) {
                    await model.InsertRecurringbillsItem(bills_id, el);
                }


                // if (files.image) {
                //     console.log(files, "filesssimage");


                //     if (Array.isArray(files.image)) {

                //         for (const file of files.image) {
                //             var oldPath = file.filepath;
                //             var newPath = process.cwd() + "/uploads/bills_docs/" + file.originalFilename;
                //             let rawData = fs.readFileSync(oldPath);
                //             fs.writeFileSync(newPath, rawData);
                //             var imagepath = ("/uploads/bills_docs/" + file.originalFilename);
                //             var Insertimages = await model.AddImagesQuery(bills_id, imagepath)
                //             console.log(Insertimages);
                //             if (Insertimages.affectedRows == 0) {
                //                 return res.send({
                //                     result: false,
                //                     message: "failed to add Recurring bills document"
                //                 })
                //             }

                //         }
                //     } else {
                //         var oldPath = files.image.filepath;
                //         var newPath = process.cwd() + "/uploads/bills_docs/" + files.image.originalFilename
                //         let rawData = fs.readFileSync(oldPath);
                //         // console.log(oldPath, "qqq");

                //         fs.writeFileSync(newPath, rawData)
                //         var imagepath = "/uploads/bills_docs/" + files.image.originalFilename
                //         var Insertimages = await model.AddImagesQuery(bills_id, imagepath)
                //         console.log(Insertimages);
                //         if (Insertimages.affectedRows == 0) {
                //             return res.send({
                //                 result: false,
                //                 message: "failed to add Recurring bills document"
                //             })
                //         }
                //     }
                //     return res.send({
                //         result: true,
                //         message: "Recurring bills added successfully"
                //     })

                // }
                return res.send({
                    result: true,
                    message: "Recurring bills added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Recurring bills"
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