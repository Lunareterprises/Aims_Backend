var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckItem = async (name, user_id) => {
    var Query = `select * from items where i_name =? and i_user_id = ? `;
    var data = await query(Query, [name, user_id]);
    return data;
};

module.exports.AddItem = async (user_id, type, sku, name, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, preferred_vendor_id, sales_status, purchase_status, imagepath, handsOnStock, track_inventory, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, excise_product, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point) => {
    var Query = `INSERT INTO items (i_user_id,i_type,i_name,i_unit,i_sales_price,i_sales_account,i_sales_description,i_purchase_price,i_purchase_account,i_purchase_description,i_preferred_vendor,i_preferred_vendor_id,i_sales_status,i_purchase_status,i_image,handsOnStock,i_track_inventory,i_inventory_account,i_valuation_method,i_rate_per_unit,i_sku,i_returnable_item,i_excise_product, i_dimension_unit, i_dimension_value,i_weight_unit,i_weight_value,i_manufacture,i_brand,i_upc,i_mpn,i_ean,i_isbn,i_tax,i_reorder_point)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [user_id, type, name, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, preferred_vendor_id, sales_status, purchase_status, imagepath, handsOnStock, track_inventory, inventory_account, inventory_valuation_method, rate_per_unit, sku, returnable_item, excise_product, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point]);
    return data;
};

module.exports.CheckUnit = async (unit_id) => {
    let Query = `select * from unit where un_id=?`
    return await query(Query, [unit_id])
}

module.exports.CheckManufacture = async (manufacture_id) => {
    let Query = `select * from manufacture where m_id=?`
    return await query(Query, [manufacture_id])
}

module.exports.CheckBrand = async (brand_id) => {
    let Query = `select * from brand where b_id=?`
    return await query(Query, [brand_id])
}