var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.SelectBankDetails = async (user_id, condition) => {
    condition = condition ? condition + ` and bd_acc_status ='active' ` : ` and bd_acc_status ='active'`
    var Query = `select * from bankdetails where bd_acc_user_id = ? ${condition} `;
    console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListBankDetailsQuery = async (user_id, condition, page, limit) => {
    condition = condition ? condition + ` and bd_acc_status ='active' ` : ` and bd_acc_status ='active'`
    var Query = `select * from bankdetails where bd_acc_user_id = ? ${condition} order by bd_id desc limit ${limit} offset ${page}`;
    console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};