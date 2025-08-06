var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CreatePaymentReceived = async (customer_id, amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes, user_id) => {
    let Query = `insert into payments_received (pr_user_id,pr_customer_id,pr_amount_received,pr_bank_charges,pr_payment_date,pr_payment_number,pr_payment_mode,pr_deposit_to,pr_reference,pr_total,pr_amount_used,pr_amount_refunded,pr_amount_excess,pr_notes) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
    return await query(Query, [user_id, customer_id, amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes])
}

module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckInvoice = async (invoice_id, customer_id, user_id) => {
    let Query = `select * from invoice where i_customer_id=? and i_user_id=? and i_id=?`
    return await query(Query, [customer_id, user_id, invoice_id])
}

module.exports.InsertPaymentReceivedItems = async (invoice_id, amount, payment_received_id) => {
    let Query = `insert into payments_received_items (pri_invoice_id,pri_amount,pri_payment_received_id) values(?,?,?)`
    return await query(Query, [invoice_id, amount, payment_received_id])
}

module.exports.InsertFiles = async (filePath, payment_received_id) => {
    let Query = `insert into sales_documents (sd_file,sd_payment_received_id) values(?,?)`
    return await query(Query, [filePath, payment_received_id])
}

module.exports.CheckPaymentReceived = async (payment_received_id, user_id) => {
    const Query = `
        SELECT 
            pr.*, 
            pri.*, 
            sd.*
        FROM payments_received pr
        LEFT JOIN payments_received_items pri 
            ON pri.pri_payment_received_id = pr.pr_id
        LEFT JOIN sales_documents sd 
            ON sd.sd_payment_received_id = pr.pr_id
        WHERE pr.pr_id = ? AND pr.pr_user_id = ?
    `;
    return await query(Query, [payment_received_id, user_id]);
};

module.exports.EditPaymentReceived = async (amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes, payment_received_id) => {
    let Query = `update payments_received set pr_amount_received=?,pr_bank_charges=?,pr_payment_date=?,pr_payment_number=?,pr_payment_mode=?,pr_deposit_to=?,pr_reference=?,pr_total=?,pr_amount_used=?,pr_amount_refunded=?,pr_amount_excess=?,pr_notes=? where pr_id=?`
    return await query(Query, [amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes, payment_received_id])
}

module.exports.EditPaymentReceivedItems = async (payment_received_item_id, amount) => {
    let Query = `update payments_received_items set pri_amount=? where pri_id=?`
    return await query(Query, [amount, payment_received_item_id])
}

module.exports.CheckPaymentReceivedItem = async (pri_id, payment_received_id) => {
    let Query = `select * from payments_received_items where pri_id=? and pri_payment_received_id=?`
    return await query(Query, [pri_id, payment_received_id])
}

module.exports.ListAllPaymentReceived = async (user_id) => {
    let Query = `select * from payments_received where pr_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeletePaymentReceivedItem = async (pri_id, payment_received_id) => {
    let Query = `delete from payments_received_items where pri_id=? and pri_payment_received_id=?`
    return await query(Query, [pri_id, payment_received_id])
}

module.exports.CheckPaymentDocument = async (payment_received_id, document_id) => {
    let Query = `select * from sales_documents where sd_id=? and sd_payment_received_id=?`
    return await query(Query, [document_id, payment_received_id])
}

module.exports.DeletePaymentReceivedDocument = async (payment_received_id, document_id) => {
    let Query = `delete from sales_documents where sd_id=? and sd_payment_received_id=?`
    return await query(Query, [document_id, payment_received_id])
}

module.exports.DeletePaymentReceived = async (payment_received_id, user_id) => {
    let Query = `delete from payments_received where pr_id=? and pr_user_id=?`
    return await query(Query, [payment_received_id, user_id])
}