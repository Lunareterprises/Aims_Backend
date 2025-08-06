var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckName = async (name, user_id) => {
    let Query = `select * from brand where b_name=? and b_user_id=?`
    return await query(Query, [name, user_id])
}

module.exports.CreateBrand = async (name, user_id) => {
    let Query = `insert into brand(b_name,b_user_id) values(?,?)`
    return await query(Query, [name, user_id])
}

module.exports.CheckById = async (brand_id, user_id) => {
    let Query = `select * from brand where b_id=? and b_user_id=?`
    return await query(Query, [brand_id, user_id])
}

module.exports.UpdateBrand = async (brand_id, name) => {
    let Query = `update brand set b_name=? where b_id=?`
    return await query(Query, [name, brand_id])
}

module.exports.ListBrand = async (user_id) => {
    let Query = `select * from brand where b_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeleteBrand = async (brand_id, user_id) => {
    let Query = `delete from brand where b_id=? and b_user_id=?`
    return await query(Query, [brand_id, user_id])
}