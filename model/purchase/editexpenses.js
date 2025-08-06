var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckExpensesQuery = async (ep_id, user_id) => {
    var Query = `select * from expenses where ep_id= ? and ep_user_id =?`;
    var data = query(Query, [ep_id, user_id]);
    return data;
};

module.exports.ChangeExpenses = async (condition, ep_id, user_id) => {
    var Query = `update expenses ${condition} where ep_id = ? and ep_user_id =?`;
    var data = query(Query, [ep_id, user_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (ep_id, files_ids) => {
    var Query = `delete from expenses_documents where exd_expenses_id = ? and exd_id not in (${files_ids})`;
    var data = query(Query, [ep_id]);
    return data;
}

module.exports.AddImagesQuery = async (ep_id, imagepath) => {
    var Query = `insert into expenses_documents (exd_expenses_id,exd_file) values (?,?)`;
    var data = await query(Query, [ep_id, imagepath]);
    return data;
};