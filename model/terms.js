var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckName = async (term_name, user_id, term_id) => {
    let Query = `select * from payment_terms where pt_term_name=? and pt_user_id=?`
    let values = [term_name, user_id]
    if (term_id) {
        Query += ` and pt_id<>?`
        values.push(term_id)
    }
    return await query(Query, values)
}

module.exports.CreateTerm = async (term_name, total_days, user_id) => {
    let Query = `insert into payment_terms (pt_term_name,pt_total_days,pt_user_id) values(?,?,?)`
    return await query(Query, [term_name, total_days, user_id])
}

module.exports.CheckTerm = async (term_id, user_id) => {
    let Query = `select * from payment_terms where pt_id=? and pt_user_id=?`
    return await query(Query, [term_id, user_id])
}

module.exports.EditTerm = async (term_id, term_name, total_days) => {
    let Query = `update payment_terms set pt_term_name=?,pt_total_days=? where pt_id=?`
    return await query(Query, [term_name, total_days, term_id])
}

module.exports.ListAllPaymentTerms = async (user_id) => {
    let Query = `select * from payment_terms where pt_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeletePaymentTerm = async (term_id, user_id) => {
    let Query = `delete from payment_terms where pt_id=? and pt_user_id=?`
    return await query(Query, [term_id, user_id])
}

module.exports.SetDefault = async (term_id, user_id) => {
    const queries = [
        `UPDATE payment_terms SET pt_is_default = FALSE WHERE pt_user_id = ?`,
        `UPDATE payment_terms SET pt_is_default = TRUE WHERE pt_id = ? AND pt_user_id = ?`
    ];

    await query(queries[0], [user_id]);                // Set all terms to false for this user
    return await query(queries[1], [term_id, user_id]); // Set the specified term to true
};
