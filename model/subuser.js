var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.CreateSubUser=async()=>{
    
}