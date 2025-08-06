var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckName = async (reason, user_id) => {
    let Query = `select * from reason where r_reason=? and r_user_id=?`
    return await query(Query, [reason, user_id])
}

module.exports.CreateReason = async (reason, user_id) => {
    let Query = `insert into reason (r_reason,r_user_id) values(?,?)`
    return await query(Query, [reason, user_id])
}

module.exports.EditReason = async (reason, reason_id) => {
    let Query = `update reason set  r_reason=? where r_id=?`
    return await query(Query, [reason, reason_id])
}

module.exports.GetReasonData = async (reason_id, user_id) => {
    let Query = `select * from reason where r_id=? and r_user_id`;
    return await query(Query, [reason_id, user_id])
}

module.exports.UpdateStatus = async (reason_id, status) => {
    let Query = `update reason set r_status=? where r_id=?`
    return await query(Query, [status, reason_id])
}

module.exports.GetAllReasons = async (user_id, type) => {
    type = type === 'active' ? 'and r_status="active"' : ''
    let Query = `select * from reason where r_user_id=? ${type}`
    return await query(Query, [user_id])
}

module.exports.DeleteReason=async(reason_id,user_id)=>{
    let Query=`delete from reason where r_id=? and r_user_id=?`
    return await query(Query, [reason_id, user_id])
}