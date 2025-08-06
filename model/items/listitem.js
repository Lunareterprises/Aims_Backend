var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.SelectItem = async (user_id, condition, type, filter) => {
    let filterCondition = '';
    switch (filter) {
        case 'active':
            filterCondition = `AND i_status = 'active'`;
            break;
        case 'inactive':
            filterCondition = `AND i_status = 'inactive'`;
            break;
        case 'sales':
            filterCondition = `AND i_sales_price IS NOT NULL`;
            break;
        case 'purchases':
            filterCondition = `AND i_purchase_price IS NOT NULL`;
            break;
        case 'services':
            filterCondition = `AND i_type = 'services'`;
            break;
        case 'inventory':
            filterCondition = `AND i_track_inventory = 1`;
            break;
        case 'non_inventory':
            filterCondition = `AND (i_track_inventory = 0 OR i_track_inventory IS NULL)`;
            break;
        case 'returnable':
            filterCondition = `AND i_returnable_item = 1`;
            break;
        case 'non_returnable':
            filterCondition = `AND (i_returnable_item = 0 OR i_returnable_item IS NULL)`;
            break;
        case 'ungrouped':
            filterCondition = `AND i_group_id IS NULL`;
            break;
        case 'all':
        default:
            filterCondition = ''; 
            break;
    }
    let typeCondition = type ? `AND i_type = "${type}"` : '';
    let finalCondition = `${condition || ''} ${filterCondition} ${typeCondition}`;
    const Query = `SELECT * FROM items WHERE i_user_id = ? ${finalCondition}`;
    const data = await query(Query, [user_id]);
    return data;
};


module.exports.ItemList = async (user_id, filter, condition, page, limit, type) => {
    // Start building the base query condition
    let filterCondition = '';
    switch (filter) {
        case 'active':
            filterCondition = `AND i_status = 'active'`;
            break;
        case 'inactive':
            filterCondition = `AND i_status = 'inactive'`;
            break;
        case 'sales':
            filterCondition = `AND i_sales_price IS NOT NULL`;
            break;
        case 'purchases':
            filterCondition = `AND i_purchase_price IS NOT NULL`;
            break;
        case 'services':
            filterCondition = `AND i_type = 'services'`;
            break;
        case 'inventory':
            filterCondition = `AND i_track_inventory = 1`;
            break;
        case 'non_inventory':
            filterCondition = `AND (i_track_inventory = 0 OR i_track_inventory IS NULL)`;
            break;
        case 'returnable':
            filterCondition = `AND i_returnable_item = 1`;
            break;
        case 'non_returnable':
            filterCondition = `AND (i_returnable_item = 0 OR i_returnable_item IS NULL)`;
            break;
        case 'ungrouped':
            filterCondition = `AND i_group_id IS NULL`;
            break;
        case 'all':
        default:
            filterCondition = ''; // No filter
            break;
    }
    // Handle custom types if provided (e.g. type = "product", etc.)
    let typeCondition = type ? `AND i_type = "${type}"` : '';
    // Merge all conditions
    const fullCondition = `${condition} ${filterCondition} ${typeCondition}`;
    // Final query
    const Query = `
        SELECT * 
        FROM items 
        WHERE i_user_id = ? ${fullCondition}
        ORDER BY i_id DESC 
        LIMIT ${limit} OFFSET ${page}
    `;
    const data = await query(Query, [user_id]);
    return data;
};

