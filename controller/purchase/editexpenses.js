var model = require('../../model//purchase/editexpenses')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditExpenses = async (req, res) => {
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

            var { ep_id, ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage, ep_odometer_start,
                ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through, ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id,
                ep_customer_name, ep_projects, ep_mark_up_by } = fields;

            if (!ep_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckExpensesQuery(ep_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(ep_id);

                let condition = ``;
                if (ep_date) {
                    if (condition == '') {
                        condition = `set ep_date ='${ep_date}' `
                    } else {
                        condition += `,ep_date='${ep_date}'`
                    }
                }
                if (ep_employee_id) {
                    if (condition == '') {
                        condition = `set ep_employee_id ='${ep_employee_id}' `
                    } else {
                        condition += `,ep_employee_id='${ep_employee_id}'`
                    }
                }
                if (ep_employee_name) {
                    if (condition == '') {
                        condition = `set ep_employee_name='${ep_employee_name}' `
                    } else {
                        condition += `,ep_employee_name='${ep_employee_name}'`
                    }
                }
                if (ep_expense_account) {
                    if (condition == '') {
                        condition = `set ep_expense_account ='${ep_expense_account}' `
                    } else {
                        condition += `,ep_expense_account='${ep_expense_account}'`
                    }
                }
                if (ep_calc_mileage) {
                    if (condition == '') {
                        condition = `set ep_calc_mileage ='${ep_calc_mileage}' `
                    } else {
                        condition += `,ep_calc_mileage='${ep_calc_mileage}'`
                    }
                }
                if (ep_odometer_start) {
                    if (condition == '') {
                        condition = `set ep_odometer_start ='${ep_odometer_start}' `
                    } else {
                        condition += `,ep_odometer_start='${ep_odometer_start}'`
                    }
                }
                if (ep_odometer_end) {
                    if (condition == '') {
                        condition = `set ep_odometer_end ='${ep_odometer_end}' `
                    } else {
                        condition += `,ep_odometer_end='${ep_odometer_end}'`
                    }
                }
                if (ep_distance) {
                    if (condition == '') {
                        condition = `set ep_distance ='${ep_distance}' `
                    } else {
                        condition += `,ep_distance='${ep_distance}'`
                    }
                }
                if (ep_currency) {
                    if (condition == '') {
                        condition = `set ep_currency ='${ep_currency}' `
                    } else {
                        condition += `,ep_currency='${ep_currency}'`
                    }
                }
                if (ep_amount) {
                    if (condition == '') {
                        condition = `set ep_amount ='${ep_amount}' `
                    } else {
                        condition += `,ep_amount='${ep_amount}'`
                    }
                }
                if (ep_paid_through) {
                    if (condition == '') {
                        condition = `set ep_paid_through ='${ep_paid_through}' `
                    } else {
                        condition += `,ep_paid_through='${ep_paid_through}'`
                    }
                }
                if (ep_vendor_id) {
                    if (condition == '') {
                        condition = `set ep_vendor_id ='${ep_vendor_id}' `
                    } else {
                        condition += `,ep_vendor_id='${ep_vendor_id}'`
                    }
                }
                if (ep_vendor_name) {
                    if (condition == '') {
                        condition = `set ep_vendor_name ='${ep_vendor_name}' `
                    } else {
                        condition += `,ep_vendor_name='${ep_vendor_name}'`
                    }
                }

                if (ep_invoice) {
                    if (condition == '') {
                        condition = `set ep_invoice ='${ep_invoice}' `
                    } else {
                        condition += `,ep_invoice='${ep_invoice}'`
                    }
                }
                if (ep_notes) {
                    if (condition == '') {
                        condition = `set ep_notes ='${ep_notes}' `
                    } else {
                        condition += `,ep_notes='${ep_notes}'`
                    }
                }
                if (ep_customer_id) {
                    if (condition == '') {
                        condition = `set ep_customer_id ='${ep_customer_id}' `
                    } else {
                        condition += `,ep_customer_id='${ep_customer_id}'`
                    }
                }
                if (ep_customer_name) {
                    if (condition == '') {
                        condition = `set ep_customer_name ='${ep_customer_name}' `
                    } else {
                        condition += `,ep_customer_name='${ep_customer_name}'`
                    }
                }
                if (ep_projects) {
                    if (condition == '') {
                        condition = `set ep_projects ='${ep_projects}' `
                    } else {
                        condition += `,ep_projects='${ep_projects}'`
                    }
                }
                if (ep_mark_up_by) {
                    if (condition == '') {
                        condition = `set ep_mark_up_by ='${ep_mark_up_by}' `
                    } else {
                        condition += `,ep_mark_up_by='${ep_mark_up_by}'`
                    }
                }



                if (condition !== '') {
                    var EditExpenses = await model.ChangeExpenses(condition, ep_id, u_id)
                }
                if (EditExpenses.affectedRows > 0) {



                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    console.log(files_ids, "files_ids");
                    if (files_ids.length > 0) {

                        let deletefiles = await model.DeleteFilesQuery(ep_id, files_ids)
                    }

                    if (files.image) {
                        if (Array.isArray(files.image)) {

                            for (const file of files.image) {
                                var oldPath = file.filepath;
                                var newPath = process.cwd() + "/uploads/expenses_docs/" + file.originalFilename;
                                let rawData = fs.readFileSync(oldPath);
                                fs.writeFileSync(newPath, rawData);
                                var imagepath = ("/uploads/expenses_docs/" + file.originalFilename);
                                var Insertimages = await model.AddImagesQuery(ep_id, imagepath)
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
                            var Insertimages = await model.AddImagesQuery(ep_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Expenses document"
                                })
                            }
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Expenses details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Expenses details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Expenses details does not exists"
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

