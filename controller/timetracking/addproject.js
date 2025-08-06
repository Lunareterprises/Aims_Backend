var model = require('../../model/timetracking/addproject')
// const { trace } = require('../../router')

module.exports.AddProject = async (req, res) => {
    try {
        let { user_id } = req.headers
        var { project_name, project_code, customer_id, billing_method, project_description, cost_budget, revenue_budget, hours_budget_type, billing_needs, add_budget, budget_type, budget_needs, project_users, project_tasks, watchlist } = req.body

        if (!user_id) {
            return res.send({
                result: false,
                message: "insufficient parameters"
            })

        }


        let addproject = await model.addproject(user_id, project_name, project_code, customer_id, billing_method, project_description, cost_budget, revenue_budget, hours_budget_type, watchlist)
        if (addproject.affectedRows > 0) {

            var proj_id = addproject.insertId


            project_tasks.forEach(async (el) => {
                let inserttasks = await model.InsertTasks(el.name, el.description, el.budget_hrs, el.billable, proj_id)
                console.log(inserttasks, "task");

            });
            project_users.forEach(async (el) => {
                let insertusers = await model.InsertUsers(el.name, el.email, el.budget_hrs, proj_id)
                console.log(insertusers, "user");

            });

            return res.send({
                result: true,
                message: "sucessfully added project details"
            })


        } else {
            return res.send({
                result: false,
                message: "failed to add project details"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}