var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckBankDetailsQuery = async (bd_id, user_id) => {
    var Query = `select * from bankdetails where bd_id= ? and bd_acc_user_id =?`;
    var data = query(Query, [bd_id, user_id]);
    return data;
};

module.exports.ChangeBankDetails = async (condition, bd_id, user_id) => {
    var Query = `update bankdetails ${condition} where bd_id = ? and bd_acc_user_id =?`;
    var data = query(Query, [bd_id, user_id]);
    return data;
};

// module.exports.Updateimage = async (image, bd_id, user_id) => {
//     var Query = `update bankdetails set i_image = ?  where bd_id = ? and bd_acc_user_id =? `;
//     var data = query(Query, [image, bd_id, user_id]);
//     return data;
// };
