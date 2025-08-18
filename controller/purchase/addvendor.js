var model = require("../../model/purchase/addvendor");
var formidable = require("formidable");
var fs = require("fs");

module.exports.AddVendors = async (req, res) => {
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
            var { ve_salutation, ve_first_name, ve_last_name, ve_company_name, ve_display_name, ve_tax_treatment, ve_source_of_supply,
                ve_email, ve_phone, ve_mobile, ve_pan_no, ve_msme_reg, ve_currency, ve_opening_balance, ve_payment_terms,
                ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website, ve_remarks,
                ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, ve_b_addr_pincode,
                ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address, ve_s_addr_city,
                ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number, contact_persons, bank_details } = fields;
            if (!ve_salutation || !ve_first_name || !ve_last_name || !ve_company_name || !ve_display_name || !ve_email) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkvendor = await model.CheckVendor(u_id, ve_email);
            if (checkvendor.length > 0) {
                return res.send({
                    result: false,
                    message: "This email already registered with us "
                })
            }
            let addvendor = await model.AddVendor(u_id, ve_salutation, ve_first_name, ve_last_name, ve_company_name, ve_display_name,
                ve_email, ve_phone, ve_mobile, ve_pan_no, ve_msme_reg, ve_currency, ve_opening_balance, ve_payment_terms,
                ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website, ve_remarks,
                ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, ve_b_addr_pincode,
                ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address, ve_s_addr_city,
                ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number, ve_tax_treatment, ve_source_of_supply);


            if (addvendor.affectedRows > 0) {

                var vendor_id = addvendor.insertId
                console.log(vendor_id, "cus_iddd");

                let contactPersons = [];

                // Check if contact_persons is defined, not null, and not "undefined" or empty string before parsing
                if (contact_persons && contact_persons !== "undefined" && contact_persons !== "") {
                    try {
                        contactPersons = JSON.parse(contact_persons);
                    } catch (e) {
                        console.error("Error parsing contact_persons:", e);
                        // Handle the error, e.g., keep contactPersons as an empty array
                        contactPersons = [];
                    }
                } else {
                    // If contact_persons is invalid, default to empty array
                    contactPersons = [];
                }

                // Now `contactPersons` will be an empty array if input is invalid or couldn't be parsed
                for (const el of contactPersons) {
                    await model.InsertContactPerson(vendor_id, el);
                }

                var bankDetails = [];

                // Check if bank_details is defined, not null, and not an empty string or "undefined"
                if (bank_details && bank_details !== "undefined" && bank_details !== "") {
                    try {
                        bankDetails = JSON.parse(bank_details);
                    } catch (e) {
                        console.error("Error parsing bank_details:", e);
                        // Handle the error (e.g., set bankDetails to an empty array)
                        bankDetails = [];
                    }
                } else {
                    // If bank_details is invalid, default to an empty array
                    bankDetails = [];
                }

                // Now `bankDetails` will be an empty array if input is invalid or couldn't be parsed
                for (const el of bankDetails) {
                    await model.InserBankDetails(vendor_id, el);
                }


                if (files.image) {
                    const uploadDir = path.join(process.cwd(), "uploads", "vendor_docs");
                    // ✅ Ensure folder exists
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true }); // creates nested folders if needed
                    }

                    console.log(files, "filesssimage");

                    let images = Array.isArray(files.image) ? files.image : [files.image];

                    for (const file of images) {
                        try {
                            const oldPath = file.filepath;
                            const fileName = file.originalFilename;

                            const newPath = path.join(uploadDir, fileName);
                            const rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);

                            const imagePath = "/uploads/vendor_docs/" + fileName;

                            const insertResult = await model.AddImagesQuery(vendor_id, imagePath);
                            console.log(insertResult);

                            if (insertResult.affectedRows === 0) {
                                return res.send({
                                    result: false,
                                    message: "Failed to add vendor document."
                                });
                            }

                        } catch (err) {
                            console.error("File processing error:", err);
                            return res.status(500).send({
                                result: false,
                                message: "Server error while processing the file."
                            });
                        }
                    }
                }
                return res.send({
                    result: true,
                    message: "Vendor added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add Vendor"
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