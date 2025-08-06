var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckSlip = async (package_slip, user_id) => {
    let Query = `select * from packages where p_user_id=? and p_package_slip=?`
    return await query(Query, [user_id, package_slip])
}

module.exports.CheckSalesOrderItems = async (salesorder_item_id, salesorder_id) => {
    let Query = `select * from sales_order_items where soi_so_id=? and soi_id=?`
    return await query(Query, [salesorder_id, salesorder_item_id])
}

module.exports.CheckSalesOrder = async (salesorder_id, user_id, customer_id) => {
    let Query = `select * from sales_orders where so_id=? and so_user_id=?`
    let values = [salesorder_id, user_id]
    if (customer_id) {
        Query += ` and so_customer_id=?`
        values.push(customer_id)
    }
    return await query(Query, values)
}

module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CreatePackage = async (package_slip, date, salesorder_id, user_id, internal_notes) => {
    let Query = `insert into packages (p_package_slip,p_date,p_sales_order_id,p_user_id,p_internal_notes) values(?,?,?,?,?)`
    return await query(Query, [package_slip, date, salesorder_id, user_id, internal_notes])
}

module.exports.InsertPackageItems = async (salesorder_item_id, ordered, packed, quantity_left, package_id) => {
    let Query = `insert into package_items (pi_soi_id,pi_ordered,pi_packed,pi_quantity_left,pi_p_id) values(?,?,?,?,?)`
    return await query(Query, [salesorder_item_id, ordered, packed, quantity_left, package_id])
}

module.exports.DeletePackage = async (package_id, user_id) => {
    let Query = `delete from packages where p_id=? and p_user_id=?`
    return await query(Query, [package_id, user_id])
}

module.exports.CheckPackage = async (package_id, user_id, salesorder_id) => {
    const Query = `
        SELECT 
            p.*, 
            pi.pi_id, 
            pi.pi_soi_id, 
            pi.pi_ordered, 
            pi.pi_packed, 
            pi.pi_quantity_left, 
            pi.pi_p_id
        FROM packages p
        LEFT JOIN package_items pi ON pi.pi_p_id = p.p_id
        WHERE p.p_id = ? AND p.p_user_id = ? AND p.p_sales_order_id = ?
    `;

    const results = await query(Query, [package_id, user_id, salesorder_id]);

    if (results.length === 0) return null;

    // Extract base package
    const {
        p_id, p_package_slip, p_date, p_sales_order_id,
        p_user_id, p_internal_notes, p_created_at, p_updated_at
    } = results[0];

    // Group all package_items
    const package_items = results.map(row => ({
        pi_id: row.pi_id,
        pi_soi_id: row.pi_soi_id,
        pi_ordered: row.pi_ordered,
        pi_packed: row.pi_packed,
        pi_quantity_left: row.pi_quantity_left,
        pi_p_id: row.pi_p_id
    }));

    // Return structured object
    return [{
        p_id,
        p_package_slip,
        p_date,
        p_sales_order_id,
        p_user_id,
        p_internal_notes,
        p_created_at,
        p_updated_at,
        package_items
    }];
};


module.exports.EditPackage = async (package_id, package_slip, date, internal_notes) => {
    let Query = `update packages set p_package_slip=?,p_date=?,p_internal_notes=? where p_id=?`
    return await query(Query, [package_slip, date, internal_notes, package_id])
}

module.exports.UpdatePackageItem = async (pi_id, salesorder_item_id, ordered, packed, quantity_left) => {
    let Query = `update package_items set pi_soi_id=?,pi_ordered=?,pi_packed=?,pi_quantity_left=? where pi_id=?`
    return await query(Query, [salesorder_item_id, ordered, packed, quantity_left, pi_id])
}

module.exports.ListAllPackage = async (user_id, salesorder_id) => {
    let Query = `select * from packages where p_user_id=? and p_sales_order_id=?`
    return await query(Query, [user_id, salesorder_id])
}

module.exports.CheckPackageItem = async (package_id, salesorder_id, package_item_id) => {
    let Query = `select * from package_items where pi_id=? and  pi_soi_id=? and pi_p_id=?`
    return await query(Query, [package_item_id, salesorder_id, package_id])
}

module.exports.DeletePackageItem = async (package_id, salesorder_id, package_item_id) => {
    let Query = `delete from package_items where pi_id=? and  pi_soi_id=? and pi_p_id=?`
    return await query(Query, [package_item_id, salesorder_id, package_id])
}

module.exports.ExportPackages = async (user_id, status) => {
    const Query = `
      SELECT 
        p.*, 
        so.so_number,
        so.so_reference,
        so.so_order_date,
        so.so_total_amount,
        so.so_status
      FROM packages AS p
      LEFT JOIN sales_orders AS so ON p.p_sales_order_id = so.so_id
      WHERE p.p_user_id = ? AND p.p_package_status = ?
    `;
    return await query(Query, [user_id, status]);
};
