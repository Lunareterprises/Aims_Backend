var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.SelectVendors = async (user_id, condition) => {
    condition = condition ? condition + ` and ve_status ='active' ` : ` and ve_status ='active'`
    var Query = `select * from vendors where ve_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListVendors = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and ve_status ='${filter}' ` : ` and ve_status ='${filter}'`
    
    var Query = `select * from vendors where ve_user_id=?  ${condition} order by ve_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetContactPersons = async (vendor_id) => {
    var Query = `select * from vendor_contact_person where vcp_vendor_id = ?`;
    var data = await query(Query, [vendor_id]);
    return data;
};

module.exports.GetBankDetails = async (vendor_id) => {
    var Query = `select * from vendors_bank_details where vbd_vendor_id = ?`;
    var data = await query(Query, [vendor_id]);
    return data;
};

module.exports.GetDocuments = async (vendor_id) => {
    var Query = `select * from purchase_documents where pd_vendor_id = ?`;
    var data = await query(Query, [vendor_id]);
    return data;
};

