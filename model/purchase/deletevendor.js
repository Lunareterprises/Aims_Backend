var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckVendors = async (vendor_id, user_id) => {
    var Query = `select * from vendors where ve_id = ? and ve_user_id =?`;
    var data = await query(Query, [vendor_id, user_id]);
    return data;
};

module.exports.CheckVendorDocuments = async (document_id, vendor_id) => {
    var Query = `select * from puchase_documents where pd_vendor_id = ? and pd_id = ?`;
    var data = await query(Query, [vendor_id, document_id]);
    return data;
}

module.exports.DeleteVendorDocuments = async (document_id, vendor_id) => {
    var Query = `DELETE FROM puchase_documents WHERE pd_id = ? and pd_vendor_id = ?`;
    var data = await query(Query, [document_id, vendor_id]);
    return data;
}

module.exports.RemoveVendors = async (vendor_id, user_id) => {
    var Query = `DELETE FROM vendors WHERE ve_id = ? and ve_user_id =?`;
    var data = await query(Query, [vendor_id, user_id]);
    return data;
};


module.exports.RemoveContactus = async (vendor_id) => {
    const Query = `DELETE FROM vendor_contact_person WHERE vcp_vendor_id = ?`;
    const data = await query(Query, [vendor_id]);
    return data;
}

module.exports.RemoveVendorBankDetails = async (vendor_id) => {
    const Query = `DELETE FROM vendors_bank_details WHERE vbd_vendor_id = ?`;
    const data = await query(Query, [vendor_id]);
    return data;
}

module.exports.RemoveVendorDocuments = async (vendor_id) => {
    const Query = `DELETE FROM vendors_documents WHERE vd_vendor_id = ?`;
    const data = await query(Query, [vendor_id]);
    return data;
}