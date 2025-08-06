var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.createSalesPerson = async (name, email, createdBy) => {
    var Query = `insert into sales_person (name,email,createdBy) values (?,?,?)`;
    var data = await query(Query, [name, email, createdBy]);
    return data;
}

module.exports.updateStatus = async (salesPerson_id, status, createdBy) => {
    var Query = `update sales_person set status=? where id = ? and createdBy=?`
    return await query(Query, [status, salesPerson_id, createdBy])
}

module.exports.listSalesperson = async (createdBy) => {
    var Query = `select * from sales_person where createdBy=?`
    return await query(Query, [createdBy])
}

module.exports.deleteSalesperson = async (salesPerson_id, createdBy) => {
    var Query = `DELETE FROM sales_person WHERE id = ? and createdBy =?`
    return await query(Query, [salesPerson_id, createdBy])
}

module.exports.GetSalespersonData = async (salesPerson_id, createdBy) => {
    let Query = `select * from sales_person where id=? and createdBy=?`
    return await query(Query, [salesPerson_id, createdBy])
}