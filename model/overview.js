var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.clientsOverview = async (createdBy) => {
    var Query = `select * FROM vendors WHERE ve_user_id =?`
    var data = query(Query, [createdBy])
    return data
}

module.exports.listItems=async(createdBy)=>{
    var Query = `select * FROM items WHERE i_user_id =?`
    var data = query(Query, [createdBy])
    return data
}