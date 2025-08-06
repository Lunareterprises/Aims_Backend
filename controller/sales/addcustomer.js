var model = require("../../model/sales/addcustomer");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddCustomer = async (req, res) => {
    try {
        let { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { cu_salutation, cu_first_name, cu_last_name, cu_company_name, cu_display_name, cu_email, cu_phone, cu_mobile, cu_pan_no, cu_opening_balance, cu_website, cu_designation, cu_department, cu_type, cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
                cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state, cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country, cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone, cu_s_addr_fax_number, contact_person, cu_tax_treatment, cu_place_supply, cu_tax_preference } = fields;
            if (!cu_salutation || !cu_first_name || !cu_last_name || !cu_company_name || !cu_display_name || !cu_email || !cu_tax_treatment || !cu_place_supply || !cu_tax_preference) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkCust = await model.CheckCustomer(u_id, cu_email);
            if (checkCust.length > 0) {
                return res.send({
                    result: false,
                    message: "This email already registered with us "
                })
            }
            let addcustomer = await model.AddCustomer(u_id, cu_salutation, cu_first_name, cu_last_name, cu_company_name, cu_display_name, cu_email, cu_phone, cu_mobile, cu_pan_no, cu_opening_balance, cu_website, cu_designation, cu_department, cu_type, cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
                cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state, cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country, cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone, cu_s_addr_fax_number, cu_tax_treatment, cu_place_supply, cu_tax_preference);


            if (addcustomer.affectedRows > 0) {

                var customer_id = addcustomer.insertId
                console.log(customer_id, "cus_iddd");
                if (contact_person) {
                    const contactPersons = JSON.parse(contact_person);
                    console.log(contactPersons);

                    for (const el of contactPersons) {
                        await model.InsertContactPerson(customer_id, el);
                    }
                }


                if (files.image) {
                    console.log(files, "filesssimage");


                    if (Array.isArray(files.image)) {

                        for (const file of files.image) {
                            var oldPath = file.filepath;
                            var newPath = process.cwd() + "/uploads/customer_docs/" + file.originalFilename;
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            var imagepath = ("/uploads/customer_docs/" + file.originalFilename);
                            var Insertimages = await model.AddImagesQuery(customer_id, imagepath)
                            console.log(Insertimages);
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add customer document"
                                })
                            }

                        }
                    } else {
                        var oldPath = files.image.filepath;
                        var newPath = process.cwd() + "/uploads/customer_docs/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        // console.log(oldPath, "qqq");

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/customer_docs/" + files.image.originalFilename
                        var Insertimages = await model.AddImagesQuery(customer_id, imagepath)
                        console.log(Insertimages);
                        if (Insertimages.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: "failed to add customer document"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Customer added successfully"
                    })

                }
                return res.send({
                    result: true,
                    message: "Customer added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add customer"
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