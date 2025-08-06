var model = require('../../model/sales/editdeliverychallan')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditDeliveryChallan = async (req, res) => {
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

            var { dc_id, dc_customer_name, dc_customer_id, dc_delivery_challan_id, dc_reference,
                dc_date, dc_type, dc_customer_notes, dc_adjustment, delivery_challan_items } = fields;

            if (!dc_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckDeliveryChallanQuery(dc_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(dc_id);

                let condition = ``;

                if (dc_customer_name) {
                    if (condition == '') {
                        condition = `set dc_customer_name ='${dc_customer_name}' `
                    } else {
                        condition += `,dc_customer_name='${dc_customer_name}'`
                    }
                }
                if (dc_customer_id) {
                    if (condition == '') {
                        condition = `set dc_customer_id ='${dc_customer_id}' `
                    } else {
                        condition += `,dc_customer_id='${dc_customer_id}'`
                    }
                }
                if (dc_delivery_challan_id) {
                    if (condition == '') {
                        condition = `set dc_delivery_challan_id='${dc_delivery_challan_id}' `
                    } else {
                        condition += `,dc_delivery_challan_id='${dc_delivery_challan_id}'`
                    }
                }
                if (dc_reference) {
                    if (condition == '') {
                        condition = `set dc_reference ='${dc_reference}' `
                    } else {
                        condition += `,dc_reference='${dc_reference}'`
                    }
                }
                if (dc_date) {
                    if (condition == '') {
                        condition = `set dc_date ='${dc_date}' `
                    } else {
                        condition += `,dc_date='${dc_date}'`
                    }
                }
                if (dc_type) {
                    if (condition == '') {
                        condition = `set dc_type ='${dc_type}' `
                    } else {
                        condition += `,dc_type='${dc_type}'`
                    }
                }
                if (dc_customer_notes) {
                    if (condition == '') {
                        condition = `set dc_customer_notes ='${dc_customer_notes}' `
                    } else {
                        condition += `,dc_customer_notes='${dc_customer_notes}'`
                    }
                }
                if (dc_adjustment) {
                    if (condition == '') {
                        condition = `set dc_adjustment ='${dc_adjustment}' `
                    } else {
                        condition += `,dc_adjustment='${dc_adjustment}'`
                    }
                }




                if (condition !== '') {
                    var EditDeliveryChallan = await model.ChangeDeliveryChallan(condition, dc_id, u_id)
                }
                if (EditDeliveryChallan.affectedRows > 0) {

                    if (delivery_challan_items) {
                        let deliverychallanitems = [];

                        // Check if delivery_challan_items is defined, not null, and not "undefined" or empty string before parsing
                        if (delivery_challan_items && delivery_challan_items !== "undefined" && delivery_challan_items !== "") {
                            try {
                                deliverychallanitems = JSON.parse(delivery_challan_items);
                            } catch (e) {
                                console.error("Error parsing delivery_challan_items:", e);
                                // Handle the error, e.g., keep deliverychallanitems as an empty array
                                deliverychallanitems = [];
                            }
                        } else {
                            // If delivery_challan_items is invalid, default to an empty array
                            deliverychallanitems = [];
                        }

                        console.log(deliverychallanitems);

                        // let with_id = [];
                        // let without_id = [];

                        for (const item of deliverychallanitems) {
                            if (item.is_id) {
                                // with_id.push(item);
                                await model.UpdateDeliveryChallanItem(item, item.is_id, dc_id)

                            } else {
                                // without_id.push(item);
                                await model.InsertDeliveryChallanItem(dc_id, item);
                            }
                        }


                    }

                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    console.log(files_ids, "files_ids");
                    if (files_ids.length > 0) {
                        let deletefiles = await model.DeleteFilesQuery(dc_id, files_ids)
                    }


                    if (files.image) {
                        if (Array.isArray(files.image)) {

                            for (const file of files.image) {
                                var oldPath = file.filepath;
                                var newPath = process.cwd() + "/uploads/delivery_challan_docs/" + file.originalFilename;
                                let rawData = fs.readFileSync(oldPath);
                                fs.writeFileSync(newPath, rawData);
                                var imagepath = ("/uploads/delivery_challan_docs/" + file.originalFilename);
                                var Insertimages = await model.AddImagesQuery(dc_id, imagepath)
                                console.log(Insertimages);
                                if (Insertimages.affectedRows == 0) {
                                    return res.send({
                                        result: false,
                                        message: "failed to add Delivery Challan document"
                                    })
                                }

                            }
                        } else {
                            var oldPath = files.image.filepath;
                            var newPath = process.cwd() + "/uploads/delivery_challan_docs/" + files.image.originalFilename
                            let rawData = fs.readFileSync(oldPath);
                            // console.log(oldPath, "qqq");

                            fs.writeFileSync(newPath, rawData)
                            var imagepath = "/uploads/delivery_challan_docs/" + files.image.originalFilename
                            var Insertimages = await model.AddImagesQuery(dc_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add Delivery Challan document"
                                })
                            }
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Delivery Challan details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Delivery Challan details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Delivery Challan details does not exists"
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

