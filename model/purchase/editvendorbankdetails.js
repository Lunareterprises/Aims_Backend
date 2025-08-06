var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.CheckVendorQuery = async (ve_id, user_id) => {
    var Query = `select * from vendors where ve_id= ? and ve_user_id =?`;
    var data = query(Query, [ve_id, user_id]);
    return data;
};

module.exports.CheckVendorBankDetailsQuery = async (vbd_id, ve_id) => {
    var Query = `select * from vendors_bank_details where vbd_id= ? and vbd_vendor_id =?`;
    var data = query(Query, [vbd_id, ve_id]);
    return data;
};

module.exports.ChangeVendorBankDetails = async (condition, vbd_id, ve_id) => {
    var Query = `update vendors_bank_details ${condition} where vbd_id = ? and vbd_vendor_id =?`;
    var data = query(Query, [vbd_id, ve_id]);
    return data;
};


