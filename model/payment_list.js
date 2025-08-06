var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.paymentlistquery = async () => {
  var Query = ` SELECT  * FROM payment_list pl INNER JOIN payment_images pi ON pl.py_id = pi.pi_id `;
  var data = query(Query);
  return data;
};

module.exports.Client_detailsquery = async (Client_id) => {
  var Query = `SELECT * FROM  client_register where c_client_id =? `;
  var data = query(Query, [Client_id]);
  return data;
};
