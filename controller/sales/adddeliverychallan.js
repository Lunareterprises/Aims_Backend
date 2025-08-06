var model = require("../../model/sales/adddeliverychallan");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddDeliveryChallan = async (req, res) => {
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
            var { dc_customer_name, dc_customer_id, dc_delivery_challan_id, dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment, delivery_challan_items } = fields;

            if ( !dc_customer_name || !dc_customer_id || !dc_date || !dc_type) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }

            let adddeliverychallan = await model.AddDeliveryChallan(u_id, dc_customer_name, dc_customer_id, dc_delivery_challan_id,
                dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment);


            if (adddeliverychallan.affectedRows > 0) {

                var deliverychallan_id = adddeliverychallan.insertId
                console.log(deliverychallan_id, "cus_iddd");

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
                    // If delivery_challan_items is invalid, default to empty array
                    deliverychallanitems = [];
                }

                // Now `deliverychallanitems` will be an empty array if input is invalid or couldn't be parsed

                console.log(deliverychallanitems, "so_item");

                for (const el of deliverychallanitems) {
                    await model.InsertdeliverychallanItem(deliverychallan_id, el);
                }


                if (files.image) {
                    console.log(files, "filesssimage");


                    if (Array.isArray(files.image)) {

                        for (const file of files.image) {
                            var oldPath = file.filepath;
                            var newPath = process.cwd() + "/uploads/delivery_challan_docs/" + file.originalFilename;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            var imagepath = ("/uploads/delivery_challan_docs/" + file.originalFilename);
                            var Insertimages = await model.AddImagesQuery(deliverychallan_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add delivery challan document"
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
                        var Insertimages = await model.AddImagesQuery(deliverychallan_id, imagepath)
                        console.log(Insertimages);
                        if (Insertimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add delivery challan document"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "delivery challan added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "delivery challan added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add delivery challan"
                })
            }

        })
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
}; 