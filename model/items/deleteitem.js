var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckItem = async (item_id) => {
    var Query = `select * from items where i_id = ? and i_status = 'active'`;
    var data = await query(Query, [item_id]);
    return data;
};

module.exports.RemoveItem = async (item_id) => {
    var Query = `DELETE FROM items WHERE i_id = ?`;
    var data = await query(Query, [item_id]);
    return data;
};
