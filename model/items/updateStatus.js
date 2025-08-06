var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckItem = async (item_id, user_id) => {
    let Query = `select * from items where i_id=? and i_user_id=?`
    return await query(Query, [item_id, user_id])
}

module.exports.UpdateStatus = async (item_id, status) => {
    let Query = `update item set i_status=? where i_id=?`
    return await query(Query, [status, item_id])
}