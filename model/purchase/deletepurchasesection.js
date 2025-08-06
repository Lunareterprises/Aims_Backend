var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.CheckExpensesQuery = async (expenses_id, user_id) => {
    var Query = `select * FROM expenses WHERE ep_id=? and ep_user_id=?`;
    var data = await query(Query, [expenses_id, user_id]);
    return data;
};
module.exports.RemoveExpensesQuery = async (expenses_id) => {
    var Query = `DELETE FROM expenses WHERE ep_id=?`;
    var data = await query(Query, [expenses_id]);
    return data;
};

module.exports.RemoveExpensesDocumentsQuery = async (expenses_id) => {
    var Query = `DELETE FROM purchase_documents WHERE pd_expense_id=?`;
    var data = await query(Query, [expenses_id]);
    return data;
};
//-----------------------------------//

module.exports.CheckVendorcontperson = async (vcp_id, user_id) => {
    var Query = `select * from vendor_contact_person where vcp_id = ?`;
    var data = await query(Query, [vcp_id, user_id]);
    return data;
};

module.exports.RemoveVendorcontperson = async (vcp_id) => {
    var Query = `DELETE FROM vendor_contact_person WHERE vcp_id =?`;
    var data = await query(Query, [vcp_id]);
    return data;
};

//-----------------------------------//

module.exports.Checkbills = async (bill_id, user_id) => {
    var Query = `select * from purchase_bills where pb_id = ? and pb_user_id =?`;
    var data = await query(Query, [bill_id, user_id]);
    return data;
};

module.exports.Removebills = async (bill_id) => {
    var Query = `DELETE FROM purchase_bills WHERE pb_id = ?`;
    var data = await query(Query, [bill_id]);
    return data;
};

module.exports.RemovebillsDoc = async (bill_id) => {
    var Query = `DELETE FROM purchase_documents WHERE pd_bills_id=?`;
    var data = await query(Query, [bill_id]);
    return data;
};

//-----------------------------------//

module.exports.Checkrecurringbills = async (recrring_bill_id, user_id) => {
    var Query = `select * FROM recurring_bills WHERE rb_id=? and rb_user_id=?`;
    var data = await query(Query, [recrring_bill_id, user_id]);
    return data;
};
module.exports.Removerecurringbills = async (recrring_bill_id) => {
    var Query = `DELETE FROM recurring_bills WHERE rb_id=?`;
    var data = await query(Query, [recrring_bill_id]);
    return data;
};

module.exports.RemovebillsItems = async (recrring_bill_id) => {
    var Query = `DELETE FROM items_sections WHERE is_recurring_bills_id=?`;
    var data = await query(Query, [recrring_bill_id]);
    return data;
};
//-----------------------------------//

module.exports.CheckRecurringExpenses = async (re_id, user_id) => {
    var Query = `select * from recurring_expenses where re_id  = ? and re_user_id =?`;
    var data = await query(Query, [re_id, user_id]);
    return data;
};

module.exports.RemoveRecurringExpenses = async (re_id) => {
    var Query = `DELETE FROM recurring_expenses WHERE re_id  =?`;
    var data = await query(Query, [re_id]);
    return data;
};

//-----------------------------------//

module.exports.CheckPurchaseOrderQuery = async (purchase_order_id, user_id) => {
    var Query = `select * FROM purchase_order WHERE po_id=? and po_user_id=?`;
    var data = await query(Query, [purchase_order_id, user_id]);
    return data;
};
module.exports.RemovePurchaseOrderQuery = async (purchase_order_id) => {
    var Query = `DELETE FROM purchase_order WHERE po_id=?`;
    var data = await query(Query, [purchase_order_id]);
    return data;
};
module.exports.RemovePurchaseOrderItemQuery = async (purchase_order_id) => {
    var Query = `DELETE FROM items_sections WHERE is_purchase_order=?`;
    var data = await query(Query, [purchase_order_id]);
    return data;
};
module.exports.RemovePurchaseOrderDocumentsQuery = async (purchase_order_id) => {
    var Query = `DELETE FROM purchase_documents WHERE pd_purchase_order_id=?`;
    var data = await query(Query, [purchase_order_id]);
    return data;
};
//-----------------------------------//

module.exports.Checkpurchaseorderitem = async (purchase_order_item_id) => {
    var Query = `select * from items_sections where is_id  = ? `;
    var data = await query(Query, [purchase_order_item_id]);
    return data;
};

module.exports.Removepurchaseorderitem = async (purchase_order_item_id) => {
    var Query = `DELETE FROM items_sections WHERE is_id  =?`;
    var data = await query(Query, [purchase_order_item_id]);
    return data;
};

//-----------------------------------//