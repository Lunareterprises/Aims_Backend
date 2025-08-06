var model = require("../../model/purchase/addrecurringexpenses");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddRecurringExpenses = async (req, res) => {
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
            var { re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date,
                re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
                re_vendor_name, re_notes, re_customer_id, re_customer_name } = fields;

            if ( !re_profile_name || !re_paid_through || !re_repeat_every || !re_amount) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let addrecurringExpenses = await model.AddRecurringExpensesQuery(u_id, re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date,
                re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
                re_vendor_name, re_notes, re_customer_id, re_customer_name);

            if (addrecurringExpenses.affectedRows > 0) {

                return res.send({
                    result: true,
                    message: "Recurring Expenses added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Recurring Expenses"
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