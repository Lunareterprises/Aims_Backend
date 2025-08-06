var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CreateItemGroup = async (ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_user_id) => {
    let Query = `insert into item_groups(ig_type,ig_name,ig_excise_product,ig_description,ig_returnable_item,ig_unit_id,ig_manufacture_id,ig_tax,ig_brand_id,ig_tax_preference,ig_inventory_valuation,ig_attributes_and_options,ig_item_type,ig_opening_stock,ig_sales_account,ig_purchase_account,ig_inventory_account,ig_user_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_user_id])
}

module.exports.FindUnitData = async (unit_id, user_id) => {
    let Query = `select * from unit where un_id=? and un_user_id=?`
    return await query(Query, [unit_id, user_id])
}

module.exports.FindManufactureData = async (manufacture_id, user_id) => {
    let Query = `select * from manufacture where m_id=? and m_user_id=?`
    return await query(Query, [manufacture_id, user_id])
}

module.exports.FindBrandData = async (brand_id, user_id) => {
    let Query = `select * from brand where b_id=? and b_user_id=?`
    return await query(Query, [brand_id, user_id])
}

module.exports.InsertImage = async (imagepath, insertId) => {
    let Query = `insert into item_groups_images(igi_file,igi_ig_id) values(?,?)`
    return await query(Query, [imagepath, insertId])
}

module.exports.GetGroupData = async (ig_id, user_id) => {
    let Query = `select * from item_groups where ig_id=? and ig_user_id=?`
    return await query(Query, [ig_id, user_id])
}

module.exports.UpdateItemGroupData = async (ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_id) => {
    let Query = `update item_groups set ig_type=?,ig_name=?,ig_excise_product=?,ig_description=?,ig_returnable_item=?,ig_unit_id=?,ig_manufacture_id=?,ig_tax=?,ig_brand_id=?,ig_tax_preference=?,ig_inventory_valuation=?,ig_attributes_and_options=?,ig_item_type=?,ig_opening_stock=?,ig_sales_account=?,ig_purchase_account=?,ig_inventory_account=? where ig_id=?`
    return await query(Query, [ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_id])
}

module.exports.DeleteItemGroupImage = async (img_id) => {
    let Query = `delete from item_groups_images where igi_id=?`
    return await query(Query, [img_id])
}

module.exports.GetImage = async (img_id, item_group_id) => {
    let Query = `select * from item_groups_images where igi_id=? and igi_ig_id=?`
    return await query(Query, [img_id, item_group_id])
}

module.exports.ListGroupItem = async (user_id) => {
    const queryStr = `
        SELECT 
            ig.*, 
            igi.igi_id, 
            igi.igi_file, 
            igi.igi_created_at, 
            igi.igi_updated_at
        FROM item_groups ig
        LEFT JOIN item_groups_images igi ON ig.ig_id = igi.igi_ig_id
        WHERE ig.ig_user_id = ?
    `;

    const rows = await query(queryStr, [user_id]);

    const grouped = {};

    for (const row of rows) {
        const groupId = row.ig_id;

        if (!grouped[groupId]) {
            grouped[groupId] = {
                ig_id: row.ig_id,
                ig_type: row.ig_type,
                ig_name: row.ig_name,
                ig_excise_product: row.ig_excise_product,
                ig_description: row.ig_description,
                ig_returnable_item: row.ig_returnable_item,
                ig_unit_id: row.ig_unit_id,
                ig_manufacture_id: row.ig_manufacture_id,
                ig_tax: row.ig_tax,
                ig_brand_id: row.ig_brand_id,
                ig_tax_preference: row.ig_tax_preference,
                ig_inventory_valuation: row.ig_inventory_valuation,
                ig_attributes_and_options: row.ig_attributes_and_options,
                ig_item_type: row.ig_item_type,
                ig_opening_stock: row.ig_opening_stock,
                ig_sales_account: row.ig_sales_account,
                ig_purchase_account: row.ig_purchase_account,
                ig_inventory_account: row.ig_inventory_account,
                ig_user_id: row.ig_user_id,
                ig_created_at: row.ig_created_at,
                ig_updated_at: row.ig_updated_at,
                images: []
            };
        }
        if (row.igi_id && row.igi_file) {
            grouped[groupId].images.push({
                igi_id: row.igi_id,
                igi_file: row.igi_file,
                igi_created_at: row.igi_created_at,
                igi_updated_at: row.igi_updated_at
            });
        }
    }
    return Object.values(grouped);
};

module.exports.DeleteItemGroup = async (ig_id, user_id) => {
    let imageQuery = `delete from item_groups_images where igi_ig_id=?`
    await query(imageQuery, [ig_id])
    let Query = `delete from item_groups where ig_id=? and ig_user_id=?`
    return await query(Query, [ig_id, user_id])
}

module.exports.CreateAttribute = async (attribute, options, ig_id) => {
    let Query = `insert into item_groups_attributes (iga_attribute, iga_options, iga_ig_id) values (?, ?, ?)`
    return await query(Query, [attribute, options, ig_id])
}

module.exports.InsertItemGroupItems = async (name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point, igi_ig_id) => {
    let Query = `insert into item_groups_items (igi_name,igi_sku,igi_opening_stock,igi_opening_stock_value,igi_cost_price,igi_sales_price,igi_upc,igi_ean,igi_isbn,igi_reorder_point,igi_ig_id) values(?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point, igi_ig_id])
}

module.exports.EditItemGroupItems = async (item_id, name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point) => {
    let Query = `update item_groups_items set igi_name=?,igi_sku=?,igi_opening_stock=?,igi_opening_stock_value=?,igi_cost_price=?,igi_sales_price=?,igi_upc=?,igi_ean=?,igi_isbn=?,igi_reorder_point=? where igi_id=?`
    return await query(Query, [name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point, item_id])
}

module.exports.EditAttributes = async (attribute_id, attribute, options) => {
    let Query = `update item_groups_attributes set iga_attribute=?,iga_options=? where iga_id=?`
    return await query(Query, [attribute, options, attribute_id])
}

module.exports.DeleteAllImages = async (item_group_id) => {
    let Query = `delete from item_groups_images where igi_ig_id=?`
    return await query(Query, [item_group_id])
}

module.exports.DeleteAllAttributes = async (item_group_id) => {
    let Query = `delete from item_groups_attributes where iga_ig_id=?`
    return await query(Query, [item_group_id])
}