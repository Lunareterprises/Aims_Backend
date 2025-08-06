var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UnitList = async (user_id) => {
    var Query = `select * from unit where un_user_id=?`;
    var data = await query(Query, [user_id]);
    return data;
};