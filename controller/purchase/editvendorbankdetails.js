var model = require('../../model/purchase/editvendorbankdetails')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditVendorBankDetails = async (req, res) => {
    try {
        var { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { ve_id, vbd_id, vbd_acc_name, vbd_bank_name, vbd_acc_number, vbd_ifsc_code } = fields
            if ( !vbd_id || !ve_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkvendor = await model.CheckVendorQuery(ve_id, u_id)
            if (checkvendor.length > 0) {
                var checkvendorbank = await model.CheckVendorBankDetailsQuery(vbd_id, ve_id)

                if (checkvendorbank.length > 0) {

                    let condition = ``;

                    if (vbd_acc_name) {
                        if (condition == '') {
                            condition = `set vbd_acc_name ='${vbd_acc_name}' `
                        } else {
                            condition += `,vbd_acc_name='${vbd_acc_name}'`
                        }
                    }
                    if (vbd_bank_name) {
                        if (condition == '') {
                            condition = `set vbd_bank_name ='${vbd_bank_name}' `
                        } else {
                            condition += `,vbd_bank_name='${vbd_bank_name}'`
                        }
                    }
                    if (vbd_acc_number) {
                        if (condition == '') {
                            condition = `set vbd_acc_number='${vbd_acc_number}' `
                        } else {
                            condition += `,vbd_acc_number='${vbd_acc_number}'`
                        }
                    }
                    if (vbd_ifsc_code) {
                        if (condition == '') {
                            condition = `set vbd_ifsc_code ='${vbd_ifsc_code}' `
                        } else {
                            condition += `,vbd_ifsc_code='${vbd_ifsc_code}'`
                        }
                    }


                    if (condition !== '') {
                        var Editbankdetails = await model.ChangeVendorBankDetails(condition, vbd_id, ve_id)
                    }
                    if (Editbankdetails.affectedRows) {

                        return res.send({
                            result: true,
                            message: "bank details updated successfully"
                        })
                    } else {
                        return res.send({
                            result: false,
                            message: "failed to update bank details"
                        })
                    }
                } else {
                    return res.send({
                        result: false,
                        message: "vendor bank details does not exists"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "vendor details not found"
                })
            }
        })

    } catch
    (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })

    }
}

