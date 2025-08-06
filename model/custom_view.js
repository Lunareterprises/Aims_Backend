var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckName = async (cv_name, cv_user_id, cv_table_name, cv_id) => {
    let Query = `SELECT * FROM custom_view WHERE cv_name = ? AND cv_user_id = ? AND cv_table_name = ?`;
    let values = [cv_name, cv_user_id, cv_table_name];
    if (cv_id) {
        Query += ` AND cv_id <> ?`;
        values.push(cv_id);
    }
    return await query(Query, values);
};


module.exports.CreateCustomView = async (cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_user_id, cv_table_name) => {
    let Query = `insert into custom_view(cv_name,cv_is_favorite,cv_criteria,cv_criteria_pattern,cv_selected_columns,cv_visibility,cv_user_id,cv_table_name) values(?,?,?,?,?,?,?,?)`
    return await query(Query, [cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_user_id, cv_table_name])
}

module.exports.GetTableData = async (table) => {
    let Query = `SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = '${table}'`
    return await query(Query)
}

module.exports.GetTables = async () => {
    let Query = `SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'u160357475_crm'`
    return await query(Query)
}

module.exports.GetCustomViewData = async (cv_id, user_id) => {
    let Query = `select * from custom_view where cv_id=? and cv_user_id=?`
    return await query(Query, [cv_id, user_id])
}

module.exports.EditCustomView = async (cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_id) => {
    let Query = `update custom_view set cv_name=?,cv_is_favorite=?,cv_criteria=?,cv_criteria_pattern=?,cv_selected_columns=?,cv_visibility=? where cv_id=?`
    return await query(Query, [cv_name, cv_is_favorite, cv_criteria, cv_criteria_pattern, cv_selected_columns, cv_visibility, cv_id])
}

module.exports.ListCustomView = async (user_id, cv_table_name) => {
    let Query = `select * from custom_view where cv_user_id=? and cv_table_name=?`
    return await query(Query, [user_id, cv_table_name])
}

module.exports.GetDataOfCustomView = async (selectQuery, table) => {
    let Query = ` select ${selectQuery} from ${table}`
    return await query(Query)
}

module.exports.DeleteCustomView = async (cv_id, user_id) => {
    let Query = `delete from custom_view where cv_id=? and cv_user_id=?`
    return await query(Query, [cv_id, user_id])
}