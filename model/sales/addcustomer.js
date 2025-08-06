var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckCustomer = async (user_id, cu_email) => {
    var Query = `select * from customer where cu_user_id = ? and cu_email=?`;
    var data = await query(Query, [user_id, cu_email]);
    return data;
};

module.exports.AddCustomer = async (user_id, cu_salutation, cu_first_name, cu_last_name, cu_company_name, cu_display_name, cu_email, cu_phone, cu_mobile, cu_pan_no, cu_opening_balance, cu_website, cu_designation, cu_department, cu_type, cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
    cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state, cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country, cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone, cu_s_addr_fax_number, cu_tax_treatment, cu_place_supply, cu_tax_preference
) => {
    var Query = `INSERT INTO customer (
        cu_user_id, cu_salutation, cu_first_name, cu_last_name, cu_company_name,
        cu_display_name, cu_email, cu_phone, cu_mobile, cu_pan_no,
        cu_opening_balance, cu_website, cu_designation, cu_department, cu_type,
        cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
        cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state,
        cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country,
        cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone,
        cu_s_addr_fax_number, cu_tax_treatment, cu_place_supply, cu_tax_preference
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    var data = await query(Query, [user_id, cu_salutation, cu_first_name, cu_last_name, cu_company_name, cu_display_name, cu_email, cu_phone, cu_mobile, cu_pan_no, cu_opening_balance, cu_website, cu_designation, cu_department, cu_type, cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
        cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state, cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country, cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone, cu_s_addr_fax_number, cu_tax_treatment, cu_place_supply, cu_tax_preference]);

    return data;
};

module.exports.InsertContactPerson = async (customer_id, el) => {
    var Query = `insert into customer_contact_person(ccp_cu_id,ccp_salutation,ccp_firstname,ccp_lastname,ccp_email,ccp_phone,ccp_mobile,ccp_designation,ccp_department,ccp_skype_name) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [customer_id, el.ccp_salutation, el.ccp_firstname, el.ccp_lastname, el.ccp_email, el.ccp_phone, el.ccp_mobile, el.ccp_designation, el.ccp_department, el.ccp_skype_name]);
    return data;
};

module.exports.AddImagesQuery = async (customer_id, imagepath) => {
    var Query = `insert into sales_documents (sd_customer_id,sd_file) values (?,?)`;
    var data = await query(Query, [customer_id, imagepath]);
    return data;
};