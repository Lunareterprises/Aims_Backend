var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
    var Query = `select * from users where u_email = ?`;
    var data = await query(Query, [email]);
    return data;
};

module.exports.CheckVerificationQuery = async (user_id) => {
    var Query = `select * from userverify where uv_u_id = ?`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.UpdateVerificationQuery = async (token, user_id) => {
    var Query = `UPDATE userverify
SET uv_token = ?
WHERE uv_u_id = ?`;
    var data = await query(Query, [token, user_id]);
    return data;
};

module.exports.InsertVerificationQuery = async (user_id, token) => {
    var Query = `INSERT INTO userverify (uv_u_id, uv_token)
VALUES (?,?)`;
    var data = await query(Query, [user_id, token]);
    return data;
};