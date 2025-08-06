var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.Selectcustomer = async (user_id, condition) => {
    condition = condition ? condition + ` and cu_status ='active' ` : ` and cu_status ='active'`
    var Query = `select * from customer where cu_user_id = ? ${condition} `;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.ListCustomer = async (user_id, filter, condition, page, limit) => {

    filter = filter ? filter : 'active';
    condition = condition ? condition + ` and cu_status ='${filter}' ` : ` and cu_status ='${filter}'`

    var Query = `select * from customer where cu_user_id=?  ${condition} order by cu_id desc limit ${limit} offset ${page}`;
    // console.log(Query);

    var data = await query(Query, [user_id]);
    return data;
};

module.exports.GetContactPersons = async (customer_id) => {
    var Query = `select * from customer_contact_person where ccp_cu_id = ?`;
    var data = await query(Query, [customer_id]);
    return data;
};

module.exports.GetDocuments = async (customer_id) => {
    var Query = `select * from sales_documents where sd_customer_id = ?`;
    var data = await query(Query, [customer_id]);
    return data;
};
