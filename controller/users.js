let userModel = require('../model/users')



module.exports.users = async (req, res) => {
    try {
        let { u_id } = req.user
        let usersData = await userModel.users(u_id)
        return res.send({
            result: true,
            message: "Data retrived successfully",
            data: usersData
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}