var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckBankDetails = async (bd_id, user_id) => {
    var Query = `select * from bankdetails where bd_id = ? and bd_acc_user_id =?`;
    var data = await query(Query, [bd_id, user_id]);
    return data;
};

module.exports.RemoveBankDetails = async (bd_id, user_id) => {
    var Query = `DELETE FROM bankdetails WHERE bd_id = ? and bd_acc_user_id =?`;
    var data = await query(Query, [bd_id, user_id]);
    return data;
};
