var model = require('../../model/purchase/deletevendor');

module.exports.DeleteVendors = async (req, res) => {
    try {
        var { u_id } = req.user
        var { vendor_id } = req.body;
        if (!vendor_id) {
            return res.send({
                result: false,
                message: "Vendor id is required."
            })
        }
        let checkVendors = await model.CheckVendors(vendor_id, u_id);
        if (checkVendors.length > 0) {
            let removeVendors = await model.RemoveVendors(vendor_id, u_id);
            if (removeVendors.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Vendors removed successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to remove Vendors"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Vendors does not exist"
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