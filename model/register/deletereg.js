var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.CheckUser = async (u_id) => {
    var Query = `select * from users where u_id = ?`
    var data = await query(Query, [u_id]);
    return data;
};

module.exports.RemoveUser = async (u_id) => {
    var Query = `UPDATE users
SET u_status = 'removed'
WHERE u_id = ?`
    var data = await query(Query, [u_id]);
    return data;
};
