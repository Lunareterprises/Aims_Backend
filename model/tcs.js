var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.CheckName = async (tax_name, user_id, tax_id) => {
    let Query = `select * from tcs_tds_tax where tt_name=? and tt_user_id=?`
    let values = [tax_name, user_id]
    if (tax_id) {
        Query += ` and tt_id<>?`
        values.push(tax_id)
    }
    return await query(Query, values)
}

module.exports.CreateTcsTds = async (tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, high_tcs_rate, rate_reason, start_date, end_date, type, user_id) => {
    let Query = `insert into tcs_tds_tax (tt_collection,tt_name,tt_rate,tt_high_rate,tt_reason,tt_start_date,tt_end_date,tt_payable_account,tt_receivable_account,tt_type,tt_user_id) values(?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [nature_of_collection, tax_name, tax_rate, high_tcs_rate, rate_reason, start_date, end_date, payable_account, receivable_account, type, user_id])
}

module.exports.CheckTax = async (tax_id, user_id) => {
    let Query = `select * from tcs_tds_tax where tt_id=? and tt_user_id=?`
    return await query(Query, [tax_id, user_id])
}

module.exports.EditTcsTds = async (tax_id, tax_name, tax_rate, nature_of_collection, payable_account, receivable_account, high_tcs_rate, rate_reason, start_date, end_date) => {
    let Query = `update tcs_tds_tax set tt_collection=?,tt_name=?,tt_rate=?,tt_high_rate=?,tt_reason=?,tt_start_date=?,tt_end_date=?,tt_payable_account=?,tt_receivable_account=? where tt_id=?`
    return await query(Query, [nature_of_collection, tax_name, tax_rate, high_tcs_rate, rate_reason, start_date, end_date, payable_account, receivable_account, tax_id])
}

module.exports.ListAllTcsTds = async (user_id, tax_type) => {
    let Query = `select * from tcs_tds_tax where tt_user_id=? and tt_type=?`
    return await query(Query, [user_id, tax_type])
}

module.exports.DeleteTcsTds = async (tax_id, user_id) => {
    let Query = `delete from tcs_tds_tax where tt_id=? and tt_user_id=?`
    return await query(Query, [tax_id, user_id])
}