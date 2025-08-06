var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.listAllSalesOrder = async (createdBy) => {
    var Query = `select * from sales_orders where so_user_id=?`
    return await query(Query, [createdBy])
}

module.exports.listAllExpenses = async (createdBy) => {
    var Query = `select * from expenses where ep_user_id=?`
    return await query(Query, [createdBy])
}