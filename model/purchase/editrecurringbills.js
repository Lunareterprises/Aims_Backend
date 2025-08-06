var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckRecurringBillsQuery = async (rb_id, user_id) => {
    var Query = `select * from recurring_bills where rb_id= ? and rb_user_id =?`;
    var data = query(Query, [rb_id, user_id]);
    return data;
};

module.exports.ChangeRecurringBills = async (condition, rb_id, user_id) => {
    var Query = `update recurring_bills ${condition} where rb_id = ? and rb_user_id =?`;
    var data = query(Query, [rb_id, user_id]);
    return data;
};

module.exports.InsertRecurringBillsItem = async (rb_id, item) => {
    var Query = `insert into items_sections(is_recurring_bills_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount, is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [rb_id, item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount]);
    return data;
};

module.exports.UpdateRecurringBillsItem = async (item, is_id, rb_id) => {
    var Query = `update items_sections set is_item_name=?,is_item_id=?,is_quantity=?,is_rate=?,is_discount=?,is_amount=? where is_id =? and is_recurring_bills_id=? `;
    var data = await query(Query, [item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount, is_id, rb_id]);
    return data;
};

