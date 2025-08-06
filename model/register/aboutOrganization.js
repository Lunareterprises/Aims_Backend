var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddOrganization = async (u_id, Org_name, industry, Org_location, state, base_currency, fiscal_year, language, tax_type, gst_num) => {
    var Query = `INSERT INTO organization (o_u_id, o_name, o_industry, o_location, o_state, o_base_currency, o_fiscal_year, o_language, o_tax_type ,o_gst_no)
                VALUES (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [u_id, Org_name, industry, Org_location, state, base_currency, fiscal_year, language, tax_type, gst_num]);
    return data;
};