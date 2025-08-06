var model = require('../../model/banking/editbankdetails')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditBnakDetails = async (req, res) => {
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
            var { bd_id, bd_acc_type, bd_acc_name, bd_acc_code, bd_acc_currency, bd_acc_number, bd_acc_bank_name, bd_acc_ifsc, bd_acc_description, bd_acc_primary } = fields
            if (!bd_id) {
                return res.send({
                    result: false,
                    messaage: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckBankDetailsQuery(bd_id, u_id)

            if (checkitem.length > 0) {

                let condition = ``;

                if (bd_acc_type) {
                    if (condition == '') {
                        condition = `set bd_acc_type ='${bd_acc_type}' `
                    } else {
                        condition += `,bd_acc_type='${bd_acc_type}'`
                    }
                }
                if (bd_acc_name) {
                    if (condition == '') {
                        condition = `set bd_acc_name ='${bd_acc_name}' `
                    } else {
                        condition += `,bd_acc_name='${bd_acc_name}'`
                    }
                }
                if (bd_acc_code) {
                    if (condition == '') {
                        condition = `set bd_acc_code='${bd_acc_code}' `
                    } else {
                        condition += `,bd_acc_code='${bd_acc_code}'`
                    }
                }
                if (bd_acc_currency) {
                    if (condition == '') {
                        condition = `set bd_acc_currency ='${bd_acc_currency}' `
                    } else {
                        condition += `,bd_acc_currency='${bd_acc_currency}'`
                    }
                }
                if (bd_acc_number) {
                    if (condition == '') {
                        condition = `set bd_acc_number ='${bd_acc_number}' `
                    } else {
                        condition += `,bd_acc_number='${bd_acc_number}'`
                    }
                }
                if (bd_acc_bank_name) {
                    if (condition == '') {
                        condition = `set bd_acc_bank_name ='${bd_acc_bank_name}' `
                    } else {
                        condition += `,bd_acc_bank_name='${bd_acc_bank_name}'`
                    }
                }
                if (bd_acc_ifsc) {
                    if (condition == '') {
                        condition = `set bd_acc_ifsc ='${bd_acc_ifsc}' `
                    } else {
                        condition += `,bd_acc_ifsc='${bd_acc_ifsc}'`
                    }
                }
                if (bd_acc_description) {
                    if (condition == '') {
                        condition = `set bd_acc_description ='${bd_acc_description}' `
                    } else {
                        condition += `,bd_acc_description='${bd_acc_description}'`
                    }
                }
                if (bd_acc_primary) {
                    if (condition == '') {
                        condition = `set bd_acc_primary ='${bd_acc_primary}' `
                    } else {
                        condition += `,bd_acc_primary='${bd_acc_primary}'`
                    }
                }


                if (condition !== '') {
                    var Editbankdetails = await model.ChangeBankDetails(condition, bd_id, u_id)
                }
                if (Editbankdetails) {


                    // if (files.image) {
                    //     var oldPath = files.image.filepath;
                    //     var newPath =
                    //         process.cwd() +
                    //         "/uploads/items/" + files.image.originalFilename
                    //     let rawData = fs.readFileSync(oldPath);
                    //     console.log(oldPath);

                    //     fs.writeFileSync(newPath, rawData)
                    //     var image = "/uploads/items/" + files.image.originalFilename

                    //     var Insertitemimage = await model.Updateimage(image, bd_id, user_id)
                    //     if (Insertitemimage.affectedRows) {
                    //         return res.send({
                    //             result: true,
                    //             message: "item updated successfully"
                    //         })
                    //     } else {
                    //         return res.send({
                    //             result: false,
                    //             message: "failed to update item"
                    //         })
                    //     }
                    // }
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
                    message: "bank details does not exists"
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

