var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CreateComment = async (comment, customer_id, user_id) => {
    let Query = `insert into customer_comment(cc_cu_id,cc_user_id,cc_comment)`
    return await query(Query, [customer_id, user_id, comment])
}

module.exports.GetCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.ListComments = async (customer_id, user_id) => {
    let Query = `select * from customer_comment where cc_cu_id=? and cc_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckComment = async (comment_id, customer_id, user_id) => {
    let Query = `select * from customer_comment where cc_id=? and cc_cu_id=? and cc_user_id=?`
    return await query(Query, [comment_id, customer_id, user_id])
}

module.exports.EditComment = async (comment_id, comment) => {
    let Query = `update customer_comment set comment=? where cc_id=?`
    return await query(Query, [comment, comment_id])
}

module.exports.DeleteComment = async (comment_id, user_id) => {
    let Query = `delete from customer_comment where cc_id=? and cc_user_id=?`
    return await query(Query, [comment_id, user_id])
}

module.exports.UpdateStatus = async (customer_id, status) => {
    let Query = `update customer set cu_status=? where cu_id=?`
    return await query(Query, [status, customer_id])
}

module.exports.ListAllCustomers = async (user_id) => {
    const Query = `
      SELECT 
        c.*, 
        cp.*
      FROM customer c
      LEFT JOIN customer_contact_person cp
        ON cp.ccp_cu_id = c.cu_id
      WHERE c.cu_user_id = ?
    `;
    return await query(Query, [user_id]);
};
