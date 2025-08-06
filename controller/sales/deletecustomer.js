var model = require('../../model/sales/deletecustomer');

module.exports.DeleteCustomer = async (req, res) => {
    try {
        var { u_id } = req.user
        var { cust_id } = req.body;
        if(!cust_id){
            return res.send({
                result:false,
                message:"Customer id is required"
            })
        }
        let checkCustomer = await model.CheckCustomer(cust_id, u_id);
        if (checkCustomer.length > 0) {
            let removeCustomer = await model.RemoveCustomer(cust_id, u_id);
            if (removeCustomer.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Customer removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to remove Customer"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Customer does not exist"
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