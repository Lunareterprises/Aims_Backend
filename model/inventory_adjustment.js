var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.GetReason = async (reason_id, user_id) => {
    let Query = `select * from reason where r_id=? and r_user_id=?`
    return await query(Query, [reason_id, user_id])
}

module.exports.CreateInventoryAdjustments = async (mode, reference_number, date, account, reason_id, description, user_id) => {
    let Query = `insert into inventory_adjustments (ia_mode,ia_reference_number,ia_date,ia_account,ia_reason,ia_description,ia_user_id) values(?,?,?,?,?,?,?)`
    return await query(Query, [mode, reference_number, date, account, reason_id, description, user_id])
}

module.exports.InsertItems = async (inventory_adjustment_id, item_id, item_description, available, changed, adjusted, user_id) => {
    let Query = `insert into inventory_adjustment_items (iai_ia_id,iai_item_id,iai_description,iai_available,iai_changed,iai_adjusted,iai_user_id) values(?,?,?,?,?,?,?)`
    return await query(Query, [inventory_adjustment_id, item_id, item_description, available, changed, adjusted, user_id])
}

module.exports.InsertImage = async (file, inventory_adjustment_id) => {
    let Query = `insert into inventory_adjustment_images (iai_ia_id,iai_file) values(?,?)`
    return await query(Query, [inventory_adjustment_id, file])
}

module.exports.CheckInventoryData = async (inventory_adjustment_id, user_id) => {
    let Query = `select * from inventory_adjustments where ia_id=? and ia_user_id=?`
    return await query(Query, [inventory_adjustment_id, user_id])
}

module.exports.EditInventoryAdjustment = async (inventory_adjustment_id, mode, reference_number, date, account, reason_id, description) => {
    let Query = `update inventory_adjustments set ia_mode=?,ia_reference_number=?,ia_date=?,ia_account=?,ia_reason=?,ia_description=? where ia_id=?`
    return await query(Query, [mode, reference_number, date, account, reason_id, description, inventory_adjustment_id])
}

module.exports.EditItems = async (iai_id, item_id, item_description, available, changed, adjusted) => {
    let Query = `update inventory_adjustment_items set iai_item_id=?,iai_description=?,iai_available=?,iai_changed=?,iai_adjusted=? where iai_id=?`
    return await query(Query, [item_id, item_description, available, changed, adjusted, iai_id])
}

module.exports.CheckImage = async (image_id, inventory_adjustment_id) => {
    let Query = `select * from inventory_adjustment_images where iai_id=? and iai_ia_id=?`
    return await query(Query, [image_id, inventory_adjustment_id])
}

module.exports.DeleteImage = async (image_id, inventory_adjustment_id) => {
    let Query = `delete from inventory_adjustment_images where iai_id=? and iai_ia_id=?`
    return await query(Query, [image_id, inventory_adjustment_id])
}

module.exports.ListAllData = async (user_id) => {
    const queryStr = `
        SELECT 
            ia.*,
            iai.iai_id,
            iai.iai_item_id,
            iai.iai_description,
            iai.iai_available,
            iai.iai_changed,
            iai.iai_adjusted,
            iai.iai_user_id,
            iai.iai_created_at,
            iai.iai_updated_at,
            iimg.iai_id AS image_id,
            iimg.iai_file,
            iimg.iai_created_at AS image_created_at,
            iimg.iai_updated_at AS image_updated_at
        FROM inventory_adjustments ia
        LEFT JOIN inventory_adjustment_items iai ON ia.ia_id = iai.iai_ia_id
        LEFT JOIN inventory_adjustment_images iimg ON iimg.iai_ia_id = ia.ia_id
        WHERE ia.ia_user_id = ?
        ORDER BY ia.ia_id, iai.iai_id
    `;

    const rows = await query(queryStr, [user_id]);

    const grouped = {};

    for (const row of rows) {
        const adjustmentId = row.ia_id;

        if (!grouped[adjustmentId]) {
            grouped[adjustmentId] = {
                ia_id: row.ia_id,
                ia_mode: row.ia_mode,
                ia_reference_number: row.ia_reference_number,
                ia_date: row.ia_date,
                ia_account: row.ia_account,
                ia_reason: row.ia_reason,
                ia_description: row.ia_description,
                ia_user_id: row.ia_user_id,
                ia_created_at: row.ia_created_at,
                ia_updated_at: row.ia_updated_at,
                items: [],
                images: []
            };
        }

        // ✅ Process items if available
        if (row.iai_id && !grouped[adjustmentId].items.some(item => item.iai_id === row.iai_id)) {
            grouped[adjustmentId].items.push({
                iai_id: row.iai_id,
                iai_item_id: row.iai_item_id,
                iai_description: row.iai_description,
                iai_available: row.iai_available,
                iai_changed: row.iai_changed,
                iai_adjusted: row.iai_adjusted,
                iai_user_id: row.iai_user_id,
                iai_created_at: row.iai_created_at,
                iai_updated_at: row.iai_updated_at
            });
        }

        // ✅ Process images correctly (checking image_id not file path)
        if (row.image_id && !grouped[adjustmentId].images.some(img => img.id === row.image_id)) {
            grouped[adjustmentId].images.push({
                id: row.image_id,
                file: row.iai_file,
                created_at: row.image_created_at,
                updated_at: row.image_updated_at
            });
        }
    }

    return Object.values(grouped);
};



module.exports.CheckItem = async (item_id, inventory_adjustment_id) => {
    let Query = ` select * from inventory_adjustment_items where iai_id=? and iai_ia_id=?`
    return await query(Query, [item_id, inventory_adjustment_id])
}

module.exports.DeleteItem = async (item_id, inventory_adjustment_id) => {
    let Query = `delete from inventory_adjustment_items where iai_id=? and iai_ia_id=?`
    return await query(Query, [item_id, inventory_adjustment_id])
}

module.exports.GetSingleData = async (inventory_adjustment_id, user_id) => {
    const queryStr = `
        SELECT 
            ia.*,
            iai.iai_id,
            iai.iai_item_id,
            iai.iai_description,
            iai.iai_available,
            iai.iai_changed,
            iai.iai_adjusted,
            iai.iai_user_id,
            iai.iai_created_at,
            iai.iai_updated_at,
            iimg.iai_id AS image_id,
            iimg.iai_file,
            iimg.iai_created_at AS image_created_at,
            iimg.iai_updated_at AS image_updated_at
        FROM inventory_adjustments ia
        LEFT JOIN inventory_adjustment_items iai ON ia.ia_id = iai.iai_ia_id
        LEFT JOIN inventory_adjustment_images iimg ON ia.ia_id = iimg.iai_ia_id
        WHERE ia.ia_user_id = ? AND ia.ia_id = ?
        ORDER BY ia.ia_id, iai.iai_id
    `;

    const rows = await query(queryStr, [user_id, inventory_adjustment_id]);

    const grouped = {
        ia_id: null,
        ia_mode: null,
        ia_reference_number: null,
        ia_date: null,
        ia_account: null,
        ia_reason: null,
        ia_description: null,
        ia_user_id: null,
        ia_created_at: null,
        ia_updated_at: null,
        items: [],
        images: []
    };

    const itemSet = new Set();
    const imageSet = new Set();

    for (const row of rows) {
        // Set adjustment details (only once)
        if (!grouped.ia_id) {
            grouped.ia_id = row.ia_id;
            grouped.ia_mode = row.ia_mode;
            grouped.ia_reference_number = row.ia_reference_number;
            grouped.ia_date = row.ia_date;
            grouped.ia_account = row.ia_account;
            grouped.ia_reason = row.ia_reason;
            grouped.ia_description = row.ia_description;
            grouped.ia_user_id = row.ia_user_id;
            grouped.ia_created_at = row.ia_created_at;
            grouped.ia_updated_at = row.ia_updated_at;
        }

        // Add unique items
        if (row.iai_id && !itemSet.has(row.iai_id)) {
            grouped.items.push({
                iai_id: row.iai_id,
                iai_item_id: row.iai_item_id,
                iai_description: row.iai_description,
                iai_available: row.iai_available,
                iai_changed: row.iai_changed,
                iai_adjusted: row.iai_adjusted,
                iai_user_id: row.iai_user_id,
                iai_created_at: row.iai_created_at,
                iai_updated_at: row.iai_updated_at
            });
            itemSet.add(row.iai_id);
        }

        // Add unique images
        if (row.image_id && !imageSet.has(row.image_id)) {
            grouped.images.push({
                id: row.image_id,
                file: row.iai_file,
                created_at: row.image_created_at,
                updated_at: row.image_updated_at
            });
            imageSet.add(row.image_id);
        }
    }

    return [grouped];
};


module.exports.DeleteInventoryAdjustments = async (inventory_adjustment_id, user_id) => {
    let imgQuery = ` delete from inventory_adjustment_images where iai_ia_id=?`
    await query(imgQuery, [inventory_adjustment_id])
    let itemQuery = ` delete from inventory_adjustment_items where iai_ia_id=?`
    await query(itemQuery, [inventory_adjustment_id])
    let deleteQuery = `delete from inventory_adjustments where ia_id=? and ia_user_id=?`
    return await query(deleteQuery, [inventory_adjustment_id, user_id])
}

module.exports.GetItemData = async (item_id, user_id) => {
    let Query = `select * from items where i_id=? and i_user_id=?`
    return await query(Query, [item_id, user_id])
}