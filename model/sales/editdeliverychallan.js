var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckDeliveryChallanQuery = async (dc_id, user_id) => {
    var Query = `select * from delivery_challans where dc_id= ? and dc_user_id =?`;
    var data = query(Query, [dc_id, user_id]);
    return data;
};

module.exports.ChangeDeliveryChallan = async (condition, dc_id, user_id) => {
    var Query = `update delivery_challans ${condition} where dc_id = ? and dc_user_id =?`;
    var data = query(Query, [dc_id, user_id]);
    return data;
};

module.exports.InsertDeliveryChallanItem = async (dc_id, item) => {
    var Query = `insert into items_sections(is_delivery_challans_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount, is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [dc_id, item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount]);
    return data;
};

module.exports.UpdateDeliveryChallanItem = async (item, is_id, dc_id) => {
    var Query = `update items_sections set is_item_name=?,is_item_id=?,is_quantity=?,is_rate=?,is_discount=?,is_amount=? where is_id =? and is_delivery_challans_id=? `;
    var data = await query(Query, [item.is_item_name, item.is_item_id, item.is_quantity, item.is_rate, item.is_discount, item.is_amount, is_id, dc_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (dc_id, files_ids) => {
    var Query = `delete from sales_documents where sd_delivery_challan_id = ? and sd_id not in (${files_ids})`;
    var data = query(Query, [dc_id]);
    return data;
}

module.exports.AddImagesQuery = async (dc_id, imagepath) => {
    var Query = `insert into sales_documents (sd_delivery_challan_id,sd_file) values (?,?)`;
    var data = await query(Query, [dc_id, imagepath]);
    return data;
};