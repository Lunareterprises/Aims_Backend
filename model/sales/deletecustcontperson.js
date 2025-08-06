var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckCustomercontperson = async (ccp_id, user_id) => {
    var Query = `select * from customer_contact_person where ccp_id = ? and ccp_cu_id =?`;
    var data = await query(Query, [ccp_id, user_id]);
    return data;
};

module.exports.RemoveCustomercontperson = async (ccp_id, user_id) => {
    var Query = `DELETE FROM customer_contact_person WHERE ccp_id = ? and ccp_cu_id =?`;
    var data = await query(Query, [ccp_id, user_id]);
    return data;
};
