var db = require("../../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.listAllProducts = async (user_id) => {
    var Query = `select * FROM items WHERE i_user_id =?`
    var data = query(Query, [user_id])
    return data
}

module.exports.getUserDetails=async(user_id)=>{
    var Query = `select * FROM users WHERE u_id =?`
    var data = query(Query, [user_id])
    return data
}
