var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.CheckName = async (tax_name, user_id, tax_id) => {
    let Query = `select * from tax where tax_name=? and tax_user_id=?`
    let values = [tax_name, user_id]
    if (tax_id) {
        Query += ` and tax_id<>?`
        values.push(tax_id)
    }
    return await query(Query, values)
}

module.exports.CreateTax = async (tax_name, tax_rate, user_id) => {
    let Query = `insert into tax (tax_name,tax_rate,tax_user_id) values(?,?,?)`
    return await query(Query, [tax_name, tax_rate, user_id])
}

module.exports.CheckTax = async (tax_id, user_id) => {
    let Query = `select * from tax where tax_id=? and tax_user_id=?`
    return await query(Query, [tax_id, user_id])
}

module.exports.EditTax = async (tax_id, tax_name, tax_rate) => {
    let Query = `update tax set tax_name=?,tax_rate=? where tax_id=?`
    return await query(Query, [tax_name, tax_rate, tax_id])
}

module.exports.ListAllTax = async (user_id) => {
    let Query = `select * from tax where tax_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeleteTax = async (tax_id, user_id) => {
    let Query = `delete from tax where tax_id=? and tax_user_id=?`
    return await query(Query, [tax_id, user_id])
}