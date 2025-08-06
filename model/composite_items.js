var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CreateCompositeItem = async (user_id, sku, name, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point) => {
    let Query = `insert into composite_items(ci_name,ci_sku,ci_unit,ci_returnable_item,ci_sales_price,ci_sales_account,ci_sales_description,ci_tax,ci_purchase_price,ci_purchase_account,ci_purchase_description,ci_preffered_vendor,ci_dimension_unit,ci_dimension_value,ci_weight_unit,ci_weight_value,ci_manufacture_id,ci_brand_id,ci_upc,ci_mpn,ci_ean,ci_isbn,ci_inventory_account,ci_valuation_method,ci_opening_stock,ci_rate_per_unit,ci_reorder_point,ci_user_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [name, sku, unit, returnable_item, selling_price, sales_account, sales_description, tax, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, inventory_account, inventory_valuation_method, handsOnStock, rate_per_unit, reorder_point, user_id])
}

module.exports.EditCompositeItem = async (composite_item_id, user_id, sku, name, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point) => {
    let Query = `
    UPDATE composite_items
    SET 
      ci_name = ?, 
      ci_sku = ?, 
      ci_unit = ?, 
      ci_returnable_item = ?, 
      ci_sales_price = ?, 
      ci_sales_account = ?, 
      ci_sales_description = ?, 
      ci_tax = ?, 
      ci_purchase_price = ?, 
      ci_purchase_account = ?, 
      ci_purchase_description = ?, 
      ci_preffered_vendor = ?, 
      ci_dimension_unit = ?, 
      ci_dimension_value = ?, 
      ci_weight_unit = ?, 
      ci_weight_value = ?, 
      ci_manufacture_id = ?, 
      ci_brand_id = ?, 
      ci_upc = ?, 
      ci_mpn = ?, 
      ci_ean = ?, 
      ci_isbn = ?, 
      ci_inventory_account = ?, 
      ci_valuation_method = ?, 
      ci_opening_stock = ?, 
      ci_rate_per_unit = ?, 
      ci_reorder_point = ?, 
      ci_user_id = ?
    WHERE ci_id = ?
  `;
    return await query(Query, [name, sku, unit, returnable_item, selling_price, sales_account, sales_description, tax, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, inventory_account, inventory_valuation_method, handsOnStock, rate_per_unit, reorder_point, user_id, composite_item_id])
}

module.exports.GetCompositeItems = async (composite_item_id, user_id) => {
    const queryStr = `
        SELECT 
            ci.*,
            cii.cii_id AS image_id,
            cii.cii_file,
            cii.cii_created_at,
            cii.cii_updated_at,
            ic.ic_id AS item_id,
            ic.ic_i_id,
            ic.ic_quantity,
            ic.ic_selling_price,
            ic.ic_cost_price,
            ic.ic_created_at AS item_created_at,
            ic.ic_updated_at AS item_updated_at
        FROM composite_items ci
        LEFT JOIN composite_items_images cii ON ci.ci_id = cii.cii_ci_id
        LEFT JOIN item_composite ic ON ci.ci_id = ic.ic_ci_id
        WHERE ci.ci_id = ? AND ci.ci_user_id = ?
    `;

    const rows = await query(queryStr, [composite_item_id, user_id]);

    if (rows.length === 0) return [];

    const first = rows[0];

    const compositeItem = {
        ci_id: first.ci_id,
        ci_name: first.ci_name,
        ci_sku: first.ci_sku,
        ci_unit: first.ci_unit,
        ci_returnable_item: first.ci_returnable_item,
        ci_sales_price: first.ci_sales_price,
        ci_sales_account: first.ci_sales_account,
        ci_sales_description: first.ci_sales_description,
        ci_tax: first.ci_tax,
        ci_purchase_price: first.ci_purchase_price,
        ci_purchase_account: first.ci_purchase_account,
        ci_purchase_description: first.ci_purchase_description,
        ci_preffered_vendor: first.ci_preffered_vendor,
        ci_dimension_unit: first.ci_dimension_unit,
        ci_dimension_value: first.ci_dimension_value,
        ci_weight_unit: first.ci_weight_unit,
        ci_weight_value: first.ci_weight_value,
        ci_manufacture_id: first.ci_manufacture_id,
        ci_brand_id: first.ci_brand_id,
        ci_upc: first.ci_upc,
        ci_mpn: first.ci_mpn,
        ci_ean: first.ci_ean,
        ci_isbn: first.ci_isbn,
        ci_inventory_account: first.ci_inventory_account,
        ci_valuation_method: first.ci_valuation_method,
        ci_opening_stock: first.ci_opening_stock,
        ci_rate_per_unit: first.ci_rate_per_unit,
        ci_reorder_point: first.ci_reorder_point,
        ci_user_id: first.ci_user_id,
        ci_createdAt: first.ci_createdAt,
        ci_updatedAt: first.ci_updatedAt,
        images: [],
        items: []
    };

    const imageSet = new Set();
    const itemSet = new Set();

    for (const row of rows) {
        if (row.image_id && !imageSet.has(row.image_id)) {
            compositeItem.images.push({
                cii_id: row.image_id,
                cii_file: row.cii_file,
                cii_created_at: row.cii_created_at,
                cii_updated_at: row.cii_updated_at
            });
            imageSet.add(row.image_id);
        }

        if (row.item_id && !itemSet.has(row.item_id)) {
            compositeItem.items.push({
                ic_id: row.item_id,
                ic_item_id: row.ic_i_id,
                ic_quantity: row.ic_quantity,
                ic_sales_price: row.ic_selling_price,
                ic_cost_price: row.ic_cost_price,
                ic_created_at: row.item_created_at,
                ic_updated_at: row.item_updated_at
            });
            itemSet.add(row.item_id);
        }
    }

    return [compositeItem]; // ✅ Wrapping in an array
};




module.exports.ListCompositeItem = async (user_id) => {
    const Query = `
      SELECT 
        ci.*, 
        cii.cii_id, 
        cii.cii_file, 
        cii.cii_created_at, 
        cii.cii_updated_at
      FROM composite_items ci
      LEFT JOIN composite_items_images cii 
        ON ci.ci_id = cii.cii_ci_id
      WHERE ci.ci_user_id = ?
    `;

    const results = await query(Query, [user_id]);

    // Group by composite item ID
    const grouped = {};

    for (const row of results) {
        const itemId = row.ci_id;

        if (!grouped[itemId]) {
            grouped[itemId] = {
                ci_id: row.ci_id,
                ci_name: row.ci_name,
                ci_sku: row.ci_sku,
                ci_unit: row.ci_unit,
                ci_returnable_item: row.ci_returnable_item,
                ci_sales_price: row.ci_sales_price,
                ci_sales_account: row.ci_sales_account,
                ci_sales_description: row.ci_sales_description,
                ci_tax: row.ci_tax,
                ci_purchase_price: row.ci_purchase_price,
                ci_purchase_account: row.ci_purchase_account,
                ci_purchase_description: row.ci_purchase_description,
                ci_preffered_vendor: row.ci_preffered_vendor,
                ci_dimension_unit: row.ci_dimension_unit,
                ci_dimension_value: row.ci_dimension_value,
                ci_weight_unit: row.ci_weight_unit,
                ci_weight_value: row.ci_weight_value,
                ci_manufacture_id: row.ci_manufacture_id,
                ci_brand_id: row.ci_brand_id,
                ci_upc: row.ci_upc,
                ci_mpn: row.ci_mpn,
                ci_ean: row.ci_ean,
                ci_isbn: row.ci_isbn,
                ci_inventory_account: row.ci_inventory_account,
                ci_valuation_method: row.ci_valuation_method,
                ci_opening_stock: row.ci_opening_stock,
                ci_rate_per_unit: row.ci_rate_per_unit,
                ci_reorder_point: row.ci_reorder_point,
                ci_user_id: row.ci_user_id,
                ci_createdAt: row.ci_createdAt,
                ci_updatedAt: row.ci_updatedAt,
                images: []
            };
        }

        // Only push image if it exists (in case of NULL joins)
        if (row.cii_id) {
            grouped[itemId].images.push({
                cii_id: row.cii_id,
                cii_file: row.cii_file,
                cii_created_at: row.cii_created_at,
                cii_updated_at: row.cii_updated_at
            });
        }
    }
    return Object.values(grouped);
};


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

module.exports.FindVendorData = async (vendor_id, user_id) => {
    let Query = `select * from vendors where ve_id=? and ve_user_id=?`
    return await query(Query, [vendor_id, user_id])
}

module.exports.InsertImage = async (image, composite_id) => {
    let Query = `insert into composite_items_images(cii_file,cii_ci_id) values(?,?)`
    return await query(Query, [image, composite_id])
}

module.exports.GetImage = async (image_id, composite_item_id) => {
    let Query = `select * from composite_items_images where cii_id=? and cii_ci_id=?`
    return await query(Query, [image_id, composite_item_id])
}

module.exports.DeleteImage = async (image_id) => {
    let Query = `delete from composite_items_images where cii_id=?`
    return await query(Query, [image_id])
}

module.exports.DeleteCompositeItem = async (composite_item_id, user_id) => {
    let deleteQuery = `delete from composite_items_images where cii_ci_id=?`
    await query(deleteQuery, [composite_item_id])
    let Query = `delete from composite_items where ci_id=? and ci_user_id=?`
    return await query(Query, [composite_item_id, user_id])
}

module.exports.InsertAssociateItems = async (itemId, quantity, selling_price, cost_price, composite_item_id) => {
    let Query = `insert into item_composite (ic_i_id,ic_quantity,ic_selling_price,ic_cost_price,ic_ci_id) values(?,?,?,?,?)`
    return await query(Query, [itemId, quantity, selling_price, cost_price, composite_item_id])
}

module.exports.CheckItem = async (item_id, user_id) => {
    let Query = `select * from items where i_id=? and i_user_id=?`
    return await query(Query, [item_id, user_id])
}