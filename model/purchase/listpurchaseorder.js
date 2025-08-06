var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectPurchaseOrder = async (user_id, condition) => {
    condition = condition ? condition + ` and po_status ='active' ` : ` and po_status ='active'`
    var Query = `select * from purchase_order where po_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListPurchaseOrder = async (user_id,filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and po_status ='${filter}' ` : ` and po_status ='${filter}'`

    var Query = `select * from purchase_order where po_user_id=?  ${condition} order by po_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetPurchaseOrderItem = async (SalesOrder_id) => {
    var Query = `select * from items_sections where is_purchase_order = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};

module.exports.GetDocuments = async (SalesOrder_id) => {
    var Query = `select * from purchase_documents where pd_purchase_order_id = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};
