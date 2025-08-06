var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckItemQuery = async (item_id, user_id) => {
    var Query = `select * from items where i_id= ? and i_user_id =?`;
    var data = query(Query, [item_id, user_id]);
    return data;
};

module.exports.ChangeItem = async (condition, item_id, user_id) => {
    var Query = `update items ${condition} where i_id = ? and i_user_id =?`;
    var data = query(Query, [item_id, user_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (item_id) => {
    var Query = `UPDATE items SET i_image = '' WHERE i_id = ?`;
    var data = query(Query, [item_id]);
    return data;
}

module.exports.Updateimage = async (image, item_id, user_id) => {
    var Query = `update items set i_image = ?  where i_id = ? and i_user_id =? `;
    var data = query(Query, [image, item_id, user_id]);
    return data;
};

module.exports.CheckUnit = async (unit) => {
    let Query = `select * from unit where un_id=?`
    return await query(Query, [unit])
}

module.exports.CheckManufacture = async (manufacture_id) => {
    let Query = `select * from manufacture where m_id=?`
    return await query(Query, [manufacture_id])
}

module.exports.CheckBrand = async (brand_id) => {
    let Query = `select * from brand where b_id=?`
    return await query(Query, [brand_id])
}