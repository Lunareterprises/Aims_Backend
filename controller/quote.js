let model = require('../model/quote')
let formidable = require('formidable')
const ExcelJS = require('exceljs')
let fs = require('fs')
const moment = require('moment');
let path = require('path')
let { explodeQuotes } = require('../util/quoteExports')

module.exports.CreateQuote = async (req, res) => {
    try {
        let { u_id } = req.user
        let form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { customer_id, number, reference, date, expiry_date, sales_person_id, project_id, supply_place, tax_treatment, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, items } = fields;
            if (!customer_id || !date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let customerData = await model.CheckCustomer(customer_id, u_id)
            if (customer_id && customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found. Invalid customer id."
                })
            }
            let salespersonData = await model.CheckSalesperson(sales_person_id, u_id)
            if (sales_person_id && salespersonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Sales person not found. Invalid sales person id."
                })
            }
            let projectData = await model.CheckProject(project_id, customer_id, u_id)
            if (project_id && projectData.length === 0) {
                return res.send({
                    result: false,
                    message: "Project data not found. Invalid project id."
                })
            }
            if (tcs_tds) {
                let TcsTdsData = await model.CheckTcsTds(tcs_tds_id, u_id, tcs_tds)
                if (TcsTdsData.length === 0) {
                    return res.send({
                        result: false,
                        message: `Tds/tcs data not found.`
                    })
                }
            }
            let createQuote = await model.CreateQuote(customer_id, supply_place, tax_treatment, number, reference, date, expiry_date, sales_person_id, project_id, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, u_id);
            if (createQuote.affectedRows > 0) {
                if (items && items.length > 0) {
                    for (let item of items) {
                        const { item_id, description, quantity, rate, discount, discount_type, tax_id, amount } = item
                        let itemData = await model.CheckItem(item_id, u_id)
                        if (itemData.length == 0) {
                            return res.send({
                                result: false,
                                message: "Item not found. Invalid item id."
                            })
                        }
                        if (tax_id) {
                            let taxData = await model.CheckTax(tax_id, u_id)
                            if (taxData.length === 0) {
                                return res.send({
                                    result: false,
                                    message: "Tax data not found."
                                })
                            }
                        }
                        await model.InsertItems(item_id, description, quantity, rate, discount, discount_type, tax_id, amount, createQuote.insertId)
                    }
                }
                if (files.file) {
                    const uploadDir = path.join(process.cwd(), 'uploads', 'files');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const filesArray = Array.isArray(files?.file) ? files?.file : [files?.file]; // normalize to array
                    for (let file of filesArray) {
                        const oldPath = file?.filepath;
                        const newPath = path.join(uploadDir, file?.originalFilename);
                        try {
                            const rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);
                            const filepath = "/uploads/files/" + file?.originalFilename;
                            await model.InsertFiles(filepath, createQuote.insertId);
                        } catch (err) {
                            console.error("Error saving image:", err);
                        }
                    }
                }
                return res.send({
                    result: true,
                    message: "Item Details added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Item Details"
                })
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.UpdateQuote = async (req, res) => {
    try {
        let { u_id } = req.user
        let form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { quote_id, customer_id, number, reference, date, expiry_date, sales_person_id, project_id, supply_place, tax_treatment, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, items } = fields;
            if (!quote_id || !customer_id || !date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let quoteData = await model.GetQuoteData(quote_id, u_id)
            if (quoteData.length === 0) {
                return res.send({
                    result: false,
                    message: "Quote data not found."
                })
            }
            let customerData = await model.CheckCustomer(customer_id, u_id)
            if (customer_id && customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found. Invalid customer id."
                })
            }
            let salespersonData = await model.CheckSalesperson(sales_person_id, u_id)
            if (sales_person_id && salespersonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Sales person not found. Invalid sales person id."
                })
            }
            let projectData = await model.CheckProject(project_id, customer_id, u_id)
            if (project_id && projectData.length === 0) {
                return res.send({
                    result: false,
                    message: "Project data not found. Invalid project id."
                })
            }
            if (tcs_tds) {
                let TcsTdsData = await model.CheckTcsTds(tcs_tds_id, u_id, tcs_tds)
                if (TcsTdsData.length === 0) {
                    return res.send({
                        result: false,
                        message: `${tcs_tds} data not found.`
                    })
                }
            }
            let updatedQuote = await model.UpdateQuote(supply_place, tax_treatment, number, reference, expiry_date, sales_person_id, project_id, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, quote_id);
            if (updatedQuote.affectedRows > 0) {
                if (items && items.length > 0) {
                    for (let item of items) {
                        const { qi_id, item_id, description, quantity, rate, discount, discount_type, tax_id, amount } = item
                        if (tax_id) {
                            let taxData = await model.CheckTax(tax_id, u_id)
                            if (taxData.length === 0) {
                                return res.send({
                                    result: false,
                                    message: "Tax data not found."
                                })
                            }
                        }
                        if (qi_id) {
                            let itemData = await model.CheckQuoteItem(qi_id, quote_id)
                            if (itemData.length === 0) {
                                return res.send({
                                    result: false,
                                    message: "Quote item not found."
                                })
                            }
                            let updatedData = await model.updateQuoteItem(description, quantity, rate, discount, discount_type, tax_id, amount, qi_id)
                            if (updatedData.affectedRows === 0) {
                                return res.send({
                                    result: false,
                                    message: "Failed to update quote item data."
                                })
                            }
                        } else {
                            let itemData = await model.CheckItem(item_id, u_id)
                            if (itemData.length == 0) {
                                return res.send({
                                    result: false,
                                    message: "Item not found. Invalid item id."
                                })
                            }
                        }
                        await model.InsertItems(item_id, description, quantity, rate, discount, discount_type, tax_id, amount, createQuote.insertId)
                    }
                }
                const uploadDir = path.join(process.cwd(), 'uploads', 'files');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const files = Array.isArray(files.file) ? files.file : [files.file]; // normalize to array
                for (let file of files) {
                    const oldPath = file?.filepath;
                    const newPath = path.join(uploadDir, file?.originalFilename);
                    try {
                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);
                        const filepath = "/uploads/files/" + file?.originalFilename;
                        await model.InsertFiles(filepath, createQuote.insertId);
                    } catch (err) {
                        console.error("Error saving image:", err);
                    }
                }
                return res.send({
                    result: true,
                    message: "Item Details added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Item Details"
                })
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListAllQuotes = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_id } = req.body
        let quoteData = await model.GetQuoteData(quote_id, u_id)
        if (quote_id && quoteData.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let allQuotes = await model.ListAllQuotes(u_id, quote_id)
        if (allQuotes.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: allQuotes
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteQuote = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_id } = req.body
        if (!quote_id) {
            return res.send({
                result: false,
                message: "Quote id is required."
            })
        }
        let quoteData = await model.GetQuoteData(quote_id, u_id)
        if (quoteData.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let deletedData = await model.DeleteQuote(quote_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Quote deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Quote"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteQuoteItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_item_id, quote_id } = req.body
        if (!quote_item_id || !quote_id) {
            return res.send({
                result: false,
                message: "Quote id and Quote item id is required."
            })
        }
        let quoteData = await model.GetQuoteData(quote_id, u_id)
        if (quoteData.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let quoteItemData = await model.CheckQuoteItem(quote_item_id, quote_id)
        if (quoteItemData.length === 0) {
            return res.send({
                result: false,
                message: "Quote item not found."
            })
        }
        let deletedItem = await model.DeleteQuoteItem(quote_item_id, quote_id)
        if (deletedItem.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Quote item deleted successfuly."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete quote item."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteQuoteFile = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_file_id, quote_id } = req.body
        if (!quote_file_id || !quote_id) {
            return res.send({
                result: false,
                message: "Quote id and quote file id are required."
            })
        }
        let quoteData = await model.GetQuoteData(quote_id, u_id)
        if (quoteData.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let fileData = await model.GetFileData(quote_file_id, quote_id)
        if (fileData.length === 0) {
            return res.send({
                result: false,
                message: "File data not found."
            })
        }
        let deleteFile = await model.DeleteQuoteFile(quote_file_id, quote_id)
        if (deleteFile.affectedRows > 0) {
            return res.send({
                result: true,
                message: "File deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete file."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.CreateQuoteComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment, quote_id } = req.body
        if (!comment || !quote_id) {
            return res.send({
                result: false,
                message: "Comment and quote id is required"
            })
        }
        let checkQuote = await model.GetQuoteData(quote_id, u_id)
        if (checkQuote.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found"
            })
        }
        let createComment = await model.CreateComment(comment, quote_id)
        if (createComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Quote comment created successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create quote comment ."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditQuoteComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { qc_id, comment } = req.body
        if (!qc_id || !comment) {
            return res.send({
                result: false,
                message: "Quote comment id and comment is required"
            })
        }
        let checkComment = await model.CheckComment(qc_id)
        if (checkComment.length === 0) {
            return res.send({
                result: false,
                message: "Comment data not found"
            })
        }
        let updateComment = await model.UpdateComment(qc_id, comment)
        if (updateComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Comment updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update comment"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListQuoteComments = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_id } = req.body
        if (!quote_id) {
            return res.send({
                result: false,
                message: "Quote id is required"
            })
        }
        let checkQuote = await model.GetQuoteData(quote_id, u_id)
        if (checkQuote.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let quoteComments = await model.ListQuoteComments(quote_id)
        if (quoteComments) {
            return res.send({
                result: true,
                message: "Data retreived successfully",
                data: quoteComments
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retreive data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteQuoteComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { quote_id, quote_comment_id } = req.body
        if (!quote_comment_id || !quote_id) {
            return res.send({
                result: false,
                message: "Quote id and quote comment id is required"
            })
        }
        let checkQuote = await model.GetQuoteData(quote_id, u_id)
        if (checkQuote.length === 0) {
            return res.send({
                result: false,
                message: "Quote data not found."
            })
        }
        let quoteComments = await model.CheckQuoteComment(quote_id, quote_comment_id)
        if (quoteComments.length === 0) {
            return res.send({
                result: false,
                message: "Quote comment not found"
            })
        }
        let deleteComment = await model.DeleteQuoteComment(quote_comment_id)
        if (deleteComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Quote comment deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete quote comment"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ExportQuotesList = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        let quoteData = await model.ListAllQuotes(u_id)
        if (!quoteData || quoteData.length === 0) {
            return res.send({
                result: false,
                message: "No quote data found"
            })
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Quote');
        // quoteColumns.js  (or inline above the handler)
        const headers = [
            /* ─────────── Quote header info ──────────────────────────────── */
            { header: 'Quote Date', key: 'q_date', width: 18 },
            { header: 'Quote ID', key: 'q_id', width: 14 },
            { header: 'Quote Number', key: 'q_no', width: 16 },
            { header: 'Quote Status', key: 'q_status', width: 14 },
            { header: 'Customer ID', key: 'q_c_id', width: 14 },
            { header: 'Expiry Date', key: 'q_expiry_date', width: 18 },
            { header: 'PurchaseOrder', key: 'q_p_id', width: 18 },
            { header: 'Currency Code', key: 'q_currency', width: 14 },   // ← add this field in query if missing
            { header: 'Exchange Rate', key: 'q_exchange_rate', width: 14 },
            { header: 'Discount Type', key: 'q_discount_type', width: 18 },
            { header: 'Is Discount Before Tax', key: 'q_is_disc_before_tax', width: 22 },
            { header: 'Entity Discount Percent', key: 'q_discount_percent', width: 22 },
            { header: 'Is Inclusive Tax', key: 'q_is_inclusive_tax', width: 18 },
            { header: 'SubTotal', key: 'q_sub_total', width: 14 },
            { header: 'Total', key: 'q_total', width: 14 },
            { header: 'Adjustment', key: 'q_adjustment', width: 14 },
            { header: 'Notes', key: 'q_notes', width: 28 },
            { header: 'Terms & Conditions', key: 'q_terms_c', width: 28 },
            { header: 'Subject', key: 'q_subject', width: 22 },

            /* ─────────── Customer / project / sales ─────────────────────── */
            { header: 'Customer Name', key: 'cu_display_name', width: 24 },
            { header: 'Project Name', key: 'prj_name', width: 22 },
            { header: 'Project ID', key: 'q_p_id', width: 14 },
            { header: 'Sales person', key: 'sp_name', width: 22 },

            /* ─────────── Billing address ────────────────────────────────── */
            { header: 'Billing Address', key: 'q_b_addr', width: 28 },
            { header: 'Billing City', key: 'q_b_city', width: 18 },
            { header: 'Billing State', key: 'q_b_state', width: 18 },
            { header: 'Billing Country', key: 'q_b_country', width: 18 },
            { header: 'Billing Code', key: 'q_b_code', width: 14 },
            { header: 'Billing Fax', key: 'q_b_fax', width: 18 },

            /* ─────────── Misc quote-level details ───────────────────────── */
            { header: 'Template Name', key: 'q_template', width: 22 },
            { header: 'Adjustment Description', key: 'q_adj_desc', width: 24 },
            { header: 'Estimate Level Tax Exemption Reason', key: 'q_tax_exempt_reason', width: 30 },
            { header: 'Estimate Level Tax Type', key: 'q_tax_type', width: 20 },
            { header: 'Estimate Level Tax', key: 'q_tax_amount', width: 18 },
            { header: 'Estimate Level Tax %', key: 'q_tax_percent', width: 18 },

            /* ─────────── Shipping address ───────────────────────────────── */
            { header: 'Shipping Address', key: 'q_s_addr', width: 28 },
            { header: 'Shipping City', key: 'q_s_city', width: 18 },
            { header: 'Shipping State', key: 'q_s_state', width: 18 },
            { header: 'Shipping Country', key: 'q_s_country', width: 18 },
            { header: 'Shipping Code', key: 'q_s_code', width: 14 },
            { header: 'Shipping Fax', key: 'q_s_fax', width: 18 },

            /* ─────────── Meta / sync info ───────────────────────────────── */
            { header: 'Source', key: 'q_source', width: 14 },
            { header: 'Reference ID', key: 'q_reference', width: 20 },
            { header: 'Last Sync Time', key: 'q_updated_at', width: 22 },
            { header: 'VAT Treatment', key: 'q_tax_treatment', width: 18 },
            { header: 'Place Of Supply', key: 'q_place_supply', width: 18 },
            { header: 'Tax Registration Number', key: 'q_pan_no', width: 20 },
            { header: 'Entity Discount Amount', key: 'q_discount', width: 22 },
            { header: 'Shipping Charge', key: 'q_shipping_charges', width: 18 },

            /* ─────────── FIRST “item” line (flat export) ────────────────── */
            /* If you’re flattening only ONE item per row, map like so.  
               If you want ALL items, export them in a separate sheet or
               pre-explode rows in SQL/JS. */
            { header: 'Item Name', key: 'item_name', width: 24 },
            { header: 'Item Desc', key: 'item_desc', width: 28 },
            { header: 'Quantity', key: 'item_qty', width: 12 },
            { header: 'Discount', key: 'item_discount_type', width: 14 },
            { header: 'Discount Amount', key: 'item_discount_amount', width: 18 },
            { header: 'Item Tax Amount', key: 'item_tax_amount', width: 18 },
            { header: 'Item Total', key: 'item_total', width: 18 },
            { header: 'Non Taxable Amount', key: 'item_non_taxable_amount', width: 22 },
            { header: 'Product ID', key: 'item_product_id', width: 16 },
            { header: 'Account', key: 'item_account', width: 18 },
            { header: 'SKU', key: 'item_sku', width: 18 },
            { header: 'UPC', key: 'item_upc', width: 18 },
            { header: 'MPN', key: 'item_mpn', width: 18 },
            { header: 'EAN', key: 'item_ean', width: 18 },
            { header: 'ISBN', key: 'item_isbn', width: 18 },
            { header: 'Usage unit', key: 'item_unit', width: 14 },
            { header: 'Item Price', key: 'item_price', width: 14 },
        ];
        worksheet.columns = headers;
        const updatedData = explodeQuotes(quoteData)
        // Add data rows
        updatedData.forEach(row => {
            worksheet.addRow(row);
        });
        // console.log(JSON.stringify(quoteData))
        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'quotes');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `quotes_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `quotes_${timestamp}.csv`);
            await workbook.csv.writeFile(returnPath);
        }
        return res.send({
            result: true,
            message: "Data exported successfully.",
            file: req.protocol + "://" + req.get("host") + returnPath.replace(process.cwd(), '')
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}