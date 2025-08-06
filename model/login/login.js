var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
  var Query = `select * from users where u_email = ?`;
  var data = query(Query, [email]);
  return data;
};

module.exports.ChangeLoginStatus = async (u_id, email) => {
  var Query = `update users set u_login_status = 0 where u_id = ? and u_email = ?`;
  var data = query(Query, [u_id, email]);
  return data;
};

