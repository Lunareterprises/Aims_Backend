var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddBillsQuery = async (user_id, pb_vendor_id, pb_vendor_name, pb_bill_id, pb_order_no, pb_date,
    pb_payment_terms, pb_subject, pb_discount, pb_tds_tcs, pb_tax, pb_adjustment, pb_total_amount, pb_notes, pb_payment_status) => {

    try {
        var Query = `INSERT INTO purchase_bills ( pb_user_id, pb_vendor_id, pb_vendor_name, pb_bill_id, pb_order_no,
         pb_date, pb_payment_terms, pb_subject, pb_discount, pb_tds_tcs, pb_tax, pb_adjustment, pb_total_amount, 
         pb_notes, pb_payment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, pb_vendor_id, pb_vendor_name, pb_bill_id, pb_order_no, pb_date, pb_payment_terms,
            pb_subject, pb_discount, pb_tds_tcs, pb_tax, pb_adjustment, pb_total_amount, pb_notes, pb_payment_status]);

        return data;
    } catch (error) {
        console.error("Error inserting purchase bills data:", error);
        throw new Error('Failed to add purchase bills');
    }
};


module.exports.InsertbillsItem = async (bills_id, el) => {
    var Query = `insert into items_sections(is_purchase_bills_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount , is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [bills_id, el.is_item_name, el.is_item_id, el.is_quantity, el.is_rate, el.is_discount, el.is_amount,]);
    return data;
};

module.exports.AddImagesQuery = async (bills_id, imagepath) => {
    var Query = `insert into purchase_documents (pd_bills_id,pd_file) values (?,?)`;
    var data = await query(Query, [bills_id, imagepath]);
    return data;
};