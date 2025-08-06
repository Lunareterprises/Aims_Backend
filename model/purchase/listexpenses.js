var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectExpenses = async (user_id, condition) => {
    condition = condition ? condition + ` and ep_status ='active' ` : ` and ep_status ='active'`
    var Query = `select * from expenses where ep_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListExpenses = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';

    condition = condition ? condition + ` AND ep_status = '${filter}'` : `AND ep_status = '${filter}'`;


    var Query = `select * from expenses where ep_user_id=?  ${condition} order by ep_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};



module.exports.GetDocuments = async (expense_id) => {
    var Query = `select * from purchase_documents where pd_expense_id = ?`;
    var data = await query(Query, [expense_id]);
    return data;
};

