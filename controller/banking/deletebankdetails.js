var model = require('../../model/banking/deletebankdetails');

module.exports.DeleteBankDetails = async (req, res) => {
    try {
        var { u_id } = req.user
        var { bd_id } = req.body;
        if(!bd_id){
            return res.send({
                result:false,
                message:"Bank id is required."
            })
        }
        let checkBankDetails = await model.CheckBankDetails(bd_id, u_id);
        if (checkBankDetails.length > 0) {
            let removeBankDetails = await model.RemoveBankDetails(bd_id, u_id);
            if (removeBankDetails.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "BankDetails removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to remove BankDetails"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "BankDetails does not exist"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};