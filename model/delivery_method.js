var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.ListAllDeliveryMethods = async (user_id) => {
    let Query = `select * from delivery_methods where dm_user_id=?`
    return await query(Query, [user_id])
}


module.exports.CheckData = async (delivery_method_id, user_id) => {
    let Query = `select * from delivery_methods where dm_id=? and dm_user_id=?`
    return await query(Query, [delivery_method_id, user_id])
}

module.exports.DeleteDeliveryMethod = async (delivery_method_id, user_id) => {
    let Query = `delete from delivery_methods where dm_id=? and dm_user_id=?`
    return await query(Query, [delivery_method_id, user_id])
}
