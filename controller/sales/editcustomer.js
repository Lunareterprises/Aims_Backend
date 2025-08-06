var model = require('../../model/sales/editcustomer')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditCustomer = async (req, res) => {
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

            var { cu_id, cu_salutation, cu_first_name, cu_last_name, cu_company_name, cu_display_name, cu_email, cu_phone,
                cu_mobile, cu_pan_no, cu_opening_balance, cu_website, cu_designation, cu_department, cu_type,
                cu_currency, cu_payment_terms, cu_portal_language, cu_portal_access, cu_remarks,
                cu_b_addr_attention, cu_b_addr_country, cu_b_addr_address, cu_b_addr_city, cu_b_addr_state,
                cu_b_addr_pincode, cu_b_addr_phone, cu_b_addr_fax_number, cu_s_addr_attention, cu_s_addr_country,
                cu_s_addr_address, cu_s_addr_city, cu_s_addr_state, cu_s_addr_pincode, cu_s_addr_phone, cu_s_addr_fax_number,
                contact_person,cu_tax_treatment, cu_place_supply, cu_tax_preference } = fields;

            if (!cu_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckCustomerQuery(cu_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(cu_id);

                let condition = ``;

                if (cu_salutation) {
                    if (condition == '') {
                        condition = `set cu_salutation ='${cu_salutation}' `
                    } else {
                        condition += `,cu_salutation='${cu_salutation}'`
                    }
                }
                if (cu_first_name) {
                    if (condition == '') {
                        condition = `set cu_first_name ='${cu_first_name}' `
                    } else {
                        condition += `,cu_first_name='${cu_first_name}'`
                    }
                }
                if (cu_last_name) {
                    if (condition == '') {
                        condition = `set cu_last_name='${cu_last_name}' `
                    } else {
                        condition += `,cu_last_name='${cu_last_name}'`
                    }
                }
                if (cu_company_name) {
                    if (condition == '') {
                        condition = `set cu_company_name ='${cu_company_name}' `
                    } else {
                        condition += `,cu_company_name='${cu_company_name}'`
                    }
                }
                if (cu_display_name) {
                    if (condition == '') {
                        condition = `set cu_display_name ='${cu_display_name}' `
                    } else {
                        condition += `,cu_display_name='${cu_display_name}'`
                    }
                }
                if (cu_email) {
                    if (condition == '') {
                        condition = `set cu_email ='${cu_email}' `
                    } else {
                        condition += `,cu_email='${cu_email}'`
                    }
                }
                if (cu_phone) {
                    if (condition == '') {
                        condition = `set cu_phone ='${cu_phone}' `
                    } else {
                        condition += `,cu_phone='${cu_phone}'`
                    }
                }
                if (cu_mobile) {
                    if (condition == '') {
                        condition = `set cu_mobile ='${cu_mobile}' `
                    } else {
                        condition += `,cu_mobile='${cu_mobile}'`
                    }
                }
                if (cu_pan_no) {
                    if (condition == '') {
                        condition = `set cu_pan_no ='${cu_pan_no}' `
                    } else {
                        condition += `,cu_pan_no='${cu_pan_no}'`
                    }
                }
                if (cu_opening_balance) {
                    if (condition == '') {
                        condition = `set cu_opening_balance ='${cu_opening_balance}' `
                    } else {
                        condition += `,cu_opening_balance='${cu_opening_balance}'`
                    }
                }
                if (cu_website) {
                    if (condition == '') {
                        condition = `set cu_website ='${cu_website}' `
                    } else {
                        condition += `,cu_website='${cu_website}'`
                    }
                }
                if (cu_designation) {
                    if (condition == '') {
                        condition = `set cu_designation ='${cu_designation}' `
                    } else {
                        condition += `,cu_designation='${cu_designation}'`
                    }
                }
                if (cu_type) {
                    if (condition == '') {
                        condition = `set cu_type ='${cu_type}' `
                    } else {
                        condition += `,cu_type='${cu_type}'`
                    }
                }
                if (cu_department) {
                    if (condition == '') {
                        condition = `set cu_department ='${cu_department}' `
                    } else {
                        condition += `,cu_department='${cu_department}'`
                    }
                }
                if (cu_currency) {
                    if (condition == '') {
                        condition = `set cu_currency ='${cu_currency}' `
                    } else {
                        condition += `,cu_currency='${cu_currency}'`
                    }
                }
                if (cu_payment_terms) {
                    if (condition == '') {
                        condition = `set cu_payment_terms ='${cu_payment_terms}' `
                    } else {
                        condition += `,cu_payment_terms='${cu_payment_terms}'`
                    }
                }
                if (cu_portal_language) {
                    if (condition == '') {
                        condition = `set cu_portal_language ='${cu_portal_language}' `
                    } else {
                        condition += `,cu_portal_language='${cu_portal_language}'`
                    }
                }

                if (cu_portal_access) {
                    if (condition == '') {
                        condition = `set cu_portal_access ='${cu_portal_access}' `
                    } else {
                        condition += `,cu_portal_access='${cu_portal_access}'`
                    }
                }
                if (cu_remarks) {
                    if (condition == '') {
                        condition = `set cu_remarks ='${cu_remarks}' `
                    } else {
                        condition += `,cu_remarks='${cu_remarks}'`
                    }
                }
                if (cu_b_addr_attention) {
                    if (condition == '') {
                        condition = `set cu_b_addr_attention ='${cu_b_addr_attention}' `
                    } else {
                        condition += `,cu_b_addr_attention='${cu_b_addr_attention}'`
                    }
                }
                if (cu_b_addr_country) {
                    if (condition == '') {
                        condition = `set cu_b_addr_country ='${cu_b_addr_country}' `
                    } else {
                        condition += `,cu_b_addr_country='${cu_b_addr_country}'`
                    }
                }
                if (cu_b_addr_address) {
                    if (condition == '') {
                        condition = `set cu_b_addr_address ='${cu_b_addr_address}' `
                    } else {
                        condition += `,cu_b_addr_address='${cu_b_addr_address}'`
                    }
                }
                if (cu_b_addr_city) {
                    if (condition == '') {
                        condition = `set cu_b_addr_city ='${cu_b_addr_city}' `
                    } else {
                        condition += `,cu_b_addr_city='${cu_b_addr_city}'`
                    }
                }
                if (cu_b_addr_state) {
                    if (condition == '') {
                        condition = `set cu_b_addr_state ='${cu_b_addr_state}' `
                    } else {
                        condition += `,cu_b_addr_state='${cu_b_addr_state}'`
                    }
                }
                if (cu_b_addr_pincode) {
                    if (condition == '') {
                        condition = `set cu_b_addr_pincode ='${cu_b_addr_pincode}' `
                    } else {
                        condition += `,cu_b_addr_pincode='${cu_b_addr_pincode}'`
                    }
                }
                if (cu_b_addr_phone) {
                    if (condition == '') {
                        condition = `set cu_b_addr_phone ='${cu_b_addr_phone}' `
                    } else {
                        condition += `,cu_b_addr_phone='${cu_b_addr_phone}'`
                    }
                }
                if (cu_b_addr_fax_number) {
                    if (condition == '') {
                        condition = `set cu_b_addr_fax_number ='${cu_b_addr_fax_number}' `
                    } else {
                        condition += `,cu_b_addr_fax_number='${cu_b_addr_fax_number}'`
                    }
                }
                if (cu_s_addr_attention) {
                    if (condition == '') {
                        condition = `set cu_s_addr_attention ='${cu_s_addr_attention}' `
                    } else {
                        condition += `,cu_s_addr_attention='${cu_s_addr_attention}'`
                    }
                }
                if (cu_s_addr_country) {
                    if (condition == '') {
                        condition = `set cu_s_addr_country ='${cu_s_addr_country}' `
                    } else {
                        condition += `,cu_s_addr_country='${cu_s_addr_country}'`
                    }
                }
                if (cu_s_addr_address) {
                    if (condition == '') {
                        condition = `set cu_s_addr_address ='${cu_s_addr_address}' `
                    } else {
                        condition += `,cu_s_addr_address='${cu_s_addr_address}'`
                    }
                }
                if (cu_s_addr_city) {
                    if (condition == '') {
                        condition = `set cu_s_addr_city ='${cu_s_addr_city}' `
                    } else {
                        condition += `,cu_s_addr_city='${cu_s_addr_city}'`
                    }
                }
                if (cu_s_addr_state) {
                    if (condition == '') {
                        condition = `set cu_s_addr_state ='${cu_s_addr_state}' `
                    } else {
                        condition += `,cu_s_addr_state='${cu_s_addr_state}'`
                    }
                }
                if (cu_s_addr_pincode) {
                    if (condition == '') {
                        condition = `set cu_s_addr_pincode ='${cu_s_addr_pincode}' `
                    } else {
                        condition += `,cu_s_addr_pincode='${cu_s_addr_pincode}'`
                    }
                }
                if (cu_s_addr_phone) {
                    if (condition == '') {
                        condition = `set cu_s_addr_phone ='${cu_s_addr_phone}' `
                    } else {
                        condition += `,cu_s_addr_phone='${cu_s_addr_phone}'`
                    }
                }
                if (cu_s_addr_fax_number) {
                    if (condition == '') {
                        condition = `set cu_s_addr_fax_number ='${cu_s_addr_fax_number}' `
                    } else {
                        condition += `,cu_s_addr_fax_number='${cu_s_addr_fax_number}'`
                    }
                }
                if (cu_tax_treatment) {
                    if (condition == '') {
                        condition = `set cu_tax_treatment ='${cu_tax_treatment}' `
                    } else {
                        condition += `,cu_tax_treatment='${cu_tax_treatment}'`
                    }
                }
                if (cu_place_supply) {
                    if (condition == '') {
                        condition = `set cu_place_supply ='${cu_place_supply}' `
                    } else {
                        condition += `,cu_place_supply='${cu_place_supply}'`
                    }
                }
                if (cu_tax_preference) {
                    if (condition == '') {
                        condition = `set cu_tax_preference ='${cu_tax_preference}' `
                    } else {
                        condition += `,cu_tax_preference='${cu_tax_preference}'`
                    }
                }



                if (condition !== '') {
                    var EditCustomer = await model.ChangeCustomer(condition, cu_id, u_id)
                }
                if (EditCustomer.affectedRows > 0) {

                    if (contact_person) {
                        let contactPersons = [];

                        // Check if contact_person is defined, not null, and not "undefined" or empty string before parsing
                        if (contact_person && contact_person !== "undefined" && contact_person !== "") {
                            try {
                                contactPersons = JSON.parse(contact_person);
                            } catch (e) {
                                console.error("Error parsing contact_person:", e);
                                // Handle the error, e.g., keep contactPersons as an empty array
                            }
                        }

                        for (const person of contactPersons) {
                            if (person?.ccp_id) {
                                // with_id.push(person);
                                await model.UpdateContactPerson(person, person?.ccp_id, cu_id)
                            } else {
                                // without_id.push(person);
                                await model.InsertContactPerson(cu_id, person);
                            }
                        }
                    }
                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image');
                    if (files_ids.length > 0) {
                        let deletefiles = await model.DeleteFilesQuery(cu_id, files_ids)
                    }

                    if (files.image) {
                        if (Array.isArray(files.image)) {

                            for (const file of files.image) {
                                var oldPath = file.filepath;
                                var newPath = process.cwd() + "/uploads/customer_docs/" + file.originalFilename;
                                let rawData = fs.readFileSync(oldPath);
                                fs.writeFileSync(newPath, rawData);
                                var imagepath = ("/uploads/customer_docs/" + file.originalFilename);
                                var Insertimages = await model.AddImagesQuery(cu_id, imagepath)
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

                            fs.writeFileSync(newPath, rawData)
                            var imagepath = "/uploads/customer_docs/" + files.image.originalFilename
                            var Insertimages = await model.AddImagesQuery(cu_id, imagepath)
                            if (Insertimages.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: "failed to add customer document"
                                })
                            }
                        }
                    }
                    return res.send({
                        result: true,
                        message: "customer details updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update customer details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "customer details does not exists"
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

