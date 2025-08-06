var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckRecurringExpensesQuery = async (re_id, user_id) => {
    var Query = `select * from recurring_expenses where re_id= ? and re_user_id = ?`;
    var data = query(Query, [re_id, user_id]);
    return data;
};

module.exports.ChangeRecurringExpenses = async (condition, re_id, user_id) => {
    var Query = `update recurring_expenses ${condition} where re_id = ? and re_user_id = ?`;
    var data = query(Query, [re_id, user_id]);
    return data;
};


