var db = require("../../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

//Add Client
module.exports.client_register = async (
  c_client_Companyname,
  c_clientname,
  c_clientproject_name,
  gst_number,
  vat_number,
  c_email,
  c_ph,
  c_budget,
  c_date,
  c_project_deliverydate
) => {
  const Query = `
    INSERT INTO client_register( c_client_Companyname ,c_clientname, c_clientproject_name, gst_number,vat_number, c_email,c_ph,c_budget, c_date, c_project_deliverydate) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  let data = await query(Query, [
    c_client_Companyname,
    c_clientname,
    c_clientproject_name,
    gst_number,
    vat_number,
    c_email,
    c_ph,
    c_budget,
    c_date,
    c_project_deliverydate,
  ]);

  return data;
};

//Add list of clients
module.exports.client_list = async () => {
  let Query = `select * from client_register`;
  let data = await query(Query);
  return data;
};
