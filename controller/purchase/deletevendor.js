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
                await model.RemoveContactus(vendor_id);
                await model.RemoveVendorBankDetails(vendor_id);
                await model.RemoveVendorDocuments(vendor_id);
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


module.exports.DeleteVendorDocuments = async (req, res) => {
    try {
        let { u_id } = req.user;
        let { vendor_id, document_id } = req.body;
        if (!vendor_id || !document_id) {
            return res.send({
                result: false,
                message: "Vendor id and Document id are required."
            })
        }
        let checkVendor = await model.CheckVendors(vendor_id, u_id);
        if (checkVendor.length === 0) {
            return res.send({
                result: false,
                message: "Vendor does not exist."
            })
        }
        let checkDocument = await model.CheckVendorDocuments(document_id, vendor_id);
        if (checkDocument.length === 0) {
            return res.send({
                result: false,
                message: "Document does not exist."
            })
        }
        let deleteDocument = await model.DeleteVendorDocuments(document_id, vendor_id);
        if (deleteDocument.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Vendor document deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete vendor document."
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