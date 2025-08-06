let model = require('../model/payment_received')
let formidable = require('formidable')
let fs = require('fs')
let path = require('path')


module.exports.CreatePaymentReceived = async (req, res) => {
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
            var { customer_id, amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, unpaid_items, total, amount_used, amount_refunded, amount_excess, notes, send_mail, email } = fields;
            if (!customer_id || !amount_received || !payment_date) {
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

            let createPaymentReceived = await model.CreatePaymentReceived(customer_id, amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes, u_id)
            if (createPaymentReceived.affectedRows > 0) {
                const parsedItem=JSON.parse(unpaid_items)
                if (parsedItem && parsedItem.length > 0) {
                    for (let item of parsedItem) {
                        const { invoice_id, amount } = item
                        let invoiceData = await model.CheckInvoice(invoice_id, customer_id, u_id)
                        if (invoiceData.length == 0) {
                            return res.send({
                                result: false,
                                message: "Invoice not found. Invalid invoice id."
                            })
                        }
                        await model.InsertPaymentReceivedItems(invoice_id, amount, createPaymentReceived.insertId)
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
                            await model.InsertFiles(filepath, createPaymentReceived.insertId);
                        } catch (err) {
                            console.error("Error saving image:", err);
                        }
                    }
                }
                return res.send({
                    result: true,
                    message: "Payment received added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add payment received"
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


module.exports.EditPaymentReceived = async (req, res) => {
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
            var { payment_received_id, amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, unpaid_items, total, amount_used, amount_refunded, amount_excess, notes, send_mail, email } = fields;
            if (!payment_received_id || !customer_id || !amount_received || !payment_date) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkPaymentReceived = await model.CheckPaymentReceived(payment_received_id, u_id)
            if (checkPaymentReceived.length === 0) {
                return res.send({
                    result: false,
                    message: "Payment received data not found."
                })
            }
            let customerData = await model.CheckCustomer(customer_id, u_id)
            if (customer_id && customerData.length === 0) {
                return res.send({
                    result: false,
                    message: "Customer data not found. Invalid customer id."
                })
            }

            let editPaymentReceived = await model.EditPaymentReceived(amount_received, bank_charges, payment_date, payment_number, payment_mode, deposit_to, reference, total, amount_used, amount_refunded, amount_excess, notes, payment_received_id)
            if (editPaymentReceived.affectedRows > 0) {
                if (unpaid_items && unpaid_items.length > 0) {
                    for (let item of unpaid_items) {
                        const { pri_id, invoice_id, amount } = item
                        let invoiceData = await model.CheckInvoice(invoice_id, customer_id, u_id)
                        if (invoiceData.length == 0) {
                            return res.send({
                                result: false,
                                message: "Invoice not found. Invalid invoice id."
                            })
                        }
                        if (pri_id) {
                            let checkPaymentReceivedItem = await model.CheckPaymentReceivedItem(pri_id, payment_received_id)
                            if (checkPaymentReceivedItem.length === 0) {
                                return res.send({
                                    result: false,
                                    message: "Payment received items not found"
                                })
                            }
                            await model.EditPaymentReceivedItems(pri_id, amount)
                        } else {
                            await model.InsertPaymentReceivedItems(invoice_id, amount)
                        }
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
                            await model.InsertFiles(filepath, editPaymentReceived.insertId);
                        } catch (err) {
                            console.error("Error saving image:", err);
                        }
                    }
                }
                return res.send({
                    result: true,
                    message: "Payment received added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add payment received"
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


module.exports.ListAllPaymentReceived = async (req, res) => {
    try {
        let { u_id } = req.user
        let payment_received = await model.ListAllPaymentReceived(u_id)
        if (payment_received.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: payment_received
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data",
                data: []
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSinglePaymentReceivedData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { payment_received_id } = req.body
        if (!payment_received_id) {
            return res.send({
                result: false,
                message: "Payment received id is requried"
            })
        }
        let payment_received = await model.CheckPaymentReceived(payment_received_id, u_id)
        if (payment_received.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully",
                data: payment_received
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data",
                data: []
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeletePaymentReceivedItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { payment_received_id, payment_received_item_id } = req.body
        if (!payment_received_id || !payment_received_item_id) {
            return res.send({
                result: false,
                message: "Payment received id and payment received item id is required"
            })
        }
        let checkPaymentReceived = await model.CheckPaymentReceived(payment_received_id, u_id)
        if (checkPaymentReceived.length === 0) {
            return res.send({
                result: false,
                message: "Payment received data not found."
            })
        }
        let checkPaymentReceivedItem = await model.CheckPaymentReceivedItem(payment_received_item_id, payment_received_id)
        if (checkPaymentReceivedItem.length === 0) {
            return res.send({
                result: false,
                message: "Payment received item data not found"
            })
        }
        let deletePaymentReceivedItem = await model.DeletePaymentReceivedItem(payment_received_item_id, payment_received_id)
        if (deletePaymentReceivedItem.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment recieved item deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete payment received item"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeletePaymentReceivedFile = async (req, res) => {
    try {
        let { u_id } = req.user
        let { payment_received_id, document_id } = req.body
        if (!payment_received_id || document_id) {
            return res.send({
                result: false,
                message: "Payment received id and document id is required"
            })
        }
        let checkPaymentReceived = await model.CheckPaymentReceived(payment_received_id, u_id)
        if (checkPaymentReceived.length === 0) {
            return res.send({
                result: false,
                message: "Payment received data not found"
            })
        }
        let checkDocument = await model.CheckPaymentDocument(payment_received_id, document_id)
        if (checkDocument.length === 0) {
            return res.send({
                result: false,
                message: "Payment received document not found."
            })
        }
        let deleteDocument = await model.DeletePaymentReceivedDocument(payment_received_id, document_id)
        if (deleteDocument.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment received document deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete payment received document"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeletePaymentReceived = async (req, res) => {
    try {
        let { u_id } = req.user
        let { payment_received_id } = req.body
        if (!payment_received_id) {
            return res.send({
                result: false,
                message: "Payment received id is required"
            })
        }
        let checkPaymentReceived = await model.CheckPaymentReceived(payment_received_id, u_id)
        if (checkPaymentReceived.length === 0) {
            return res.send({
                result: false,
                message: "Payment received data not found"
            })
        }
        let deletePaymentReceived = await model.DeletePaymentReceived(payment_received_id, u_id)
        if (deletePaymentReceived.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Payment received deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete payment received"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}