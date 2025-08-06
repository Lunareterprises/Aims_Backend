var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.AddExpenses = async (user_id, ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage, ep_odometer_start,
    ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through, ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id,
    ep_customer_name, ep_projects, ep_mark_up_by) => {

    try {
        // Define SQL query with placeholders
        const Query = `INSERT INTO expenses (ep_user_id, ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage, 
            ep_odometer_start, ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through, 
            ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id, ep_customer_name, ep_projects, ep_mark_up_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

        const data = await query(Query, [
            user_id, ep_date, ep_employee_id, ep_employee_name, ep_expense_account, ep_calc_mileage,
            ep_odometer_start, ep_odometer_end, ep_distance, ep_currency, ep_amount, ep_paid_through,
            ep_vendor_id, ep_vendor_name, ep_invoice, ep_notes, ep_customer_id, ep_customer_name,
            ep_projects, ep_mark_up_by]);

        return data;

    } catch (error) {
        console.error("Error inserting expenses data:", error.stack); // Log the error stack for debugging
        throw new Error('Failed to add expenses');
    }
};



module.exports.AddImagesQuery = async (expenses_id, imagepath) => {
    var Query = `insert into purchase_documents (pd_expense_id,pd_file) values (?,?)`;
    var data = await query(Query, [expenses_id, imagepath]);
    return data;
};