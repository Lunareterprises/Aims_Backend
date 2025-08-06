var model = require('../../model/purchase/editrecurringexpenses')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditRecurringExpenses = async (req, res) => {
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
            
            var { re_id, re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date,
                re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
                re_vendor_name, re_notes, re_customer_id, re_customer_name } = fields;

            if (!re_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckRecurringExpensesQuery(re_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(re_id);

                let condition = ``;

                if (re_profile_name) {
                    if (condition == '') {
                        condition = `set re_profile_name ='${re_profile_name}' `
                    } else {
                        condition += `,re_profile_name='${re_profile_name}'`
                    }
                }
                if (re_employee_id) {
                    if (condition == '') {
                        condition = `set re_employee_id ='${re_employee_id}' `
                    } else {
                        condition += `,re_employee_id='${re_employee_id}'`
                    }
                }
                if (re_employee_name) {
                    if (condition == '') {
                        condition = `set re_employee_name='${re_employee_name}' `
                    } else {
                        condition += `,re_employee_name='${re_employee_name}'`
                    }
                }
                if (re_repeat_every) {
                    if (condition == '') {
                        condition = `set re_repeat_every ='${re_repeat_every}' `
                    } else {
                        condition += `,re_repeat_every='${re_repeat_every}'`
                    }
                }
                if (re_start_date) {
                    if (condition == '') {
                        condition = `set re_start_date ='${re_start_date}' `
                    } else {
                        condition += `,re_start_date='${re_start_date}'`
                    }
                }
                if (re_end_date) {
                    if (condition == '') {
                        condition = `set re_end_date ='${re_end_date}' `
                    } else {
                        condition += `,re_end_date='${re_end_date}'`
                    }
                }
                if (re_expiry) {
                    if (condition == '') {
                        condition = `set re_expiry ='${re_expiry}' `
                    } else {
                        condition += `,re_expiry='${re_expiry}'`
                    }
                }
                if (re_expense_account) {
                    if (condition == '') {
                        condition = `set re_expense_account ='${re_expense_account}' `
                    } else {
                        condition += `,re_expense_account='${re_expense_account}'`
                    }
                }
                if (re_amount) {
                    if (condition == '') {
                        condition = `set re_amount ='${re_amount}' `
                    } else {
                        condition += `,re_amount='${re_amount}'`
                    }
                }
                if (re_paid_through) {
                    if (condition == '') {
                        condition = `set re_paid_through ='${re_paid_through}' `
                    } else {
                        condition += `,re_paid_through='${re_paid_through}'`
                    }
                }
                if (re_vendor_id) {
                    if (condition == '') {
                        condition = `set re_vendor_id ='${re_vendor_id}' `
                    } else {
                        condition += `,re_vendor_id='${re_vendor_id}'`
                    }
                }
                if (re_vendor_name) {
                    if (condition == '') {
                        condition = `set re_vendor_name ='${re_vendor_name}' `
                    } else {
                        condition += `,re_vendor_name='${re_vendor_name}'`
                    }
                }
                if (re_notes) {
                    if (condition == '') {
                        condition = `set re_notes ='${re_notes}' `
                    } else {
                        condition += `,re_notes='${re_notes}'`
                    }
                }
                if (re_customer_id) {
                    if (condition == '') {
                        condition = `set re_customer_id ='${re_customer_id}' `
                    } else {
                        condition += `,re_customer_id='${re_customer_id}'`
                    }
                }
                if (re_customer_name) {
                    if (condition == '') {
                        condition = `set re_customer_name ='${re_customer_name}' `
                    } else {
                        condition += `,re_customer_name='${re_customer_name}'`
                    }
                }



                if (condition !== '') {
                    var EditRecurringExpenses = await model.ChangeRecurringExpenses(condition, re_id, u_id)
                }
                if (EditRecurringExpenses.affectedRows > 0) {
               
                    return res.send({
                        result: true,
                        message: "Recurring Expenses details updated successfully"
                    })

                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Recurring Expenses details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Recurring Expenses details does not exists"
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

