var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckSalesOrderQuery = async (so_id, user_id) => {
    var Query = `select * from sales_orders where so_id= ? and so_user_id =?`;
    var data = query(Query, [so_id, user_id]);
    return data;
};

module.exports.ChangeSalesOrder = async (condition, so_id, user_id) => {
    var Query = `update sales_orders ${condition} where so_id = ? and so_user_id =?`;
    var data = query(Query, [so_id, user_id]);
    return data;
};

module.exports.InsertSalesOrderItem = async (so_id, item) => {
    var Query = `insert into items_sections(is_sales_order_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount, is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [so_id, item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount]);
    return data;
};

module.exports.UpdateSalesOrderItem = async (item, is_id, so_id) => {
    var Query = `update items_sections set is_item_name=?,is_item_id=?,is_quantity=?,is_rate=?,is_discount=?,is_amount=? where is_id =? and is_sales_order_id=? `;
    var data = await query(Query, [item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount, is_id, so_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (so_id, files_ids) => {
    var Query = `delete from sales_documents where sd_sales_order_id = ? and sd_id not in (${files_ids})`;
    var data = query(Query, [so_id]);
    return data;
}

module.exports.AddImagesQuery = async (so_id, imagepath) => {
    var Query = `insert into sales_documents (sd_sales_order_id,sd_file) values (?,?)`;
    var data = await query(Query, [so_id, imagepath]);
    return data;
};