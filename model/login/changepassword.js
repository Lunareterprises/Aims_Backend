var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
    var Query = `select * from users where u_email = ?`;
    var data = await query(Query, [email]);
    return data;
};

module.exports.ChangepasswordQuery = async (passwrd, email) => {
    var Query = `UPDATE users
SET u_password = ?
WHERE u_email = ?`;
    var data = await query(Query, [passwrd, email]);
    return data;
};