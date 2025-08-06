var model = require("../model/invoice");
let moment = require('moment')
var formidable = require('formidable')
const ExcelJS = require('exceljs')
let fs = require('fs')
let path = require('path')
const { createPdfWithPuppeteer } = require("../util/pdfGeneration");

module.exports.createInvoice = async (req, res) => {
    try {
        let { u_id } = req.user
        let userData = await model.getUserDetails(u_id)
        if (userData.length === 0) {
            return res.send({
                result: false,
                message: "User not found"
            })
        }
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }

            let { customer_id, invoice_number, order_number, invoice_date, terms, due_date, account_receivable, sales_person, subject, customer_note, terms_condition, is_recurring, profile_name, repeat_every, start_on, ends_on, never_expires, payment_terms, account_receivable_sec, sub_total, total, discount, tax_rate, tax_type, adjustments, shippingCharge, items } = fields
            if (!customer_id || !items || items?.length === 0 || !sub_total || !total) {
                return res.send({
                    result: false,
                    message: "All field is required"
                })
            }
            let customerData = await model.getCustomerDetails(customer_id)
            if (customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer not found"
                })
            }

            var moddate = moment().format("DD_MM_YYYY_HH_MM_SS")
            var path1 = `${process.cwd()}/uploads/invoice/`;
            var path = `${process.cwd()}/uploads/invoice/${customerData[0]?.cu_display_name}_${moddate}.pdf`;

            let parsedItems = JSON.parse(items)

            if (!fs.existsSync(path1)) {
                fs.mkdirSync(path1, true);
            }

            var html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice ${customerData[0]?.cu_display_name}_${moddate}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .bill-from, .bill-to {
                        margin-bottom: 20px;
                    }
                    .notes {
                        margin-top: 20px;
                    }
                    .signature {
                        margin-top: 40px;
                        text-align: right;
                    }
                    .totals {
                        margin-top: 20px;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <h1>Invoice</h1>

                <div class="bill-to">
                    <h3>Bill From</h3>
                    <p><strong>Name:</strong> ${userData[0]?.u_name}</p>
                    <p><strong>Email:</strong> ${userData[0]?.u_email}</p>
                    <p><strong>Company:</strong> ${userData[0]?.u_company_name}</p>
                </div>


                <div class="bill-to">
                    <h3>Bill To</h3>
                    <p><strong>Name:</strong> ${customerData[0]?.cu_display_name}</p>
                    <p><strong>Email:</strong> ${customerData[0]?.cu_email}</p>
                    <p><strong>Billing Address:</strong> ${customerData[0]?.cu_b_addr_address}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price (${customerData[0]?.cu_currency})</th>
                            <th>Discount (${customerData[0]?.cu_currency})</th>
                            <th>Amount (${customerData[0]?.cu_currency})</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parsedItems?.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item?.name || "Item name"}</td>
                                <td>${item?.quantity}</td>
                                <td>${Number(item.rate)?.toFixed(2)}</td>
                                <td>${item.discount}</td>
                                <td>${Number((item.quantity * item.rate))?.toFixed(2)}</td>
                            </tr>
                        `
            ).join('')}
                    </tbody>
                </table>

                <div class="totals">
                    <p><strong>Sub Total:</strong> ${customerData[0]?.cu_currency} ${Number(sub_total).toFixed(2) ?? 0}</p>
                    <p><strong>Shipping charges :</strong> ${customerData[0]?.cu_currency} ${Number(shippingCharge).toFixed(2) ?? 0}</p>
                    <p><strong>Tax :</strong> ${customerData[0]?.cu_currency} ${Number(tax_rate).toFixed(2) ?? 0}</p>
                    <p><strong>Total:</strong> ${customerData[0]?.cu_currency} ${Number(total).toFixed(2) ?? 0}</p>
                </div>

                <div class="notes">
                    <h3>Notes</h3>
                    <p>Due Date: ${due_date}</p>
                    <p>Thank you for your business!</p>
                </div>

                <div class="signature">
                    <p>Authorized Signature ______</p>
                </div>
            </body>
            </html>
            `
            var pdf = await createPdfWithPuppeteer(html, path);
            const pdfpath = `${req.protocol + "://" + req.get("host") + path.replace(process.cwd(), '')}`
            let createdInvoice = await model.createInvoice(invoice_number, order_number, invoice_date, terms, due_date, account_receivable, sales_person, subject, customer_note, terms_condition, is_recurring, profile_name, repeat_every, start_on, ends_on, never_expires, payment_terms, account_receivable_sec, sub_total, total, discount, tax_rate, tax_type, adjustments, shippingCharge, customer_id, u_id, pdfpath)
            let errors = []
            let validItems = [];
            if (files.file) {
                const fileList = Array.isArray(files.file) ? files.file : [files.file];
                for (const fileObj of fileList) {
                    var date = moment().format('YYYY_MM_DD')
                    var oldPath1 = fileObj.filepath
                    let folderPath = `${process.cwd()}/uploads/invoice/files/`
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, true);
                    }
                    var newPath1 =
                        process.cwd() + "/uploads/invoice/files/" + date + '_' + fileObj.originalFilename.replace(' ', '_')
                    let rawData1 = fs.readFileSync(oldPath1);
                    fs.writeFileSync(newPath1, rawData1)
                    let imageUrl = "uploads/invoice/files/" + date + '_' + fileObj.originalFilename.replace(' ', '_')
                    await model.InsertFiles(imageUrl, createdInvoice.insertId)
                }
            }

            if (createdInvoice.affectedRows > 0) {
                try {
                    const itemPromises = parsedItems.map(async (item, index) => {
                        console.log("invoice item : ", item)
                        console.log("invoice  item condition : ", !item.item_id || !item.name || !item.description || !item.quantity || !item.rate || (!item.discount && item.discount !== 0) || !item.amount)
                        if (!item.item_id || !item.name || !item.description || !item.quantity || !item.rate || (!item.discount && item.discount !== 0) || !item.amount) {
                            errors.push(`Item at index ${index} doesn't have proper data`);
                            return null;
                        } else {
                            validItems.push(item);
                            return item;
                        }
                    });
                    await Promise.all(itemPromises);
                    if (errors.length > 0) {
                        return res.send({
                            result: false,
                            message: "Some items are invalid and failed validation",
                            errors,
                        });
                    }
                    for (const item of validItems) {
                        try {
                            let itemData = await model.InsertItems(
                                createdInvoice.insertId,
                                item.item_id,
                                item.name,
                                item.description,
                                item.quantity,
                                item.rate,
                                item.discount,
                                item.amount
                            );
                            if (itemData.affectedRows === 0) {
                                errors.push(`Failed to insert item with ID ${item.item_id}`);
                            }
                        } catch (error) {
                            errors.push(`Error inserting item with ID ${item.item_id}: ${error.message}`);
                        }
                    }
                    if (errors.length > 0) {
                        return res.send({
                            result: false,
                            message: "Some items failed to insert",
                            errors,
                        });
                    } else {
                        return res.send({
                            result: true,
                            message: "Created invoice and inserted all items successfully",
                            path: req.protocol + "://" + req.get("host") + path.replace(process.cwd(), ''),
                        });
                    }
                } catch (error) {
                    return res.send({
                        result: false,
                        message: "Error processing invoice or items",
                        error: error.message,
                    });
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to create invoice",
                });
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};


module.exports.listAllInvoice = async (req, res) => {
    try {
        let { u_id } = req.user
        let { status, customer_id } = req.body
        let condition = ``
        if (status) {
            if (condition == ``) {
                condition += `where i_status='${status}'`
            } else {
                condition += ` and i_status='${status}'`
            }
        }
        if (customer_id) {
            if (condition == ``) {
                condition += `where i_customer_id='${customer_id}'`
            } else {
                condition += ` and i_customer_id='${customer_id}'`
            }
        }
        if (condition == ``) {
            condition += `where i_user_id='${u_id}'`
        } else {
            condition += ` and i_user_id='${u_id}'`
        }
        let invoiceData = await model.listInvoices(condition)
        if (invoiceData.length > 0) {
            invoiceData.forEach(invoice => {
                if (invoice.items) {
                    invoice.items = JSON.parse(invoice.items);  // Convert string to JSON array
                }
            })
            return res.send({
                result: true,
                message: "Data Retrived successfully",
                data: invoiceData
            })
        } else {
            return res.send({
                result: false,
                message: "No data found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.listSingleInvoice = async (req, res) => {
    try {
        let { u_id } = req.user
        let { invoice_id } = req.body
        if (!invoice_id) {
            return res.send({
                result: false,
                message: "Invoice id is required"
            })
        }
        let invoiceData = await model.getSingleInvoice(invoice_id, u_id)
        if (invoiceData.length > 0) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: invoiceData
            })
        } else {
            return res.send({
                result: false,
                message: "No data found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.deleteInvoice = async (req, res) => {
    try {
        let { u_id } = req.user
        let { invoice_id } = req.body
        if (!invoice_id) {
            return res.send({
                result: false,
                message: "Invoice id is required"
            })
        }
        let invoiceData = await model.getSingleInvoice(invoice_id, u_id)
        if (invoiceData.length == 0) {
            return res.send({
                result: true,
                message: "No data Found",
            })
        }
        let deletedData = await model.deleteInvoice(invoice_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Deleted invoice successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete invoice"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.editInvoice = async (req, res) => {
    try {
        let { u_id } = req.user
        let userData = await model.getUserDetails(u_id)
        if (userData.length === 0) {
            return res.send({
                result: false,
                message: "User not found"
            })
        }
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }

            let { invoice_id, customer_id, invoice_number, order_number, invoice_date, terms, due_date, account_receivable, sales_person, subject, customer_note, terms_condition, is_recurring, profile_name, repeat_every, start_on, ends_on, never_expires, payment_terms, account_receivable_sec, sub_total, total, discount, tax_rate, tax_type, adjustments, shippingCharge, items } = fields
            if (!invoice_id || !customer_id || !items || items?.length === 0 || !sub_total || !total) {
                return res.send({
                    result: false,
                    message: "All field is required"
                })
            }
            let checkInvoice = await model.CheckInvoice(invoice_id, u_id)
            if (checkInvoice.length === 0) {
                return res.send({
                    result: false,
                    message: "Invoice data not found."
                })
            }
            let customerData = await model.getCustomerDetails(customer_id)
            if (customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer not found"
                })
            }

            var moddate = moment().format("DD_MM_YYYY_HH_MM_SS")
            var path1 = `${process.cwd()}/uploads/invoice/`;
            var path = `${process.cwd()}/uploads/invoice/${customerData[0]?.cu_display_name}_${moddate}.pdf`;

            let parsedItems = JSON.parse(items)

            if (!fs.existsSync(path1)) {
                fs.mkdirSync(path1, true);
            }

            var html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice ${customerData[0]?.cu_display_name}_${moddate}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .bill-from, .bill-to {
                        margin-bottom: 20px;
                    }
                    .notes {
                        margin-top: 20px;
                    }
                    .signature {
                        margin-top: 40px;
                        text-align: right;
                    }
                    .totals {
                        margin-top: 20px;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <h1>Invoice</h1>

                <div class="bill-to">
                    <h3>Bill From</h3>
                    <p><strong>Name:</strong> ${userData[0]?.u_name}</p>
                    <p><strong>Email:</strong> ${userData[0]?.u_email}</p>
                    <p><strong>Company:</strong> ${userData[0]?.u_company_name}</p>
                </div>


                <div class="bill-to">
                    <h3>Bill To</h3>
                    <p><strong>Name:</strong> ${customerData[0]?.cu_display_name}</p>
                    <p><strong>Email:</strong> ${customerData[0]?.cu_email}</p>
                    <p><strong>Billing Address:</strong> ${customerData[0]?.cu_b_addr_address}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price (${customerData[0]?.cu_currency})</th>
                            <th>Discount (${customerData[0]?.cu_currency})</th>
                            <th>Amount (${customerData[0]?.cu_currency})</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parsedItems?.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item?.name || "Item name"}</td>
                                <td>${item?.quantity}</td>
                                <td>${Number(item.rate)?.toFixed(2)}</td>
                                <td>${item.discount}</td>
                                <td>${Number((item.quantity * item.rate))?.toFixed(2)}</td>
                            </tr>
                        `
            ).join('')}
                    </tbody>
                </table>

                <div class="totals">
                    <p><strong>Sub Total:</strong> ${customerData[0]?.cu_currency} ${Number(sub_total).toFixed(2) ?? 0}</p>
                    <p><strong>Shipping charges :</strong> ${customerData[0]?.cu_currency} ${Number(shippingCharge).toFixed(2) ?? 0}</p>
                    <p><strong>Tax :</strong> ${customerData[0]?.cu_currency} ${Number(tax_rate).toFixed(2) ?? 0}</p>
                    <p><strong>Total:</strong> ${customerData[0]?.cu_currency} ${Number(total).toFixed(2) ?? 0}</p>
                </div>

                <div class="notes">
                    <h3>Notes</h3>
                    <p>Due Date: ${due_date}</p>
                    <p>Thank you for your business!</p>
                </div>

                <div class="signature">
                    <p>Authorized Signature ______</p>
                </div>
            </body>
            </html>
            `
            var pdf = await createPdfWithPuppeteer(html, path);
            const pdfpath = `${req.protocol + "://" + req.get("host") + path.replace(process.cwd(), '')}`
            let createdInvoice = await model.editInvoice("draft", invoice_id, invoice_date, terms, due_date, sales_person, subject, sub_total, shippingCharge, customer_note, tax_type, tax_rate, adjustments, total, items, customer_id, terms_condition, null, u_id, pdfpath)
            let errors = []
            let validItems = [];
            if (files.file) {
                const fileList = Array.isArray(files.file) ? files.file : [files.file];
                for (const fileObj of fileList) {
                    var date = moment().format('YYYY_MM_DD')
                    var oldPath1 = fileObj.filepath
                    let folderPath = `${process.cwd()}/uploads/invoice/files/`
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, true);
                    }
                    var newPath1 =
                        process.cwd() + "/uploads/invoice/files/" + date + '_' + fileObj.originalFilename.replace(' ', '_')
                    let rawData1 = fs.readFileSync(oldPath1);
                    fs.writeFileSync(newPath1, rawData1)
                    let imageUrl = "uploads/invoice/files/" + date + '_' + fileObj.originalFilename.replace(' ', '_')
                    await model.InsertFiles(imageUrl, createdInvoice.insertId)
                }
            }

            if (createdInvoice.affectedRows > 0) {
                try {
                    const itemPromises = parsedItems.map(async (item, index) => {
                        if (!item.item_id || !item.name || !item.description || !item.quantity || !item.rate || (!item.discount && item.discount !== 0) || !item.amount) {
                            errors.push(`Item at index ${index} doesn't have proper data`);
                            return null;
                        } else {
                            validItems.push(item);
                            return item;
                        }
                    });
                    await Promise.all(itemPromises);
                    if (errors.length > 0) {
                        return res.send({
                            result: false,
                            message: "Some items are invalid and failed validation",
                            errors,
                        });
                    }
                    for (const item of validItems) {
                        if (item.ii_id) {
                            await model.EditItems(
                                item.ii_id,
                                item.item_id,
                                item.name,
                                item.description,
                                item.quantity,
                                item.rate,
                                item.discount,
                                item.amount)
                        } else {
                            await model.InsertItems(
                                createdInvoice.insertId,
                                item.item_id,
                                item.name,
                                item.description,
                                item.quantity,
                                item.rate,
                                item.discount,
                                item.amount
                            );
                        }
                    }
                    return res.send({
                        result: true,
                        message: "Updated invoice and inserted all items successfully",
                        path: req.protocol + "://" + req.get("host") + path.replace(process.cwd(), ''),
                    });
                } catch (error) {
                    return res.send({
                        result: false,
                        message: "Error processing invoice or items",
                        error: error.message,
                    });
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to create invoice",
                });
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteInvoiceItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { invoice_id, ii_id } = req.body
        if (!invoice_id || !ii_id) {
            return res.send({
                result: false,
                message: "Invoice id and ii_id is required"
            })
        }
        let checkInvoice = await model.CheckInvoice(invoice_id, u_id)
        if (checkInvoice.length === 0) {
            return res.send({
                result: false,
                message: "Invoice data not found."
            })
        }
        let checkItem = await model.CheckItems(invoice_id, ii_id)
        if (checkItem.length === 0) {
            return res.send({
                result: false,
                message: "Invoice item not found."
            })
        }
        let deleteItem = await model.DeleteInvoiceItem(invoice_id, ii_id)
        if (deleteItem.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Invoice item deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete invoice item"
            })
        }
    } catch (error) {
        return req.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteInvoiceFile = async (req, res) => {
    try {
        let { u_id } = req.user
        let { invoice_id, sd_id } = req.body
        if (!invoice_id || !sd_id) {
            return res.send({
                result: false,
                message: "Invoice id and sd_id are required."
            })
        }
        let checkInvoice = await model.CheckInvoice(invoice_id, u_id)
        if (checkInvoice.length === 0) {
            return res.send({
                result: false,
                message: "Invoice data not found."
            })
        }
        let checkDocument = await model.CheckDocuments(invoice_id, sd_id)
        if (checkDocument.length === 0) {
            return res.send({
                result: false,
                message: "Invoice document data not found."
            })
        }
        let deleteDocument = await model.DeleteInvoiceDocument(invoice_id, sd_id)
        if (deleteDocument.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Invoice document deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete invoice document"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}



module.exports.ExportInvoiceList = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        let invoiceData = await model.listInvoices(u_id)
        if (!invoiceData || invoiceData.length === 0) {
            return res.send({
                result: false,
                message: "No inovice data found"
            })
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Invoice');
        const headers = [
            /* ─────────── Invoice header info ──────────────────────────────── */
            { header: 'Invoice Date', key: 'i_date', width: 18 },
            { header: 'Invoice ID', key: 'i_id', width: 14 },
            { header: 'Invoice Number', key: 'i_number', width: 16 },
            { header: 'Order Number', key: 'i_order_number', width: 16 },
            { header: 'Invoice Status', key: 'i_status', width: 14 },
            { header: 'Customer ID', key: 'i_customer_id', width: 14 },
            { header: 'Due Date', key: 'i_due_date', width: 18 },
            { header: 'Terms', key: 'i_terms', width: 14 },
            { header: 'Account Receivable', key: 'i_account_receivable', width: 20 },
            { header: 'Sales Person', key: 'i_sales_person', width: 18 },
            { header: 'Is Recurring', key: 'i_is_recurring', width: 14 },
            { header: 'Profile Name', key: 'i_profile_name', width: 18 },
            { header: 'Repeat Every', key: 'i_repeat_every', width: 16 },
            { header: 'Start On', key: 'i_start_on', width: 14 },
            { header: 'Ends On', key: 'i_ends_on', width: 14 },
            { header: 'Never Expires', key: 'i_never_expires', width: 14 },
            { header: 'SubTotal', key: 'i_sub_total', width: 14 },
            { header: 'Total', key: 'i_total', width: 14 },
            { header: 'Discount', key: 'i_discount', width: 14 },
            { header: 'Tax Rate', key: 'i_tax_rate', width: 14 },
            { header: 'Tax Type', key: 'i_tax_type', width: 14 },
            { header: 'Adjustment', key: 'i_adjustments', width: 14 },
            { header: 'Shipping Charge', key: 'i_shipping_charge', width: 18 },
            { header: 'Customer Note', key: 'i_customer_note', width: 28 },
            { header: 'Terms & Conditions', key: 'i_terms_condition', width: 28 },
            { header: 'Subject', key: 'i_subject', width: 22 },
            { header: 'Payment Terms', key: 'i_payment_terms', width: 18 },
            { header: 'Account Receivable Secondary', key: 'i_account_receivable_sec', width: 28 },

            /* ─────────── Customer info ────────────────────────────────────── */
            { header: 'Customer Name', key: 'customer_name', width: 24 },

            /* ─────────── PDF and creation info ────────────────────────────── */
            { header: 'PDF Link', key: 'i_pdf', width: 40 },
            { header: 'Created At', key: 'i_created_at', width: 22 },

            /* ─────────── Item details (if you have line items) ───────────── */
            // These would be similar to your quote items but prefixed with invoice
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
        // Add data rows
        invoiceData.forEach(row => {
            worksheet.addRow(row);
        });
        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'invoice');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `invoice_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `invoice_${timestamp}.csv`);
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