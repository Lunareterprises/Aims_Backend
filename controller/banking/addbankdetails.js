var model = require('../../model/banking/addbankdetails')

module.exports.AddBankDetails = async (req, res) => {

    try {
        var { u_id } = req.user
        var { bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary } = req.body
        if (!bd_acc_type || !bd_acc_name || !bd_acc_currency) {
            return res.send({
                result: false,
                message: "File Upload Failed!",
                data: err,
            });
        }
        let insertbankdetails = await model.InsertBankDetailsQuery(u_id, bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary)
        if (insertbankdetails.affectedRows > 0) {
            return res.send({
                result: true,
                message: "successfully added bank details"
            })

        } else {
            return res.send({
                result: false,
                message: "failed to add bank details"
            })
        }

    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })

    }
}