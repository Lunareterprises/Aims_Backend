var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckVendorQuery = async (ve_id, user_id) => {
    var Query = `select * from vendors where ve_id= ? and ve_user_id =?`;
    var data = query(Query, [ve_id, user_id]);
    return data;
};

module.exports.ChangeVendor = async (condition, ve_id, user_id) => {
    var Query = `update vendors ${condition} where ve_id = ? and ve_user_id =?`;
    var data = query(Query, [ve_id, user_id]);
    return data;
};

module.exports.InsertContactPerson = async (ve_id, el) => {
    var Query = `insert into vendor_contact_person(vcp_vendor_id, vcp_salutation, vcp_first_name, vcp_last_name, vcp_email, vcp_phone, vcp_mobile, vcp_designation, vcp_department, vcp_skype_name) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [ve_id, el.vcp_salutation, el.vcp_first_name, el.vcp_last_name, el.vcp_email, el.vcp_phone, el.vcp_mobile, el.vcp_designation, el.vcp_department, el.vcp_skype_name]);
    return data;
};

module.exports.UpdateContactPerson = async (person, cu_id, ccp_cu_id) => {
    var Query = `update vendor_contact_person set vcp_salutation=?, vcp_first_name=?, vcp_last_name=?, vcp_email=?, vcp_phone=?, vcp_mobile=?, vcp_designation=?, vcp_department=?, vcp_skype_name=? where ccp_id=? and ccp_cu_id=?`;
    var data = await query(Query, [person.vcp_salutation, person.vcp_first_name, person.vcp_last_name, person.vcp_email, person.vcp_phone, person.vcp_mobile, person.vcp_designation, person.vcp_department, person.vcp_skype_name, cu_id, ccp_cu_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (cu_id, files_ids) => {
    var Query = `delete from vendors_documents where vd_vendor_id = ? and vd_id not in (${files_ids})`;
    var data = query(Query, [cu_id]);
    return data;
}

module.exports.AddImagesQuery = async (ve_id, imagepath) => {
var Query = `insert into vendors_documents (vd_vendor_id,vd_file) values (?,?)`;
    var data = await query(Query, [ve_id, imagepath]);
    return data;
};