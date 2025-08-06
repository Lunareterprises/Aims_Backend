var model = require("../../model/purchase/addexpenses");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddExpenses = async (req, res) => {
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
            var { ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage, ep_odometer_start,
                ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through, ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id,
                ep_customer_name, ep_projects, ep_mark_up_by } = fields;
            if (!ep_date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let addexpenses = await model.AddExpenses(u_id, ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage, ep_odometer_start,
                ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through, ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id,
                ep_customer_name, ep_projects, ep_mark_up_by);


            if (addexpenses.affectedRows > 0) {

                var expenses_id = addexpenses.insertId
                console.log(expenses_id, "cus_iddd");


                if (files.image) {
                    console.log(files, "filesssimage");


                    if (Array.isArray(files.image)) {

                        for (const file of files.image) {
                            var oldPath = file.filepath;
                            var newPath = process.cwd() + "/uploads/expenses_docs/" + file.originalFilename;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            var imagepath = ("/uploads/expenses_docs/" + file.originalFilename);
                            var Insertimages = await model.AddImagesQuery(expenses_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Expenses document"
                                })
                            }

                        }
                    } else {
                        var oldPath = files.image.filepath;
                        var newPath = process.cwd() + "/uploads/expenses_docs/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        // console.log(oldPath, "qqq");

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/expenses_docs/" + files.image.originalFilename
                        var Insertimages = await model.AddImagesQuery(expenses_id, imagepath)
                        console.log(Insertimages);
                        if (Insertimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add Expenses document"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Expenses added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "Expenses added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Expenses"
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