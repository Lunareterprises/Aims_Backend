var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckManufacture = async (name, user_id) => {
    let Query = `select * from manufacture where m_name=? and m_user_id=?`
    return await query(Query, [name, user_id])
}

module.exports.CreateManufacture = async (name, user_id) => {
    let Query = `insert into manufacture(m_name,m_user_id) values(?,?)`
    return await query(Query, [name, user_id])
}

module.exports.CheckWithId = async (manufacture_id, user_id) => {
    let Query = `select * from manufacture where m_id=? and m_user_id=?`
    return await query(Query, [manufacture_id, user_id])
}

module.exports.UpdateManufacture = async (manufacture_id, name) => {
    let Query = `update manufacture set m_name=? where m_id=?`
    return await query(Query, [name, manufacture_id])
}

module.exports.ListAllManufacture = async (user_id) => {
    let Query = `select * from manufacture where m_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeleteManufacture = async (manufacture_id, user_id) => {
    let Query = `delete from manufacture where m_id=? and m_user_id=?`
    return await query(Query, [manufacture_id, user_id])
}