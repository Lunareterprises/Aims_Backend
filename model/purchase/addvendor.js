var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckVendor = async (user_id, ve_email) => {
    var Query = `select * from vendors where ve_user_id = ? and ve_email=?`;
    var data = await query(Query, [user_id, ve_email]);
    return data;
};

module.exports.AddVendor = async (user_id, ve_salutation, ve_first_name, ve_last_name, ve_company_name, ve_display_name,
    ve_email, ve_phone, ve_mobile, ve_pan_no, ve_msme_reg, ve_currency, ve_opening_balance, ve_payment_terms,
    ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website, ve_remarks,
    ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, ve_b_addr_pincode,
    ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address, ve_s_addr_city,
    ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number) => {

    try {
        var Query = `INSERT INTO vendors (ve_user_id, ve_salutation, ve_first_name, ve_last_name, ve_company_name,
        ve_display_name, ve_email, ve_phone, ve_mobile, ve_pan_no, ve_msme_reg, ve_currency, ve_opening_balance, 
        ve_payment_terms, ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website,
        ve_remarks, ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, 
        ve_b_addr_pincode, ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address,
        ve_s_addr_city, ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, ve_salutation, ve_first_name, ve_last_name, ve_company_name, ve_display_name,
            ve_email, ve_phone, ve_mobile, ve_pan_no, ve_msme_reg, ve_currency, ve_opening_balance, ve_payment_terms,
            ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website, ve_remarks,
            ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, ve_b_addr_pincode,
            ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address, ve_s_addr_city,
            ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number]);

        return data;
    } catch (error) {
        console.error("Error inserting vendor data:", error);
        throw new Error('Failed to add vendor');
    }
};


module.exports.InsertContactPerson = async (vendor_id, el) => {
    var Query = `insert into vendor_contact_person(vcp_vendor_id,vcp_salutation,vcp_first_name,vcp_last_name,vcp_email,vcp_phone,vcp_mobile,vcp_designation,vcp_department,vcp_skype_name) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [vendor_id, el.vcp_salutation, el.vcp_first_name, el.vcp_last_name, el.vcp_email, el.vcp_phone, el.vcp_mobile, el.vcp_designation, el.vcp_department, el.vcp_skype_name]);
    return data;
};

module.exports.InserBankDetails = async (vendor_id, el) => {
    var Query = `insert into vendors_bank_details(vbd_vendor_id,vbd_acc_name,vbd_bank_name,vbd_acc_number,vbd_ifsc_code) values (?,?,?,?,?)`;
    var data = await query(Query, [vendor_id, el.vbd_acc_name, el.vbd_bank_name, el.vbd_acc_number, el.vbd_ifsc_code]);
    return data;
};

module.exports.AddImagesQuery = async (vendor_id, imagepath) => {
    var Query = `insert into purchase_documents (pd_vendor_id,pd_file) values (?,?)`;
    var data = await query(Query, [vendor_id, imagepath]);
    return data;
};