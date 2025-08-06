var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddRecurringBillsQuery = async (user_id, rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
    rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
    rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes) => {

    try {
        var Query = `INSERT INTO recurring_bills (rb_user_id, rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
                rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
                rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
            rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
            rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes]);

        return data;
    } catch (error) {
        console.error("Error inserting recurring bills data:", error);
        throw new Error('Failed to add recurring bills');
    }
};

module.exports.InsertRecurringbillsItem = async (bills_id, el) => {
    var Query = `insert into items_sections(is_recurring_bills_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount , is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [bills_id, el.is_item_name, el.is_item_id, el.is_quantity, el.is_rate, el.is_discount, el.is_amount,]);
    return data;
};
