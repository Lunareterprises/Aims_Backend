var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.Selectcustomer = async (user_id, condition) => {
    condition = condition ? condition + ` and cu_status ='active' ` : ` and cu_status ='active'`
    var Query = `select * from customer where cu_user_id = ? ${condition} `;
    console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListCustomer = async (user_id, condition, page, limit) => {
    condition = condition ? condition + ` and cu_status ='active' ` : ` and cu_status ='active'`
    var Query = `select * from customer where cu_user_id=?  ${condition} order by cu_id desc limit ${limit} offset ${page}`;
    console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};
