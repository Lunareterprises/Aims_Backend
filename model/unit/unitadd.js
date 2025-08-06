var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UnitAdd = async (unit_name, user_id) => {
    var Query = `INSERT INTO unit (un_name,un_user_id) VALUES (?,?)`;
    var data = await query(Query, [unit_name, user_id]);
    return data;
};

module.exports.CheckUnit = async (unit_name, user_id) => {
    let Query = `select * from unit where un_name=? and un_user_id=?`
    return await query(Query, [unit_name, user_id])
}