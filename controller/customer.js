let model = require('../model/customer')
const ExcelJS = require('exceljs');
const path = require('path')
const moment = require('moment');
const fs = require('fs')

module.exports.CreateComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment, customer_id } = req.body
        if (!comment || !customer_id) {
            return res.send({
                result: false,
                message: "Customer id and comment is required."
            })
        }
        let customerData = await model.GetCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found. Invalid customer id."
            })
        }
        let commented = await model.CreateComment(comment, customer_id, u_id)
        if (commented.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Comment added successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to add comment."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { customer_id } = req.body
        if (!customer_id) {
            return res.send({
                result: false,
                message: "Customer id is required."
            })
        }
        let customerData = await model.GetCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found. Invalid customer id."
            })
        }
        let comments = await model.ListComments(customer_id, u_id)
        if (comments.length > 0) {
            return res.send({
                result: true,
                message: "Data found",
                data: comments
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

module.exports.EditComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment_id, customer_id, comment } = req.body
        if (!comment_id || !customer_id || !comment) {
            return res.send({
                result: false,
                message: "Comment id, customer id and comment is required."
            })
        }
        let customerData = await model.GetCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found. Invalid customer id."
            })
        }
        let commentData = await model.CheckComment(comment_id, customer_id, u_id)
        if (commentData.length === 0) {
            return res.send({
                result: false,
                message: "Comment not found."
            })
        }
        let updatedComment = await model.EditComment(comment_id, comment)
        if (updatedComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Comment updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update comment."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteComment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment_id, customer_id } = req.body
        if (!comment_id || !customer_id) {
            return res.send({
                result: false,
                message: "Customer id and comment id is required."
            })
        }
        let customerData = await model.GetCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found. Invalid customer id."
            })
        }
        let commentData = await model.CheckComment(comment_id, customer_id, u_id)
        if (commentData.length === 0) {
            return res.send({
                result: false,
                message: "Comment not found."
            })
        }
        let deletedComment = await model.DeleteComment(comment_id, u_id)
        if (deletedComment.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Comment deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete comment."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetCommentData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { comment_id, customer_id } = req.body
        if (!comment_id || !customer_id) {
            return res.send({
                result: false,
                message: "Comment id and customer id is required."
            })
        }
        let customerData = await model.GetCustomer(customer_id, u_id)
        if (customerData.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found. Invalid customer id."
            })
        }
        let commentData = await model.CheckComment(comment_id, customer_id, u_id)
        if (commentData.length === 0) {
            return res.send({
                result: false,
                message: "Comment not found."
            })
        } else {
            return res.send({
                result: true,
                message: "Data found successfully.",
                data: commentData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.UpdateCustomerStatus = async (req, res) => {
    try {
        let { u_id } = req.user
        let { customer_id } = req.body
        if (!customer_id) {
            return res.send({
                result: false,
                message: "Customer id is requried"
            })
        }
        let checkCustomer = await model.GetCustomer(customer_id, u_id)
        if (checkCustomer.length === 0) {
            return res.send({
                result: false,
                message: "Customer data not found"
            })
        }
        let status = checkCustomer[0]?.cu_status === "active" ? "inactive" : "active"
        let updateStatus = await model.UpdateStatus(customer_id, status)
        if (updateStatus.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Customer status updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update customer status"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ExportCustomerList = async (req, res) => {
    try {
        let { u_id } = req.user
        let { type } = req.body
        if (!type || (type !== "xlsx" && type !== "csv")) {
            return res.send({
                result: false,
                message: "Type is required and must be xlsx or csv"
            })
        }
        let customerData = await model.ListAllCustomers(u_id)
        if (!customerData || customerData.length === 0) {
            return res.send({
                result: false,
                message: "No customer data found"
            });
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Customers');

        // Set headers from keys
        // 👇🏽 define ONE TIME, outside the handler if you like
        const headers = [
            // ─── Core details ───────────────────────────────────────────────
            { header: 'Display Name', key: 'cu_display_name', width: 25 },
            { header: 'Company Name', key: 'cu_company_name', width: 25 },
            { header: 'Salutation', key: 'cu_salutation', width: 12 },
            { header: 'First Name', key: 'cu_first_name', width: 20 },
            { header: 'Last Name', key: 'cu_last_name', width: 20 },
            { header: 'Phone', key: 'cu_phone', width: 18 },
            { header: 'MobilePhone', key: 'cu_mobile', width: 18 },
            { header: 'EmailID', key: 'cu_email', width: 28 },
            { header: 'Currency Code', key: 'cu_currency', width: 14 },
            { header: 'Notes', key: 'cu_remarks', width: 35 },
            { header: 'Website', key: 'cu_website', width: 25 },
            { header: 'Status', key: 'cu_status', width: 12 },

            // ─── Finance ────────────────────────────────────────────────────
            { header: 'Accounts Receivable', key: 'cu_ar_balance', width: 18 },
            { header: 'Opening Balance', key: 'cu_opening_balance', width: 18 },
            { header: 'Opening Balance Exchange Rate', key: 'cu_opening_balance_ex_rate', width: 27 },
            { header: 'Bank Account Payment', key: 'cu_bank_payment', width: 20 },
            { header: 'Credit Limit', key: 'cu_credit_limit', width: 16 },

            // ─── Portal / CRM ───────────────────────────────────────────────
            { header: 'Portal Enabled', key: 'cu_portal_access', width: 14 },
            { header: 'Customer Sub Type', key: 'cu_type', width: 18 },
            { header: 'Department', key: 'cu_department', width: 18 },
            { header: 'Designation', key: 'cu_designation', width: 18 },
            { header: 'Price List', key: 'cu_price_list', width: 18 },
            { header: 'Payment Terms', key: 'cu_payment_terms', width: 18 },
            { header: 'Payment Terms Label', key: 'cu_payment_terms_label', width: 22 },
            { header: 'Tax Type', key: 'cu_tax_type', width: 14 },
            { header: 'VAT Treatment', key: 'cu_tax_treatment', width: 18 },
            { header: 'TaxID', key: 'cu_pan_no', width: 16 },
            { header: 'Tax Name', key: 'cu_tax_name', width: 18 },
            { header: 'Tax Percentage', key: 'cu_tax_percentage', width: 18 },
            { header: 'Place Of Supply', key: 'cu_place_supply', width: 18 },
            { header: 'Taxable', key: 'cu_tax_preference', width: 12 },

            // ─── Billing address ───────────────────────────────────────────
            { header: 'Billing Attention', key: 'cu_b_addr_attention', width: 22 },
            { header: 'Billing Address', key: 'cu_b_addr_address', width: 28 },
            { header: 'Billing Street2', key: 'cu_b_addr_address2', width: 28 },
            { header: 'Billing City', key: 'cu_b_addr_city', width: 18 },
            { header: 'Billing State', key: 'cu_b_addr_state', width: 18 },
            { header: 'Billing Country', key: 'cu_b_addr_country', width: 18 },
            { header: 'Billing County', key: 'cu_b_addr_county', width: 18 },
            { header: 'Billing Code', key: 'cu_b_addr_pincode', width: 14 },
            { header: 'Billing Phone', key: 'cu_b_addr_phone', width: 18 },
            { header: 'Billing Fax', key: 'cu_b_addr_fax_number', width: 18 },

            // ─── Shipping address ──────────────────────────────────────────
            { header: 'Shipping Attention', key: 'cu_s_addr_attention', width: 22 },
            { header: 'Shipping Address', key: 'cu_s_addr_address', width: 28 },
            { header: 'Shipping Street2', key: 'cu_s_addr_address2', width: 28 },
            { header: 'Shipping City', key: 'cu_s_addr_city', width: 18 },
            { header: 'Shipping State', key: 'cu_s_addr_state', width: 18 },
            { header: 'Shipping Country', key: 'cu_s_addr_country', width: 18 },
            { header: 'Shipping County', key: 'cu_s_addr_county', width: 18 },
            { header: 'Shipping Code', key: 'cu_s_addr_pincode', width: 14 },
            { header: 'Shipping Phone', key: 'cu_s_addr_phone', width: 18 },
            { header: 'Shipping Fax', key: 'cu_s_addr_fax_number', width: 18 },

            // ─── Social / misc — add blanks if you don’t store them yet ────
            { header: 'Skype Identity', key: 'ccp_skype_name', width: 20 },
            { header: 'Owner Name', key: 'ccp_firstname', width: 22 },
            { header: 'Primary Contact ID', key: 'ccp_id', width: 22 },
            { header: 'Contact ID', key: 'cu_contact_id', width: 18 },
            { header: 'Contact Name', key: 'cu_contact_name', width: 22 },
            { header: 'Contact Email', key: 'ccp_email', width: 18 },
            { header: 'Contact Mobile', key: 'ccp_mobile', width: 25 },
            { header: 'Contact Address ID', key: 'cu_contact_addr_id', width: 22 },
        ];
        worksheet.columns = headers;

        // Add data rows
        customerData.forEach(row => {
            worksheet.addRow(row);
        });

        // Ensure export directory exists
        const exportDir = path.join(__dirname, 'uploads', 'customer');
        // Recursively create the directory if it doesn't exist
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = moment().format('DD-MM-YYYY_HH-mm-ss');
        let returnPath = null
        if (type === "xlsx") {
            returnPath = path.join(exportDir, `customers_${timestamp}.xlsx`);
            await workbook.xlsx.writeFile(returnPath);
        } else {
            returnPath = path.join(exportDir, `customers_${timestamp}.csv`);
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