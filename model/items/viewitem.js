var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdmin = async (item_id, user_id) => {
    var Query = `select * from items where i_id = ? and i_user_id=?`;
    var data = await query(Query, [item_id, user_id]);
    return data;
};