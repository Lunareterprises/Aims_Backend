var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckVendors = async (vendor_id, user_id) => {
    var Query = `select * from vendors where ve_id = ? and ve_user_id =?`;
    var data = await query(Query, [vendor_id, user_id]);
    return data;
};

module.exports.RemoveVendors = async (vendor_id, user_id) => {
    var Query = `DELETE FROM vendors WHERE ve_id = ? and ve_user_id =?`;
    var data = await query(Query, [vendor_id, user_id]);
    return data;
};
