var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckMode = async (mode, user_id) => {
    let Query = `select * from payment_mode where pm_mode=? and pm_user_id=?`
    return await query(Query, [mode, user_id])
}

module.exports.CreateMode = async (mode, user_id) => {
    let Query = `insert into payment_mode (pm_mode,pm_user_id) values(?,?)`
    return await query(Query, [mode, user_id])
}

module.exports.CheckPaymentMode = async (mode_id, user_id) => {
    let Query = `select * from payment_mode where pm_id=? and pm_user_id=?`
    return await query(Query, [mode_id, user_id])
}

module.exports.EditMode = async (mode_id, mode) => {
    let Query = `update payment_mode set mode=? where pm_id=?`
    return await query(Query, [mode, mode_id])
}

module.exports.ListAllPaymentModes = async (user_id) => {
    let Query = `select * from payment_mode where pm_user_id=?`
    return await query(Query, [user_id])
}

module.exports.SetDefault = async (mode_id, user_id) => {
    let resetQuery = `UPDATE payment_mode SET pm_is_default = ? WHERE pm_user_id = ?`;
    await query(resetQuery, [0, user_id]);

    let setQuery = `UPDATE payment_mode SET pm_is_default = ? WHERE pm_id = ?`;
    return await query(setQuery, [1, mode_id]);
};

module.exports.DeleteMode = async (mode_id, user_id) => {
    let Query = `delete from payment_mode where pm_id=? and pm_user_id=?`
    return await query(Query, [mode_id, user_id])
}