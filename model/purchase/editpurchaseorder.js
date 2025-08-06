var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckPurchaseOrderQuery = async (po_id, user_id) => {
    var Query = `select * from purchase_order where po_id= ? and po_user_id =?`;
    var data = query(Query, [po_id, user_id]);
    return data;
};

module.exports.ChangePurchaseOrder = async (condition, po_id, user_id) => {
    var Query = `update purchase_order ${condition} where po_id = ? and po_user_id =?`;
    var data = query(Query, [po_id, user_id]);
    return data;
};

module.exports.InsertPurchaseOrderItem = async (po_id, item) => {
    var Query = `insert into items_sections(is_purchase_order, is_item_name, is_item_id,is_item_account_id,is_item_account_name,is_quantity, is_rate, is_discount, is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [po_id, item.is_item_name, item.is_item_id, el.is_item_account_id, el.is_item_account_name, item.is_quantity, item.is_rate, item.is_discount, item.is_amount]);
    return data;
};

module.exports.UpdatePurchaseOrderItem = async (item, is_id, po_id) => {
    var Query = `update items_sections set is_item_name=?,is_item_id=?,is_item_account_id=?,is_item_account_name=?,is_quantity=?,is_rate=?,is_discount=?,is_amount=? where is_id =? and is_purchase_order=? `;
    var data = await query(Query, [item.is_item_name, item.is_item_id, el.is_item_account_id, el.is_item_account_name, item.is_quantity, item.is_rate, item.is_discount, item.is_amount, is_id, po_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (po_id, files_ids) => {
    var Query = `delete from purchase_documents where pd_purchase_order_id = ? and pd_id not in (${files_ids})`;
    var data = query(Query, [po_id]);
    return data;
}

module.exports.AddImagesQuery = async (po_id, imagepath) => {
    var Query = `insert into purchase_documents (pd_purchase_order_id,pd_file) values (?,?)`;
    var data = await query(Query, [po_id, imagepath]);
    return data;
};