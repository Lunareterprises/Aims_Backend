const model = require('../../model/purchase/vendorComments')


module.exports.CreateVendorComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { vendor_id, comment } = req.body

        if (!vendor_id || !comment) {
            return res.send({
                result: false,
                message: 'Vendor ID and comment are required'
            })
        }
        let checkVendor = await model.CheckVendor(vendor_id, u_id)
        if (checkVendor.length === 0) {
            return res.send({
                result: false,
                message: 'Vendor not found'
            })
        }
        let createComment = await model.CreateVendorComment(comment, vendor_id, u_id)
        if (createComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: 'Comment added successfully'
            })
        } else {
            return res.send({
                result: false,
                message: 'Failed to add comment'
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetVendorComments = async (req, res) => {
    try {
        let { u_id } = req.user
        let { vendor_id } = req.body
        if (!vendor_id) {
            return res.send({
                result: false,
                message: 'Vendor ID is required'
            })
        }
        let checkVendor = await model.CheckVendor(vendor_id, u_id)
        if (!checkVendor) {
            return res.send({
                result: false,
                message: 'Vendor not found'
            })
        }
        let vendorComments = await model.GetVendorComments(vendor_id, u_id)
        return res.send({
            result: true,
            data: vendorComments
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteVendorComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment_id, vendor_id } = req.body
        if (!comment_id || !vendor_id) {
            return res.send({
                result: false,
                message: 'Comment ID and vendor id is required'
            })
        }
        let checkVendor = await model.CheckVendor(vendor_id, u_id)
        if (checkVendor.length === 0) {
            return res.send({
                result: false,
                message: 'Vendor not found'
            })
        }
        let checkComment = await model.CheckComment(comment_id, vendor_id, u_id)
        if (checkComment.length === 0) {
            return res.send({
                result: false,
                message: 'Comment not found or you do not have permission to delete it'
            })
        }
        let deleteComment = await model.DeleteVendorComment(comment_id, vendor_id, u_id)
        if (deleteComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: 'Comment deleted successfully'
            })
        } else {
            return res.send({
                result: false,
                message: 'Failed to delete comment'
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.UpdateVendorComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment_id, vendor_id, comment } = req.body
        if (!comment_id || !vendor_id || !comment) {
            return res.send({
                result: false,
                message: 'Comment ID, vendor ID, and comment are required'
            })
        }
        let checkVendor = await model.CheckVendor(vendor_id, u_id)
        if (checkVendor.length === 0) {
            return res.send({
                result: false,
                message: 'Vendor not found'
            })
        }
        let checkComment = await model.CheckComment(comment_id, vendor_id, u_id)
        if (checkComment.length === 0) {
            return res.send({
                result: false,
                message: 'Comment not found or you do not have permission to update it'
            })
        }   
        let updateComment = await model.UpdateVendorComment(comment_id, vendor_id, comment, u_id)
        if (updateComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: 'Comment updated successfully'
            })
        } else {
            return res.send({
                result: false,
                message: 'Failed to update comment'
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}