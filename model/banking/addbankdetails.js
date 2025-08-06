var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.InsertBankDetailsQuery = async (user_id, bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary) => {
    var Query = `insert into bankdetails ( bd_acc_user_id,bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [user_id, bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary]);
    return data;
};
