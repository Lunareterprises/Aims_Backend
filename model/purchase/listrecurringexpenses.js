var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectRecurringExpenses = async (user_id, condition) => {
    condition = condition ? condition + ` and re_status ='active' ` : ` and re_status ='active'`
    var Query = `select * from recurring_expenses where re_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListRecurringExpenses = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and re_status ='${filter}' ` : ` and re_status ='${filter}'`

    var Query = `select * from recurring_expenses where re_user_id=?  ${condition} order by re_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};


