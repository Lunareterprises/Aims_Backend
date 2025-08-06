var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectRecurringBills = async (user_id, condition) => {
    condition = condition ? condition + ` and rb_status ='active' ` : ` and rb_status ='active'`
    var Query = `select * from recurring_bills where rb_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListRecurringBills = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and rb_status ='${filter}' ` : ` and rb_status ='${filter}'`

    var Query = `select * from recurring_bills where rb_user_id = ?  ${condition} order by rb_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetRecurringBillsItem = async (RecurringBills_id) => {
    var Query = `select * from items_sections where is_recurring_bills_id = ?`;
    var data = await query(Query, [RecurringBills_id]);
    return data;
};


