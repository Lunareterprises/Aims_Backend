var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckCustomer = async (proj_id, user_id) => {
    var Query = `select * from customer where proj_id = ? and cu_user_id =?`;
    var data = await query(Query, [proj_id, user_id]);
    return data;
};

module.exports.RemoveCustomer = async (proj_id, user_id) => {
    var Query = `DELETE FROM customer WHERE proj_id = ? cu_user_id =?`;
    var data = await query(Query, [proj_id, user_id]);
    return data;
};
