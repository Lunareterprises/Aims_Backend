let model = require('../model/project')


module.exports.CreateProject = async (req, res) => {
    try {
        let { u_id } = req.user
        let { project_name, project_code, project_customer_id, project_billing_method, project_total_cost, project_description, project_cost_budget, project_revenue_budget, project_hours_budget_type, project_budget_hours, project_users, project_tasks, project_add_watchlist } = req.body
        if (!project_name || !project_customer_id || !project_billing_method) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let customerData = await model.CheckCustomer(project_customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkName = await model.CheckName(project_name, u_id, project_customer_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Project Name already exist."
            })
        }
        if (project_users && project_users.length > 0) {
            for (let user of project_users) {
                let { user_id } = user
                let userData = await model.CheckUser(user_id)
                if (userData.length === 0) {
                    return res.send({
                        result: false,
                        message: `User not found for id ${user_id}`
                    })
                }
            }
        }
        let createdProject = await model.CreateProject(project_name, project_code, project_customer_id, project_billing_method, project_total_cost, project_description, project_cost_budget, project_revenue_budget, project_hours_budget_type, project_budget_hours, project_add_watchlist, u_id)
        if (createdProject.affectedRows > 0) {
            for (let user of project_users) {
                let { user_id, budget_hours } = user
                let insertUser = await model.InsertProjectUser(createdProject.insertId, user_id, budget_hours)
                if (insertUser.affectedRows === 0) {
                    await model.DeleteProject(createdProject.insertId, u_id, project_customer_id)
                    return res.send({
                        result: false,
                        message: "Failed to create project users"
                    })
                }
            }
            if (project_tasks && project_tasks.length > 0) {
                for (let task of project_tasks) {
                    let { task_name, task_description, task_budget_hours } = task
                    let insertTask = await model.InsertProjectTask(task_name, task_description, task_budget_hours, createdProject.insertId)
                    if (insertTask.affectedRows === 0) {
                        await model.DeleteProject(createdProject.insertId, u_id, project_customer_id)
                        return res.send({
                            result: false,
                            message: "Failed to create project tasks"
                        })
                    }
                }
            }
            return res.send({
                result: true,
                message: "Project created succcessfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create project"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditProject = async (req, res) => {
    try {
        let { u_id } = req.user
        let { project_id, project_name, project_code, project_customer_id, project_billing_method, project_total_cost, project_description, project_cost_budget, project_revenue_budget, project_hours_budget_type, project_budget_hours, project_users, project_tasks, project_add_watchlist } = req.body
        if (!project_id || !project_name || !project_billing_method) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let checkProject = await model.CheckProject(project_id, u_id, project_customer_id)
        if (checkProject.length === 0) {
            return res.send({
                result: false,
                message: "Project not found."
            })
        }
        let checkName = await model.CheckName(project_name, u_id, project_customer_id)
        if (checkName.length > 0) {
            return res.send({
                result: false,
                message: "Project Name already exist."
            })
        }
        if (project_users && project_users.length > 0) {
            for (let user of project_users) {
                let { user_id } = user
                let userData = await model.CheckUser(user_id)
                if (userData.length === 0) {
                    return res.send({
                        result: false,
                        message: `User not found for id ${user_id}`
                    })
                }
            }
        }
        let editProject = await model.EditProject(project_id, project_name, project_code, project_billing_method, project_total_cost, project_description, project_cost_budget, project_revenue_budget, project_hours_budget_type, project_budget_hours, project_add_watchlist)
        if (editProject.affectedRows > 0) {
            for (let user of project_users) {
                let { project_user_id, user_id, budget_hours } = user
                if (project_user_id) {
                    let updateUser = await model.EditProjectUser(project_user_id, budget_hours)
                    if (updateUser.affectedRows === 0) {
                        return res.send({
                            result: false,
                            message: "Failed to update project users"
                        })
                    }
                } else {
                    let insertUser = await model.InsertProjectUser(project_id, user_id, budget_hours)
                    if (insertUser.affectedRows === 0) {
                        return res.send({
                            result: false,
                            message: "Failed to insert project users"
                        })
                    }
                }
            }
            if (project_tasks && project_tasks.length > 0) {
                for (let task of project_tasks) {
                    let { task_id, task_name, task_description, task_budget_hours } = task
                    if (task_id) {
                        let updateTask = await model.EditProjectTask(task_id, task_name, task_description, task_budget_hours)
                        if (updateTask.affectedRows === 0) {
                            return res.send({
                                result: false,
                                message: "Failed to update project task"
                            })
                        }
                    } else {
                        let insertTask = await model.InsertProjectTask(task_name, task_description, task_budget_hours, createdProject.insertId)
                        if (insertTask.affectedRows === 0) {
                            return res.send({
                                result: false,
                                message: "Failed to create project task"
                            })
                        }
                    }
                }
            }
            return res.send({
                result: true,
                message: "Project created succcessfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create project"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteProject = async (req, res) => {
    try {
        let { u_id } = req.user
        let { project_id, customer_id } = req.body
        if (!project_id || !customer_id) {
            return res.send({
                result: false,
                message: "project id and Customer id is required."
            })
        }
        let customerData = await model.CheckCustomer(project_customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkProject = await model.CheckProject(project_id, u_id, project_customer_id)
        if (checkProject.length === 0) {
            return res.send({
                result: false,
                message: "Project not found."
            })
        }
        let deleteProject = await model.DeleteProject(project_id, u_id, customer_id)
        if (deleteProject.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Project deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete project"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteProjectUser = async (req, res) => {
    try {
        let { u_id } = req.user
        let { project_id, customer_id, project_user_id } = req.body
        if (!project_id || !customer_id || !project_user_id) {
            return res.send({
                result: false,
                message: "Project id, Customer id and project user id are required."
            })
        }
        let customerData = await model.CheckCustomer(project_customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkProject = await model.CheckProject(project_id, u_id, project_customer_id)
        if (checkProject.length === 0) {
            return res.send({
                result: false,
                message: "Project not found."
            })
        }
        let checkProjectUser = await model.CheckProjectUser(project_user_id, project_id)
        if (checkProjectUser.length === 0) {
            return res.send({
                result: false,
                message: "Project user not found"
            })
        }
        let deleteProjectUser = await model.DeleteProjectUser(project_user_id, project_id)
        if (deleteProjectUser.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Successfully deleted project user"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete project user."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteProjectTask = async (req, res) => {
    try {
        let { u_id } = req.user
        let { project_id, customer_id, project_task_id } = req.body
        if (!project_id || !customer_id || !project_task_id) {
            return res.send({
                result: false,
                message: "Project id, Customer id and project task id are required."
            })
        }
        let customerData = await model.CheckCustomer(project_customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkProject = await model.CheckProject(project_id, u_id, project_customer_id)
        if (checkProject.length === 0) {
            return res.send({
                result: false,
                message: "Project not found."
            })
        }
        let checkTask = await model.CheckTask(task_id, project_id)
        if (checkTask.length === 0) {
            return res.send({
                result: false,
                message: "Task data not found."
            })
        }
        let deleteTask = await model.DeleteTask(task_id, project_id)
        if (deleteTask.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Task deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete task."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllProjects = async (req, res) => {
    try {
        let { u_id } = req.user
        let { customer_id } = req.body
        if (!customer_id) {
            return res.send({
                result: false,
                message: "Customer id is required"
            })
        }
        let projectData = await model.ListAllProjects(u_id, customer_id)
        if (projectData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: projectData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSingleProjectData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { customer_id, project_id } = req.body
        if (!customer_id || !project_id) {
            return res.send({
                result: false,
                message: "Customer id and project id is required"
            })
        }
        let customerData = await model.CheckCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found."
            })
        }
        let checkProject = await model.CheckProject(project_id, u_id, customer_id)
        if (checkProject.length === 0) {
            return res.send({
                result: false,
                message: "Project not found."
            })
        }
        let projectData = await model.GetProjectData(project_id, u_id, customer_id)
        if (projectData.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: projectData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}