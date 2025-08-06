var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddSalesOrder = async (user_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value) => {
    let Query = `INSERT INTO sales_orders (so_user_id,so_customer_id,so_number,so_reference,so_order_date,so_shipment_date,so_payment_terms_id,so_delivery_method_id,so_salesperson_id,so_customer_notes,so_shipping_charge,so_adjustment,so_tds_tcs,so_tds_tcs_id,so_total_amount,so_terms_conditions,so_place_supply,so_subtotal,so_discount_type,so_discount_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    return await query(Query, [user_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value]);
};


module.exports.InsertSalesOrderItem = async (salesorder_id, item_id, soi_description, soi_quantity, soi_rate, soi_amount, so_discount_type, so_discount_value, soi_tax_id) => {
    let Query = `insert into sales_order_items(soi_item_id,soi_description,soi_quantity,soi_rate,soi_amount,soi_discount_type,soi_discount_value,soi_tax_id,soi_so_id) values (?,?,?,?,?,?,?,?,?)`;
    return await query(Query, [item_id, soi_description, soi_quantity, soi_rate, soi_amount, so_discount_type, so_discount_value, soi_tax_id, salesorder_id]);
};

module.exports.InsertFiles = async (salesorder_id, file) => {
    let Query = `insert into sales_documents (sd_sales_order_id,sd_file) values (?,?)`;
    return await query(Query, [salesorder_id, file]);
};

module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckPaymentTerm = async (so_payment_terms_id, user_id) => {
    let Query = `select * from payment_terms where pt_id=? and pt_user_id=?`
    return await query(Query, [so_payment_terms_id, user_id])
}

module.exports.CheckSalesPerson = async (so_salesperson_id, user_id) => {
    let Query = `select * from sales_person where id=? and createdBy=?`
    return await query(Query, [so_salesperson_id, user_id])
}

module.exports.CheckDeliveryMethodData = async (so_delivery_method_id, user_id) => {
    let Query = `select * from deliver_methods where dm_id=? and dm_user_id=?`
    return await query(Query, [so_delivery_method_id, user_id])
}

module.exports.CheckTdsTcs = async (so_tds_tcs_id, user_id) => {
    let Query = `select * from tcs_tds_tax where tt_id=? and tt_user_id=?`
    return await query(Query, [so_tds_tcs_id, user_id])
}

module.exports.CheckDeliveryMethodName = async (so_delivery_method, user_id) => {
    let Query = `select * from deliver_methods where dm_method=? and dm_user_id=?`
    return await query(Query, [so_delivery_method, user_id])
}

module.exports.CreateDeliveryMethod = async (so_delivery_method, user_id) => {
    let Query = `insert into deliver_methods (dm_method,dm_user_id) values(?,?)`
    return await query(Query, [so_delivery_method, user_id])
}

module.exports.CheckItem = async (item_id, user_id) => {
    let Query = `select * from items where i_id=? and i_user_id=?`
    return await query(Query, [item_id, user_id])
}

module.exports.CheckTax = async (tax_id, user_id) => {
    let Query = `select * from tax where tax_id=? and tax_user_id=?`
    return await query(Query, [tax_id, user_id])
}

module.exports.DeleteSalesOrder = async (salesorder_id, user_id) => {
    let Query = `delete from sales_orders where so_id=? and so_user_id=?`
    return await query(Query, [salesorder_id, user_id])
}