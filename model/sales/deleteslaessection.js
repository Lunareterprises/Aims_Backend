var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.CheckSalesorderQuery = async (sales_order_id, user_id) => {
    var Query = `select * FROM sales_orders WHERE so_id=? and so_user_id=?`;
    var data = await query(Query, [sales_order_id, user_id]);
    return data;
};
module.exports.RemoveSalesorderQuery = async (sales_order_id) => {
    var Query = `DELETE FROM sales_orders WHERE so_id=?`;
    var data = await query(Query, [sales_order_id]);
    return data;
};
module.exports.RemoveSalesorderItemQuery = async (sales_order_id) => {
    var Query = `DELETE FROM items_sections WHERE is_sales_order_id=?`;
    var data = await query(Query, [sales_order_id]);
    return data;
};
module.exports.RemoveSalesorderDocumentsQuery = async (sales_order_id) => {
    var Query = `DELETE FROM sales_documents WHERE sd_sales_order_id=?`;
    var data = await query(Query, [sales_order_id]);
    return data;
};
//-----------------------------------//
module.exports.CheckdeliverychallanQuery = async (sales_order_id, user_id) => {
    var Query = `select * FROM delivery_challans WHERE dc_id=? and dc_user_id=?`;
    var data = await query(Query, [sales_order_id, user_id]);
    return data;
};

module.exports.RemovedeliverychallanQuery = async (sales_order_id) => {
    var Query = `DELETE FROM delivery_challans WHERE dc_id=?`;
    var data = await query(Query, [sales_order_id]);
    return data;
};

module.exports.RemovedeliverychallanDocumentsQuery = async (sales_order_id) => {
    var Query = `DELETE FROM sales_documents WHERE sd_delivery_challan_id = ?`;
    var data = await query(Query, [sales_order_id]);
    return data;
};

//-----------------------------------//
module.exports.ChecksalesOrderItemQuery = async (sales_order_item_id) => {
    var Query = `select * FROM items_sections WHERE is_id=? `;
    var data = await query(Query, [sales_order_item_id]);
    return data;
};

module.exports.RemovesalesOrderItemQuery = async (sales_order_item_id) => {
    var Query = `DELETE FROM items_sections WHERE is_id=?`;
    var data = await query(Query, [sales_order_item_id]);
    return data;
};


//-----------------------------------//
