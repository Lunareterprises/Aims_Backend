var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (company_name) => {
    var Query = `select * from users where u_company_name = ?`;
    var data = await query(Query, [company_name]);
    return data;
};

module.exports.CheckMail = async (company_mail) => {
    var Query = `select * from users where u_email = ?`;
    var data = await query(Query, [company_mail]);
    return data;
};

module.exports.AddUser = async (company_name, u_name, company_mail, company_mobile, hashedPassword, country, currency) => {
    var Query = `INSERT INTO users (u_company_name, u_name, u_email, u_mobile, u_password, u_country, u_currency)
                 VALUES (?,?,?,?,?,?,?)`;
    var data = await query(Query, [company_name, u_name, company_mail, company_mobile, hashedPassword, country, currency]);
    return data;
};

module.exports.CheckMail = async (email) => {
    var Query = `select * from users where u_email = ?`;
    var data = await query(Query, [email]);
    return data;
};
module.exports.CheckOTP = async (user_id) => {
    var Query = `select * from userverify where uv_u_id =?`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.VerifyOtp = async (user_id, otp) => {
    var Query = `select * from userverify where uv_u_id =? and uv_token = ?`;
    var data = await query(Query, [user_id, otp]);
    return data;
};

module.exports.InsertVerificationQuery = async (user_id, token, expirationDate) => {
    var Query = `INSERT INTO userverify (uv_u_id, uv_token,uv_token_expiry)
                VALUES (?,?,?)`;
    var data = await query(Query, [user_id, token, expirationDate]);
    return data;
};

module.exports.UpdatetVerificationQuery = async (token, expirationDate, user_id) => {
    var Query = `UPDATE userverify SET uv_token = ?,uv_token_expiry=? WHERE uv_u_id = ?;`
    var data = await query(Query, [token, expirationDate, user_id]);
    return data;
};