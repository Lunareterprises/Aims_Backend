let model=require('../model/subuser')

module.exports.CreateSubUser = async (req, res) => {
    try {
        let { u_id } = req.user

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}