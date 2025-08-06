var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckUser = async (user_id) => {
    let Query = `select * from users where u_id=?`
    return await query(Query, [user_id])
}

module.exports.CheckName = async (name, user_id, customer_id) => {
    let Query = `select * from project where proj_name=? and proj_user_id=? and proj_cust_id=?`
    return await query(Query, [name, user_id, customer_id])
}

module.exports.CreateProject = async (name, code, customer_id, billing_method, total_cost, description, cost_budget, revenue_budget, budget_hours_type, budget_hours, add_watchlist, user_id) => {
    let Query = `insert into project (proj_user_id,proj_name,proj_code,proj_cust_id,proj_billing_method,proj_description,proj_total_cost,proj_cost_budget,proj_revenue_budget,proj_hours_budget_type,proj_watchlist,proj_budget_hours) values(?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [user_id, name, code, customer_id, billing_method, description, total_cost, cost_budget, revenue_budget, budget_hours_type, add_watchlist, budget_hours])
}

module.exports.InsertProjectUser = async (project_id, user_id, budget_hours) => {
    let Query = `insert into project_users (pu_u_id,pu_budget_hrs_time,pu_p_id) values(?,?,?)`
    return await query(Query, [user_id, budget_hours, project_id])
}

module.exports.DeleteProject = async (project_id, user_id, customer_id) => {
    let Query = `delete from project where proj_user_id=? and proj_cust_id=? and proj_id=?`
    return await query(Query, [user_id, customer_id, project_id])
}

module.exports.InsertProjectTask = async (name, description, budget_hours, project_id) => {
    let Query = `insert into project_task (t_name,t_description,t_budget_hrs,t_p_id) values(?,?,?,?)`
    return await query(Query, [name, description, budget_hours, project_id])
}

module.exports.CheckProject = async (project_id, user_id, customer_id) => {
    let Query = `select * from project where proj_user_id=? and proj_cust_id=? and proj_id=? `
    return await query(Query, [user_id, customer_id, project_id])
}

module.exports.EditProject = async (project_id, name, code, billing_method, total_cost, description, cost_budget, revenue_budget, budget_hours_type, budget_hours, add_watchlist) => {
    let Query = `update project set proj_name=?,proj_code=?,proj_billing_method=?,proj_description=?,proj_total_cost=?,proj_cost_budget=?,proj_revenue_budget=?,proj_hours_budget_type=?,proj_watchlist=?,proj_budget_hours=? where proj_id=?`
    return await query(Query, [name, code, billing_method, description, total_cost, cost_budget, revenue_budget, budget_hours_type, add_watchlist, budget_hours, project_id])
}

module.exports.EditProjectUser = async (project_user_id, budget_hours) => {
    let Query = `update project_users set pu_budget_hrs_time=? where pu_id=?`
    return await query(Query, [budget_hours, project_user_id])
}

module.exports.EditProjectTask = async (task_id, name, description, budget_hours) => {
    let Query = `update project_task set t_name=?,t_description=?,t_budget_hrs=? where t_id=?`
    return await query(Query, [name, description, budget_hours, task_id])
}

module.exports.CheckProjectUser = async (project_user_id, project_id) => {
    let Query = `select * from project_users where pu_id=? and pu_p_id=?`
    return await query(Query, [project_user_id, project_id])
}

module.exports.DeleteProjectUser = async (project_user_id, project_id) => {
    let Query = `delete from project_users where pu_id=? and pu_p_id=?`
    return await query(Query, [project_user_id, project_id])
}

module.exports.CheckTask = async (task_id, project_id) => {
    let Query = `select * from project_task where t_id=? and t_p_id=?`
    return await query(Query, [task_id, project_id])
}

module.exports.DeleteTask = async (task_id, project_id) => {
    let Query = `delete from project_task where t_id=? and t_p_id=?`
    return await query(Query, [task_id, project_id])
}

module.exports.ListAllProjects = async (user_id, customer_id) => {
    let Query = `select * from project where proj_user_id=? and proj_cust_id=?`
    return await query(Query, [user_id, customer_id])
}

module.exports.GetProjectData = async (project_id, user_id, customer_id) => {
    const Query = `
        SELECT 
            p.*, 
            pt.t_id AS task_id,
            pt.t_name AS task_name,
            pt.t_status AS task_status,
            pt.t_description AS task_description,
            pu.pu_u_id AS project_user_id,
            u.u_name AS user_name,
            u.u_email AS user_email
        FROM project p
        LEFT JOIN project_task pt ON pt.t_p_id = p.proj_id
        LEFT JOIN project_users pu ON pu.pu_p_id = p.proj_id
        LEFT JOIN users u ON u.u_id = pu.pu_u_id
        WHERE p.proj_id = ? AND p.proj_user_id = ? AND p.proj_cust_id = ?
    `;

    const rows = await query(Query, [project_id, user_id, customer_id]);

    if (rows.length === 0) return null;

    const grouped = {
        proj_id: rows[0].proj_id,
        proj_user_id: rows[0].proj_user_id,
        proj_name: rows[0].proj_name,
        proj_code: rows[0].proj_code,
        proj_cust_id: rows[0].proj_cust_id,
        proj_billing_method: rows[0].proj_billing_method,
        proj_description: rows[0].proj_description,
        proj_total_cost: rows[0].proj_total_cost,
        proj_cost_budget: rows[0].proj_cost_budget,
        proj_revenue_budget: rows[0].proj_revenue_budget,
        proj_hours_budget_type: rows[0].proj_hours_budget_type,
        proj_watchlist: rows[0].proj_watchlist,
        proj_status: rows[0].proj_status,
        proj_budget_hours: rows[0].proj_budget_hours,
        project_tasks: [],
        project_users: []
    };

    const taskSet = new Set();
    const userSet = new Set();

    for (const row of rows) {
        if (row.task_id && !taskSet.has(row.task_id)) {
            grouped.project_tasks.push({
                task_id: row.task_id,
                task_name: row.task_name,
                task_description: row.task_description,
                task_status: row.task_status
            });
            taskSet.add(row.task_id);
        }

        if (row.project_user_id && !userSet.has(row.project_user_id)) {
            grouped.project_users.push({
                user_id: row.project_user_id,
                user_name: row.user_name,
                user_email: row.user_email
            });
            userSet.add(row.project_user_id);
        }
    }

    return [grouped];
};


