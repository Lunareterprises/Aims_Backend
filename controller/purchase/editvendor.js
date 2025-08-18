var model = require('../../model//purchase/editvendor')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditVendor = async (req, res) => {
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

            var { ve_id, ve_salutation, ve_first_name, ve_last_name, ve_company_name, ve_display_name, ve_tax_treatment, ve_source_of_supply,
                ve_email, ve_phone, ve_mobile, ve_pan_no, ve_currency, ve_opening_balance, ve_payment_terms,
                ve_tds, ve_enable_portal, ve_portal_language, ve_department, ve_designation, ve_website, ve_remarks,
                ve_b_addr_attention, ve_b_addr_country, ve_b_addr_address, ve_b_addr_city, ve_b_addr_state, ve_b_addr_pincode,
                ve_b_addr_phone, ve_b_addr_fax_number, ve_s_addr_attention, ve_s_addr_country, ve_s_addr_address, ve_s_addr_city,
                ve_s_addr_state, ve_s_addr_pincode, ve_s_addr_phone, ve_s_addr_fax_number, contact_persons } = fields;

            if (!ve_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckVendorQuery(ve_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(ve_id);

                let condition = ``;
                if (ve_salutation) {
                    if (condition == '') {
                        condition = `set ve_salutation ='${ve_salutation}' `
                    } else {
                        condition += `,ve_salutation='${ve_salutation}'`
                    }
                }
                if (ve_first_name) {
                    if (condition == '') {
                        condition = `set ve_first_name ='${ve_first_name}' `
                    } else {
                        condition += `,ve_first_name='${ve_first_name}'`
                    }
                }
                if (ve_tax_treatment) {
                    if (condition == '') {
                        condition = `set ve_tax_treatment ='${ve_tax_treatment}' `
                    } else {
                        condition += `,ve_tax_treatment='${ve_tax_treatment}'`
                    }
                }
                if (ve_source_of_supply) {
                    if (condition == '') {
                        condition = `set ve_source_of_supply ='${ve_source_of_supply}' `
                    } else {
                        condition += `,ve_source_of_supply='${ve_source_of_supply}'`
                    }
                }
                if (ve_last_name) {
                    if (condition == '') {
                        condition = `set ve_last_name='${ve_last_name}' `
                    } else {
                        condition += `,ve_last_name='${ve_last_name}'`
                    }
                }
                if (ve_company_name) {
                    if (condition == '') {
                        condition = `set ve_company_name ='${ve_company_name}' `
                    } else {
                        condition += `,ve_company_name='${ve_company_name}'`
                    }
                }
                if (ve_display_name) {
                    if (condition == '') {
                        condition = `set ve_display_name ='${ve_display_name}' `
                    } else {
                        condition += `,ve_display_name='${ve_display_name}'`
                    }
                }
                if (ve_email) {
                    if (condition == '') {
                        condition = `set ve_email ='${ve_email}' `
                    } else {
                        condition += `,ve_email='${ve_email}'`
                    }
                }
                if (ve_phone) {
                    if (condition == '') {
                        condition = `set ve_phone ='${ve_phone}' `
                    } else {
                        condition += `,ve_phone='${ve_phone}'`
                    }
                }
                if (ve_mobile) {
                    if (condition == '') {
                        condition = `set ve_mobile ='${ve_mobile}' `
                    } else {
                        condition += `,ve_mobile='${ve_mobile}'`
                    }
                }
                if (ve_pan_no) {
                    if (condition == '') {
                        condition = `set ve_pan_no ='${ve_pan_no}' `
                    } else {
                        condition += `,ve_pan_no='${ve_pan_no}'`
                    }
                }
                if (ve_opening_balance) {
                    if (condition == '') {
                        condition = `set ve_opening_balance ='${ve_opening_balance}' `
                    } else {
                        condition += `,ve_opening_balance='${ve_opening_balance}'`
                    }
                }
                if (ve_website) {
                    if (condition == '') {
                        condition = `set ve_website ='${ve_website}' `
                    } else {
                        condition += `,ve_website='${ve_website}'`
                    }
                }
                if (ve_designation) {
                    if (condition == '') {
                        condition = `set ve_designation ='${ve_designation}' `
                    } else {
                        condition += `,ve_designation='${ve_designation}'`
                    }
                }

                if (ve_department) {
                    if (condition == '') {
                        condition = `set ve_department ='${ve_department}' `
                    } else {
                        condition += `,ve_department='${ve_department}'`
                    }
                }
                if (ve_currency) {
                    if (condition == '') {
                        condition = `set ve_currency ='${ve_currency}' `
                    } else {
                        condition += `,ve_currency='${ve_currency}'`
                    }
                }
                if (ve_payment_terms) {
                    if (condition == '') {
                        condition = `set ve_payment_terms ='${ve_payment_terms}' `
                    } else {
                        condition += `,ve_payment_terms='${ve_payment_terms}'`
                    }
                }
                if (ve_tds) {
                    if (condition == '') {
                        condition = `set ve_tds ='${ve_tds}' `
                    } else {
                        condition += `,ve_tds='${ve_tds}'`
                    }
                }
                if (ve_enable_portal) {
                    if (condition == '') {
                        condition = `set ve_enable_portal ='${ve_enable_portal}' `
                    } else {
                        condition += `,ve_enable_portal='${ve_enable_portal}'`
                    }
                }
                if (ve_portal_language) {
                    if (condition == '') {
                        condition = `set ve_portal_language ='${ve_portal_language}' `
                    } else {
                        condition += `,ve_portal_language='${ve_portal_language}'`
                    }
                }

                if (ve_remarks) {
                    if (condition == '') {
                        condition = `set ve_remarks ='${ve_remarks}' `
                    } else {
                        condition += `,ve_remarks='${ve_remarks}'`
                    }
                }
                if (ve_b_addr_attention) {
                    if (condition == '') {
                        condition = `set ve_b_addr_attention ='${ve_b_addr_attention}' `
                    } else {
                        condition += `,ve_b_addr_attention='${ve_b_addr_attention}'`
                    }
                }
                if (ve_b_addr_country) {
                    if (condition == '') {
                        condition = `set ve_b_addr_country ='${ve_b_addr_country}' `
                    } else {
                        condition += `,ve_b_addr_country='${ve_b_addr_country}'`
                    }
                }
                if (ve_b_addr_address) {
                    if (condition == '') {
                        condition = `set ve_b_addr_address ='${ve_b_addr_address}' `
                    } else {
                        condition += `,ve_b_addr_address='${ve_b_addr_address}'`
                    }
                }
                if (ve_b_addr_city) {
                    if (condition == '') {
                        condition = `set ve_b_addr_city ='${ve_b_addr_city}' `
                    } else {
                        condition += `,ve_b_addr_city='${ve_b_addr_city}'`
                    }
                }
                if (ve_b_addr_state) {
                    if (condition == '') {
                        condition = `set ve_b_addr_state ='${ve_b_addr_state}' `
                    } else {
                        condition += `,ve_b_addr_state='${ve_b_addr_state}'`
                    }
                }
                if (ve_b_addr_pincode) {
                    if (condition == '') {
                        condition = `set ve_b_addr_pincode ='${ve_b_addr_pincode}' `
                    } else {
                        condition += `,ve_b_addr_pincode='${ve_b_addr_pincode}'`
                    }
                }
                if (ve_b_addr_phone) {
                    if (condition == '') {
                        condition = `set ve_b_addr_phone ='${ve_b_addr_phone}' `
                    } else {
                        condition += `,ve_b_addr_phone='${ve_b_addr_phone}'`
                    }
                }
                if (ve_b_addr_fax_number) {
                    if (condition == '') {
                        condition = `set ve_b_addr_fax_number ='${ve_b_addr_fax_number}' `
                    } else {
                        condition += `,ve_b_addr_fax_number='${ve_b_addr_fax_number}'`
                    }
                }
                if (ve_s_addr_attention) {
                    if (condition == '') {
                        condition = `set ve_s_addr_attention ='${ve_s_addr_attention}' `
                    } else {
                        condition += `,ve_s_addr_attention='${ve_s_addr_attention}'`
                    }
                }
                if (ve_s_addr_country) {
                    if (condition == '') {
                        condition = `set ve_s_addr_country ='${ve_s_addr_country}' `
                    } else {
                        condition += `,ve_s_addr_country='${ve_s_addr_country}'`
                    }
                }
                if (ve_s_addr_address) {
                    if (condition == '') {
                        condition = `set ve_s_addr_address ='${ve_s_addr_address}' `
                    } else {
                        condition += `,ve_s_addr_address='${ve_s_addr_address}'`
                    }
                }
                if (ve_s_addr_city) {
                    if (condition == '') {
                        condition = `set ve_s_addr_city ='${ve_s_addr_city}' `
                    } else {
                        condition += `,ve_s_addr_city='${ve_s_addr_city}'`
                    }
                }
                if (ve_s_addr_state) {
                    if (condition == '') {
                        condition = `set ve_s_addr_state ='${ve_s_addr_state}' `
                    } else {
                        condition += `,ve_s_addr_state='${ve_s_addr_state}'`
                    }
                }
                if (ve_s_addr_pincode) {
                    if (condition == '') {
                        condition = `set ve_s_addr_pincode ='${ve_s_addr_pincode}' `
                    } else {
                        condition += `,ve_s_addr_pincode='${ve_s_addr_pincode}'`
                    }
                }
                if (ve_s_addr_phone) {
                    if (condition == '') {
                        condition = `set ve_s_addr_phone ='${ve_s_addr_phone}' `
                    } else {
                        condition += `,ve_s_addr_phone='${ve_s_addr_phone}'`
                    }
                }
                if (ve_s_addr_fax_number) {
                    if (condition == '') {
                        condition = `set ve_s_addr_fax_number ='${ve_s_addr_fax_number}' `
                    } else {
                        condition += `,ve_s_addr_fax_number='${ve_s_addr_fax_number}'`
                    }
                }


                if (condition !== '') {
                    var EditVendor = await model.ChangeVendor(condition, ve_id, u_id)
                }
                if (EditVendor.affectedRows > 0) {

                    if (contact_persons) {
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
                        for (const person of contactPersons) {
                            if (person.ccp_id) {
                                // with_id.push(person);
                                await model.UpdateContactPerson(person, person.ccp_id, ve_id)

                            } else {
                                // without_id.push(person);
                                await model.InsertContactPerson(ve_id, person);
                            }
                        }


                    }

                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    console.log(files_ids, "files_ids");
                    if (files_ids.length > 0) {

                        let deletefiles = await model.DeleteFilesQuery(ve_id, files_ids)
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
                        message: "Vendor details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Vendor details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Vendor details does not exists"
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
}

