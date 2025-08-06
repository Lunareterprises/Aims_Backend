var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.checkpaymentquery = async (py_id) => {
    var Query = `select * FROM payment_list WHERE py_id =?`
    var data = query(Query, [py_id])
    return data
}

module.exports.Checkpaymentdelete = async (py_id) => {
    var Query = `DELETE FROM payment_list WHERE py_id =?`
    var data = query(Query, [py_id])
    return data
}
