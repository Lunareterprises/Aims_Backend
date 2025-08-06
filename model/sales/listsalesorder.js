var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectSalesOrder = async (user_id, condition) => {
    condition = condition ? condition + ` and so_status ='active' ` : ` and so_status ='active'`
    var Query = `select * from sales_orders where so_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListSalesOrder = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and so_status ='${filter}' ` : ` and so_status ='${filter}'`

    var Query = `select * from sales_orders where so_user_id=?  ${condition} order by so_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetSalesOderItem = async (SalesOrder_id) => {
    var Query = `select * from items_sections where is_sales_order_id = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};

module.exports.GetDocuments = async (SalesOrder_id) => {
    var Query = `select * from sales_documents where sd_sales_order_id = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};
