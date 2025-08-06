var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CreateDeliveryChallan = async (user_id, customer_id, challan_number, reference, date, type, customer_notes, adjustment, total, subtotal, discount, tax_rate, tax_type, shipping_charge) => {
    let Query = `insert into delivery_challans (dc_user_id,dc_customer_id,dc_delivery_challan_id,dc_reference,dc_date,dc_type,dc_customer_notes,dc_adjustment,dc_total,dc_subtotal,dc_discount,dc_tax_rate,dc_tax_type,dc_shipping_charge) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [user_id, customer_id, challan_number, reference, date, type, customer_notes, adjustment, total, subtotal, discount, tax_rate, tax_type, shipping_charge])
}

module.exports.InsertItems = async (item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount, delivery_challan_id) => {
    let Query = `insert into items_sections (is_delivery_challan_id,is_item_id,is_quantity,is_rate,is_discount_value,is_amount,is_tax_id,is_discount_type,is_description) values(?,?,?,?,?,?,?,?,?)`
    return await query(Query, [delivery_challan_id, item_id, quantity, rate, discount_value, amount, tax_id, discount_type, description])
}

module.exports.InsertFiles = async (filepath, delivery_challan_id) => {
    let Query = `insert into sales_documents (sd_delivery_challan_id,sd_file) values(?,?)`
    return await query(Query, [delivery_challan_id, filepath])
}

module.exports.CheckDeliverChallan = async (user_id, delivery_challan_id) => {
    const Query = `
      SELECT dc.*, 
             isec.*, 
             sd.*
      FROM delivery_challans dc
      LEFT JOIN items_sections isec 
        ON isec.is_delivery_challans_id = dc.dc_id
      LEFT JOIN sales_documents sd 
        ON sd.sd_delivery_challan_id = dc.dc_id
      WHERE dc.dc_id = ? AND dc.dc_user_id = ?
    `;

    const data = await query(Query, [delivery_challan_id, user_id]);

    const challanMap = new Map();

    for (const row of data) {
        const challanId = row.dc_id;

        if (!challanMap.has(challanId)) {
            challanMap.set(challanId, {
                dc_id: row.dc_id,
                dc_user_id: row.dc_user_id,
                dc_customer_id: row.dc_customer_id,
                dc_delivery_challan_id: row.dc_delivery_challan_id,
                dc_reference: row.dc_reference,
                dc_date: row.dc_date,
                dc_type: row.dc_type,
                dc_customer_notes: row.dc_customer_notes,
                dc_adjustment: row.dc_adjustment,
                dc_status: row.dc_status,
                dc_total: row.dc_total,
                dc_subtotal: row.dc_subtotal,
                dc_discount: row.dc_discount,
                dc_tax_rate: row.dc_tax_rate,
                dc_tax_type: row.dc_tax_type,
                dc_shipping_charge: row.dc_shipping_charge,
                items: [],
                documents: []
            });
        }

        const challan = challanMap.get(challanId);

        if (row.is_id) {
            challan.items.push({
                is_id: row.is_id,
                is_sales_order_id: row.is_sales_order_id,
                is_purchase_order: row.is_purchase_order,
                is_delivery_challans_id: row.is_delivery_challans_id,
                is_purchase_bills_id: row.is_purchase_bills_id,
                is_invoice_id: row.is_invoice_id,
                is_recurring_bills_id: row.is_recurring_bills_id,
                is_item_id: row.is_item_id,
                is_quantity: row.is_quantity,
                is_rate: row.is_rate,
                is_discount_value: row.is_discount_value,
                is_amount: row.is_amount,
                is_status: row.is_status,
                is_tax_id: row.is_tax_id,
                is_discount_type: row.is_discount_type,
                is_description: row.is_description,
            });
        }

        if (row.sd_id) {
            challan.documents.push({
                sd_id: row.sd_id,
                sd_sales_order_id: row.sd_sales_order_id,
                sd_customer_id: row.sd_customer_id,
                sd_delivery_challan_id: row.sd_delivery_challan_id,
                sd_file: row.sd_file,
                sd_status: row.sd_status,
                sd_quote_id: row.sd_quote_id,
            });
        }
    }

    return Array.from(challanMap.values());
};



module.exports.EditDeliveryChallan = async (delivery_challan_id, customer_id, reference, date, type, customer_notes, adjustment, total, subtotal, discount, tax_rate, tax_type, shipping_charge, dc_id) => {
    let Query = `update delivery_challans set dc_customer_id=?,dc_delivery_challan_id=?,dc_reference=?,dc_date=?,dc_type=?,dc_customer_notes=?,dc_adjustment=?,dc_total=?,dc_subtotal=?,dc_discount=?,dc_tax_rate=?,dc_tax_type=?,dc_shipping_charge=? where dc_id=?`
    return await query(Query, [customer_id, delivery_challan_id, reference, date, type, customer_notes, adjustment, total, subtotal, discount, tax_rate, tax_type, shipping_charge, dc_id])
}

module.exports.UpdateItems = async (item_id, description, quantity, rate, discount_value, discount_type, tax_id, amount, is_id) => {
    let Query = `update items_sections set is_item_id=?,is_quantity=?,is_rate=?,is_discount_value=?,is_amount=?,is_tax_id=?,is_discount_type=?,is_description=? where is_id=?`
    return await query(Query, [item_id, quantity, rate, discount_value, amount, tax_id, discount_type, description, is_id])
}

module.exports.CheckItems = async (is_id, delivery_challan_id) => {
    let Query = `select * from items_sections where is_id=? and is_delivery_challans_id=?`
    return await query(Query, [is_id, delivery_challan_id])
}

module.exports.ListAllDeliveryChallan = async (user_id) => {
    const Query = `
        SELECT dc.*, c.*
        FROM delivery_challans dc
        JOIN customer c ON c.cu_id = dc.dc_customer_id
        WHERE dc.dc_user_id = ?
    `;
    return await query(Query, [user_id]);
}


module.exports.DeleteDeliveryChallanItem = async (delivery_challan_id, item_id) => {
    let Query = `delete from items_sections where is_id=? and is_delivery_challans_id=?`
    return await query(Query, [item_id, delivery_challan_id])
}

module.exports.CheckDeliveryDocument = async (delivery_challan_id, document_id) => {
    let Query = `select * from sales_documents where sd_id=? and sd_delivery_challan_id=?`
    return await query(Query, [document_id, delivery_challan_id])
}

module.exports.DeleteDeliveryDocument = async (delivery_challan_id, document_id) => {
    let Query = `delete from sales_documents where sd_id=? and sd_delivery_challan_id=?`
    return await query(Query, [document_id, delivery_challan_id])
}

module.exports.DeleteDeliveryChallan = async (user_id, delivery_challan_id) => {
    let Query = `delete from delivery_challans where dc_user_id=? adn dc_id=?`
    return await query(Query, [user_id, delivery_challan_id])
}