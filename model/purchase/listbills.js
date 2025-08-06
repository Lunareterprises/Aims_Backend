var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectPurchase_Bills = async (user_id, condition) => {
    condition = condition ? condition + ` and pb_status ='active' ` : ` and pb_status ='active'`
    var Query = `select * from purchase_bills where pb_user_id = ? ${condition} `;
    // console.log(Query);
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListPurchase_Bills = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and pb_status ='${filter}' ` : ` and pb_status ='${filter}'`

    var Query = `select * from purchase_bills where pb_user_id=?  ${condition} order by pb_id desc limit ${limit} offset ${page}`;
    // console.log(Query);
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetPurchase_Bills = async (SalesOrder_id) => {
    var Query = `select * from items_sections where is_purchase_bills_id = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};

module.exports.GetDocuments = async (SalesOrder_id) => {
    var Query = `select * from purchase_documents where pd_bills_id = ?`;
    var data = await query(Query, [SalesOrder_id]);
    return data;
};
