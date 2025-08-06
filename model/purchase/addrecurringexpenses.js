var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddRecurringExpensesQuery = async (user_id, re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date,
    re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
    re_vendor_name, re_notes, re_customer_id, re_customer_name) => {

    try {
        var Query = `INSERT INTO recurring_expenses (re_user_id,re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date, 
                re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
                 re_vendor_name, re_notes, re_customer_id, re_customer_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, re_profile_name, re_employee_id, re_employee_name, re_repeat_every, re_start_date,
            re_end_date, re_expiry, re_expense_account, re_amount, re_paid_through, re_vendor_id,
            re_vendor_name, re_notes, re_customer_id, re_customer_name]);

        return data;
    } catch (error) {
        console.error("Error inserting recurring Expenses data:", error);
        throw new Error('Failed to add recurring Expenses');
    }
};

