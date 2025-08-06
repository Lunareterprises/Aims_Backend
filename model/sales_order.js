var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddSalesOrder = async (user_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value) => {
    let Query = `INSERT INTO sales_orders (so_user_id,so_customer_id,so_number,so_reference,so_order_date,so_shipment_date,so_payment_terms_id,so_delivery_method_id,so_salesperson_id,so_customer_notes,so_shipping_charge,so_adjustment,so_tds_tcs,so_tds_tcs_id,so_total_amount,so_terms_conditions,so_place_supply,so_subtotal,so_discount_type,so_discount_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    return await query(Query, [user_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value]);
};

module.exports.EditSalesOrder = async (salesorder_id, so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value) => {
    let Query = `update  sales_orders set so_customer_id=?,so_number=?,so_reference=?,so_order_date=?,so_shipment_date=?,so_payment_terms_id=?,so_delivery_method_id=?,so_salesperson_id=?,so_customer_notes=?,so_shipping_charge=?,so_adjustment=?,so_tds_tcs=?,so_tds_tcs_id=?,so_total_amount=?,so_terms_conditions=?,so_place_supply=?,so_subtotal=?,so_discount_type=?,so_discount_value=? where so_id=?`;
    return await query(Query, [so_customer_id, so_number, so_reference, so_order_date, so_shipment_date, so_payment_terms_id, so_delivery_method_id, so_salesperson_id, so_customer_notes, so_shipping_charges, so_adjustment, so_tds_tcs, so_tds_tcs_id, so_total_amount, so_terms_conditions, so_place_supply, so_subtotal, so_discount_type, so_discount_value, salesorder_id]);
};

module.exports.InsertSalesOrderItem = async (salesorder_id, item_id, soi_description, soi_quantity, soi_rate, soi_amount, soi_discount_type, soi_discount_value, soi_tax_id) => {
    let Query = `insert into sales_order_items(soi_item_id,soi_description,soi_quantity,soi_rate,soi_amount,soi_discount_type,soi_discount_value,soi_tax_id,soi_so_id) values (?,?,?,?,?,?,?,?,?)`;
    return await query(Query, [item_id, soi_description, soi_quantity, soi_rate, soi_amount, soi_discount_type, soi_discount_value, soi_tax_id, salesorder_id]);
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

module.exports.CheckSalesOrderItem = async (salesorder_id, sales_order_item_id) => {
    let Query = `select * from sales_order_items where soi_id=? and soi_so_id=?`
    return await query(Query, [sales_order_item_id, salesorder_id])
}

module.exports.UpdateSalesOrderItem = async (sales_order_item_id, soi_description, soi_quantity, soi_rate, soi_amount, soi_discount_type, soi_discount_value, soi_tax_id) => {
    let Query = `update  sales_order_items set soi_description=?,soi_quantity=?,soi_rate=?,soi_amount=?,soi_discount_type=?,soi_discount_value=?,soi_tax_id=? where soi_id`;
    return await query(Query, [soi_description, soi_quantity, soi_rate, soi_amount, soi_discount_type, soi_discount_value, soi_tax_id, sales_order_item_id]);
}


module.exports.ListAllSalesOrder = async (user_id) => {
    const Query = `
      SELECT 
        so.*, 
        
        -- Customer Info
        cu.cu_display_name AS customer_name,
        cu.cu_email AS customer_email,
        cu.cu_phone AS customer_phone,
  
        -- Sales Person Info
        sp.name AS salesperson_name,
        sp.email AS salesperson_email,
  
        -- Payment Terms Info
        pt.pt_term_name AS payment_term_name,
        pt.pt_total_days AS payment_term_total_days,
  
        -- Delivery Method Info
        dm.dm_method AS delivery_method_name,

        -- Tcs Tds Info
        tt.tt_name AS tcs_tds_name,
        tt.tt_rate AS tcs_tds_rate
  
      FROM sales_orders AS so
      LEFT JOIN customer AS cu ON so.so_customer_id = cu.cu_id
      LEFT JOIN sales_person AS sp ON so.so_salesperson_id = sp.id
      LEFT JOIN payment_terms AS pt ON so.so_payment_terms_id = pt.pt_id
      LEFT JOIN delivery_methods AS dm ON so.so_delivery_method_id = dm.dm_id
      LEFT JOIN tcs_tds_tax AS tt ON so.so_tds_tcs_id = tt.tt_id
      WHERE so.so_user_id = ?
    `;
    return await query(Query, [user_id]);
};



module.exports.CheckSalesOrder = async (salesorder_id, user_id) => {
    const Query = `
        SELECT 
            so.*,
            soi.soi_id,
            soi.soi_item_id,
            soi.soi_description,
            soi.soi_quantity,
            soi.soi_rate,
            soi.soi_amount,
            soi.soi_discount_type,
            soi.soi_discount_value,
            soi.soi_tax_id,
            sd.sd_id,
            sd.sd_file
        FROM sales_orders so
        LEFT JOIN sales_order_items soi ON soi.soi_so_id = so.so_id
        LEFT JOIN sales_documents sd ON sd.sd_sales_order_id = so.so_id
        WHERE so.so_user_id = ? AND so.so_id = ?
    `;

    const rows = await query(Query, [user_id, salesorder_id]);

    if (!rows.length) return [];

    // Grouping logic
    const salesOrder = {
        so_id: rows[0].so_id,
        so_user_id: rows[0].so_user_id,
        so_customer_id: rows[0].so_customer_id,
        so_number: rows[0].so_number,
        so_reference: rows[0].so_reference,
        so_order_date: rows[0].so_order_date,
        so_shipment_date: rows[0].so_shipment_date,
        so_payment_terms_id: rows[0].so_payment_terms_id,
        so_delivery_method_id: rows[0].so_delivery_method_id,
        so_salesperson_id: rows[0].so_salesperson_id,
        so_customer_notes: rows[0].so_customer_notes,
        so_shipping_charge: rows[0].so_shipping_charge,
        so_adjustment: rows[0].so_adjustment,
        so_tds_tcs: rows[0].so_tds_tcs,
        so_tds_tcs_id: rows[0].so_tds_tcs_id,
        so_total_amount: rows[0].so_total_amount,
        so_terms_conditions: rows[0].so_terms_conditions,
        so_status: rows[0].so_status,
        so_place_supply: rows[0].so_place_supply,
        so_subtotal: rows[0].so_subtotal,
        so_discount_type: rows[0].so_discount_type,
        so_discount_value: rows[0].so_discount_value,
        items: [],
        files: []
    };

    const itemSet = new Set();
    const docSet = new Set();

    for (const row of rows) {
        // Collect unique items
        if (row.soi_id && !itemSet.has(row.soi_id)) {
            salesOrder.items.push({
                soi_id: row.soi_id,
                soi_item_id: row.soi_item_id,
                soi_description: row.soi_description,
                soi_quantity: row.soi_quantity,
                soi_rate: row.soi_rate,
                soi_amount: row.soi_amount,
                soi_discount_type: row.soi_discount_type,
                soi_discount_value: row.soi_discount_value,
                soi_tax_id: row.soi_tax_id
            });
            itemSet.add(row.soi_id);
        }

        // Collect unique documents
        if (row.sd_id && !docSet.has(row.sd_id)) {
            salesOrder.files.push({
                sd_id: row.sd_id,
                sd_file_path: row.sd_file
            });
            docSet.add(row.sd_id);
        }
    }

    return [salesOrder];
};


module.exports.DeleteSalesOrderItem = async (salesorder_id, sales_order_item_id) => {
    let Query = `delete from sales_order_items where soi_id=? and soi_so_id=?`
    return await query(Query, [sales_order_item_id, salesorder_id])
}

module.exports.CheckSalesOrderDocument = async (salesorder_id, salesorder_document_id) => {
    let Query = `select * from sales_documents where sd_id=? and sd_sales_order_id=?`
    return await query(Query, [salesorder_document_id, salesorder_id])
}

module.exports.DeleteSalesOrderDocument = async (salesorder_id, salesorder_document_id) => {
    let Query = `delete from sales_documents where sd_id=? and sd_sales_order_id=?`
    return await query(Query, [salesorder_document_id, salesorder_id])
}