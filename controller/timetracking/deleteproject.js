var model = require('../../model//timetracking/deleteproject');

module.exports.DeleteProject = async (req, res) => {
    try {
        var { user_id } = req.headers

        var { proj_id } = req.body;
        let checkProject = await model.CheckProject(proj_id, user_id);
        if (checkProject.length > 0) {
            let removeProject = await model.RemoveProject(proj_id, user_id);
            if (removeProject.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Project removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to remove Project"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Project does not exist"
            })
        }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
};