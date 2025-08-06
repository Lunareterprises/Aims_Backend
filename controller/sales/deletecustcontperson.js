var model = require('../../model/sales/deletecustcontperson');

module.exports.DeleteCustomerContactPerson = async (req, res) => {
    try {
        var { u_id } = req.user
        var { ccp_id } = req.body;
        if (!ccp_id) {
            return res.send({
                result: false,
                message: "Customer contact person id is required."
            })
        }
        let checkCustomer = await model.CheckCustomercontperson(ccp_id, u_id);
        if (checkCustomer.length > 0) {
            let removeCustomer = await model.RemoveCustomercontperson(ccp_id, u_id);
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