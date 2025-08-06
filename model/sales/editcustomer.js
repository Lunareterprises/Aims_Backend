var db = require("../../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckCustomerQuery = async (cu_id, user_id) => {
    var Query = `select * from customer where cu_id= ? and cu_user_id =?`;
    var data = query(Query, [cu_id, user_id]);
    return data;
};

module.exports.ChangeCustomer = async (condition, cu_id, user_id) => {
    var Query = `update customer ${condition} where cu_id = ? and cu_user_id =?`;
    var data = query(Query, [cu_id, user_id]);
    return data;
};

module.exports.InsertContactPerson = async (cu_id, person) => {
    var Query = `insert into customer_contact_person(ccp_cu_id,ccp_salutation,ccp_firstname,ccp_lastname,ccp_email,ccp_phone,ccp_mobile,ccp_designation,ccp_department,ccp_skype_name) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [cu_id, person.ccp_salutation, person.ccp_firstname, person.ccp_lastname, person.ccp_email, person.ccp_phone, person.ccp_mobile, person.ccp_designation, person.ccp_department, person.ccp_skype_name]);
    return data;
};

module.exports.UpdateContactPerson = async (person, cu_id, ccp_cu_id) => {
    var Query = `update customer_contact_person set ccp_salutation=?,ccp_firstname=?,ccp_lastname=?,ccp_email=?,ccp_phone=?,ccp_mobile=?,ccp_designation=?,ccp_department=?,ccp_skype_name=?  where ccp_id=? and ccp_cu_id=?`;
    var data = await query(Query, [person.ccp_salutation, person.ccp_firstname, person.ccp_lastname, person.ccp_email, person.ccp_phone, person.ccp_mobile, person.ccp_designation, person.ccp_department, person.ccp_skype_name, cu_id, ccp_cu_id]);
    return data;
};

module.exports.DeleteFilesQuery = async (cu_id, files_ids) => {
    var Query = `delete from sales_documents where sd_customer_id = ? and sd_id not in (${files_ids})`;
    var data = query(Query, [cu_id]);
    return data;
}

module.exports.AddImagesQuery = async (customer_id, imagepath) => {
    var Query = `insert into sales_documents (sd_customer_id,sd_file) values (?,?)`;
    var data = await query(Query, [customer_id, imagepath]);
    return data;
};