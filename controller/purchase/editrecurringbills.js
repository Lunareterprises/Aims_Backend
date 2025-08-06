var model = require('../../model/purchase/editrecurringbills')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditRecurringBills = async (req, res) => {
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

            var { rb_id, rb_vendor_name, rb_vendor_id, rb_profile_name, rb_repeat_every, rb_start_date,
                rb_end_date, rb_never_expiry, rb_payment_terms, rb_discount, rb_discount_account_id,
                rb_discount_account_name, rb_tds_tax, rb_adjustment, rb_total_amount, rb_notes, recurring_bills_items } = fields;

            if (!rb_id) {
                return res.send({
                    result: false,
                    message: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckRecurringBillsQuery(rb_id, u_id)
            console.log(checkitem);

            if (checkitem.length > 0) {
                console.log(rb_id);

                let condition = ``;

                if (rb_vendor_name) {
                    if (condition == '') {
                        condition = `set rb_vendor_name ='${rb_vendor_name}' `
                    } else {
                        condition += `,rb_vendor_name='${rb_vendor_name}'`
                    }
                }
                if (rb_vendor_id) {
                    if (condition == '') {
                        condition = `set rb_vendor_id ='${rb_vendor_id}' `
                    } else {
                        condition += `,rb_vendor_id='${rb_vendor_id}'`
                    }
                }
                if (rb_profile_name) {
                    if (condition == '') {
                        condition = `set rb_profile_name='${rb_profile_name}' `
                    } else {
                        condition += `,rb_profile_name='${rb_profile_name}'`
                    }
                }
                if (rb_repeat_every) {
                    if (condition == '') {
                        condition = `set rb_repeat_every ='${rb_repeat_every}' `
                    } else {
                        condition += `,rb_repeat_every='${rb_repeat_every}'`
                    }
                }
                if (rb_start_date) {
                    if (condition == '') {
                        condition = `set rb_start_date ='${rb_start_date}' `
                    } else {
                        condition += `,rb_start_date='${rb_start_date}'`
                    }
                }
                if (rb_end_date) {
                    if (condition == '') {
                        condition = `set rb_end_date ='${rb_end_date}' `
                    } else {
                        condition += `,rb_end_date='${rb_end_date}'`
                    }
                }
                if (rb_never_expiry) {
                    if (condition == '') {
                        condition = `set rb_never_expiry ='${rb_never_expiry}' `
                    } else {
                        condition += `,rb_never_expiry='${rb_never_expiry}'`
                    }
                }
                if (rb_payment_terms) {
                    if (condition == '') {
                        condition = `set rb_payment_terms ='${rb_payment_terms}' `
                    } else {
                        condition += `,rb_payment_terms='${rb_payment_terms}'`
                    }
                }
                if (rb_discount) {
                    if (condition == '') {
                        condition = `set rb_discount ='${rb_discount}' `
                    } else {
                        condition += `,rb_discount='${rb_discount}'`
                    }
                }
                if (rb_discount_account_id) {
                    if (condition == '') {
                        condition = `set rb_discount_account_id ='${rb_discount_account_id}' `
                    } else {
                        condition += `,rb_discount_account_id='${rb_discount_account_id}'`
                    }
                }
                if (rb_discount_account_name) {
                    if (condition == '') {
                        condition = `set rb_discount_account_name ='${rb_discount_account_name}' `
                    } else {
                        condition += `,rb_discount_account_name='${rb_discount_account_name}'`
                    }
                }
                if (rb_tds_tax) {
                    if (condition == '') {
                        condition = `set rb_tds_tax ='${rb_tds_tax}' `
                    } else {
                        condition += `,rb_tds_tax='${rb_tds_tax}'`
                    }
                }
                if (rb_adjustment) {
                    if (condition == '') {
                        condition = `set rb_adjustment ='${rb_adjustment}' `
                    } else {
                        condition += `,rb_adjustment='${rb_adjustment}'`
                    }
                }
                if (rb_total_amount) {
                    if (condition == '') {
                        condition = `set rb_total_amount ='${rb_total_amount}' `
                    } else {
                        condition += `,rb_total_amount='${rb_total_amount}'`
                    }
                }
                if (rb_notes) {
                    if (condition == '') {
                        condition = `set rb_notes ='${rb_notes}' `
                    } else {
                        condition += `,rb_notes='${rb_notes}'`
                    }
                }



                if (condition !== '') {
                    var EditRecurringBills = await model.ChangeRecurringBills(condition, rb_id, u_id)
                }
                if (EditRecurringBills.affectedRows > 0) {

                    if (recurring_bills_items) {
                        let RecurringBillsitems = [];

                        // Check if recurring_bills_items is defined, not null, and not "undefined" or empty string before parsing
                        if (recurring_bills_items && recurring_bills_items !== "undefined" && recurring_bills_items !== "") {
                            try {
                                RecurringBillsitems = JSON.parse(recurring_bills_items);
                            } catch (e) {
                                console.error("Error parsing recurring_bills_items:", e);
                                // Handle the error, e.g., keep RecurringBillsitems as an empty array
                                RecurringBillsitems = [];
                            }
                        } else {
                            // If recurring_bills_items is invalid, default to an empty array
                            RecurringBillsitems = [];
                        }

                        console.log(RecurringBillsitems);

                        // let with_id = [];
                        // let without_id = [];

                        for (const item of RecurringBillsitems) {
                            if (item.is_id) {
                                // with_id.push(item);
                                await model.UpdateRecurringBillsItem(item, item.is_id, rb_id)

                            } else {
                                // without_id.push(item);
                                await model.InsertRecurringBillsItem(rb_id, item);
                            }
                        }


                    }
                    return res.send({
                        result: true,
                        message: "Recurring Bills details updated successfully"
                    })

                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Recurring Bills details"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Recurring Bills details does not exists"
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

