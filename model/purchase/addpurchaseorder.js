var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddPurchaseOrder = async (user_id, po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
    po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
    po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment, po_total_amount, po_terms_condition) => {

    try {
        var Query = `INSERT INTO purchase_order (po_user_id, po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
                po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
                po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment,po_total_amount, po_terms_condition)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, po_vendor_id, po_vendor_name, po_delivery_addr_option, po_delivery_customer_id, po_delivery_customer_name,
            po_delivery_address, po_order_id, po_reference, po_order_date, po_delivery_date, po_payment_terms,
            po_shipment_preference, po_customer_notes, po_discount, po_tds_tcs, po_tax, po_adjustment, po_total_amount, po_terms_condition]);

        return data;
    } catch (error) {
        console.error("Error inserting purchase orders data:", error);
        throw new Error('Failed to add purchase orders');
    }
};


module.exports.InsertPurchaseOrderItem = async (PurchaseOrder_id, el) => {
    var Query = `insert into items_sections(is_purchase_order, is_item_name, is_item_id,is_item_account_id,is_item_account_name,is_quantity, is_rate, is_discount , is_amount) values (?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [PurchaseOrder_id, el.is_item_name, el.is_item_id, el.is_item_account_id, el.is_item_account_name, el.is_quantity, el.is_rate, el.is_discount, el.is_amount,]);
    return data;
};

module.exports.AddImagesQuery = async (PurchaseOrder_id, imagepath) => {
    var Query = `insert into purchase_documents (pd_purchase_order_id,pd_file) values (?,?)`;
    var data = await query(Query, [PurchaseOrder_id, imagepath]);
    return data;
};