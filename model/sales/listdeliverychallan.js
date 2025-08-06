var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectDeliveryChallan = async (user_id, condition) => {
    condition = condition ? condition + ` and dc_status ='active' ` : ` and dc_status ='active'`
    var Query = `select * from delivery_challans where dc_user_id = ? ${condition} `;
    // console.log(Query);
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListDeliveryChallan = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and dc_status ='${filter}' ` : ` and dc_status ='${filter}'`

    var Query = `select * from delivery_challans where dc_user_id=?  ${condition} order by dc_id desc limit ${limit} offset ${page}`;
    // console.log(Query);
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetDeliveryChallanItem = async (DeliveryChallan_id) => {
    var Query = `select * from items_sections where is_delivery_challans_id = ?`;
    var data = await query(Query, [DeliveryChallan_id]);
    return data;
};

module.exports.GetDocuments = async (DeliveryChallan_id) => {
    var Query = `select * from sales_documents where sd_delivery_challan_id = ?`;
    var data = await query(Query, [DeliveryChallan_id]);
    return data;
};
