var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.users = async (createdBy) => {
    var Query = ` SELECT  * FROM customer where cu_user_id=?`;
    var data = query(Query, [createdBy]);
    return data;
};
