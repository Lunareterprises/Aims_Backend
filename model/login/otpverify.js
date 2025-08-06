var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckMail = async (email) => {
    var Query = `select * from users where u_email = ?`;
    var data = await query(Query, [email]);
    return data;
};

module.exports.VerifyOtp = async (user_id, otp) => {
    var Query = `select * from userverify where uv_u_id =? and uv_token = ?`;
    var data = await query(Query, [user_id, otp]);
    return data;
};

