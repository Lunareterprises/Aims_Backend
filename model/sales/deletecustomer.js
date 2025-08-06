var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckCustomer = async (cust_id, user_id) => {
    var Query = `select * from customer where cu_id = ? and cu_user_id =?`;
    var data = await query(Query, [cust_id, user_id]);
    return data;
};

module.exports.RemoveCustomer = async (cust_id, user_id) => {
    var Query = `DELETE FROM customer WHERE cu_id = ? and cu_user_id =?`;
    var data = await query(Query, [cust_id, user_id]);
    return data;
};
