var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CreateVendorComment = async (vendor_id, user_id, comment) => {
    const Query = `INSERT INTO customer_comment (vendor_id, user_id, comment) VALUES (?, ?, ?)`;
    const result = await query(Query, [vendor_id, user_id, comment]);
    return result;
}


module.exports.CheckVendor = async (vendor_id, user_id) => {
    const Query = `SELECT * FROM vendors WHERE ve_id = ? AND ve_user_id = ?`;
    const result = await query(Query, [vendor_id, user_id]);
    return result;
}


module.exports.GetVendorComments = async (vendor_id, user_id) => {
    const Query = `SELECT * from customer_comment WHERE vendor_id = ? AND user_id = ? ORDER BY cc_created_at DESC`;
    const result = await query(Query, [vendor_id, user_id]);
    return result;
}

module.exports.CheckComment = async (comment_id, vendor_id, user_id) => {
    const Query = `SELECT * FROM customer_comment WHERE cc_id = ? AND cc_vendor_id AND cc_user_id = ?`;
    const result = await query(Query, [comment_id, vendor_id, user_id]);
    return result;
}

module.exports.DeleteVendorComment = async (comment_id, vendor_id, user_id) => {
    const Query = `DELETE FROM customer_comment WHERE cc_id = ? AND cc_vendor_id = ? AND cc_user_id = ?`;
    const result = await query(Query, [comment_id, vendor_id, user_id]);
    return result;
}

module.exports.UpdateVendorComment = async (comment_id, vendor_id, user_id, comment) => {
    const Query = `UPDATE customer_comment SET cc_comment = ? WHERE cc_id = ? AND cc_vendor_id = ? AND cc_user_id = ?`;
    const result = await query(Query, [comment, comment_id, vendor_id, user_id]);
    return result;
}