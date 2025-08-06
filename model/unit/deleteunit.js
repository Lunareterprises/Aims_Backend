var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUnit = async (u_id, user_id) => {
    var Query = `select * from unit where un_id = ? and un_user_id=?`;
    var data = await query(Query, [u_id, user_id]);
    return data;
};

module.exports.RemoveUnit = async (u_id, user_id) => {
    var Query = `DELETE FROM unit WHERE un_id = ? and un_user_id=?`;
    var data = await query(Query, [u_id, user_id]);
    return data;
};
