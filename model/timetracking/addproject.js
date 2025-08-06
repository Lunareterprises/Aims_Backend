var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.addproject = async (user_id, project_name, project_code, customer_id, billing_method, project_description, cost_budget, revenue_budget, hours_budget_type, watchlist) => {
  var Query = `insert into project(proj_user_id,proj_name,proj_code,proj_cust_id,proj_billing_method,proj_description,proj_cost_budget,proj_revenue_budget,proj_hours_budget_type,proj_watchlist)values(?,?,?,?,?,?,?,?,?,?)`;
  var data = query(Query, [user_id, project_name, project_code, customer_id, billing_method, project_description, cost_budget, revenue_budget, hours_budget_type, watchlist]);
  return data;
};

module.exports.InsertTasks = async (name, user_id) => {
  var Query = `insert into project_task () values () `;
  var data = await query(Query, [name, user_id]);
  return data;
};

module.exports.InsertUsers = async (name, user_id) => {
  var Query = `insert into project_task () values () `;
  var data = await query(Query, [name, user_id]);
  return data;
};
