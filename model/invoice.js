var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.createInvoice = async (invoice_number, order_number, date, terms, due_date, account_receivable, salesperson, subject, customer_note, terms_condition, is_recurring, profile_name, repeat_every, start_on, ends_on, never_expires, payment_term, account_receivable_sec, subTotal, total, discount, taxRate, taxType, adjustments, shippingCharge, customer_id, user_id, pdf_path) => {

  // SQL query to insert a new invoice record
  var Query = `INSERT INTO invoice (
    i_number,
    i_order_number,
    i_date,
    i_terms,
    i_due_date,
    i_account_receivable,
    i_sales_person,
    i_subject,
    i_customer_note,
    i_terms_condition,
    i_is_recurring,
    i_profile_name,
    i_repeat_every,
    i_start_on,
    i_ends_on,
    i_never_expires,
    i_payment_terms,
    i_account_receivable_sec,
    i_sub_total,
    i_total,
    i_discount,
    i_tax_rate,
    i_tax_type,
    i_adjustments,
    i_shipping_charge,
    i_customer_id,
    i_user_id,
    i_pdf
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  // Values for each column in the invoice table
  return await query(Query, [
    invoice_number, order_number, date, terms, due_date, account_receivable, salesperson, subject, customer_note, terms_condition, is_recurring, profile_name, repeat_every, start_on, ends_on, never_expires, payment_term, account_receivable_sec, subTotal, total, discount, taxRate, taxType, adjustments, shippingCharge, customer_id, user_id, pdf_path
  ]);
};

module.exports.InsertItems = async (invoice_id, item_id, name, description, quantity, rate, discount, amount) => {
  var Query = `insert into invoice_items  (
  ii_in_id,
    ii_i_id,
    ii_name, 
    ii_description, 
    ii_quantity, 
    ii_rate, 
    ii_discount, 
    ii_amount
    ) VALUES (?,?, ?, ?, ?, ?, ?,?)`
  return await query(Query, [invoice_id, item_id, name, description, quantity, rate, discount, amount])
}

module.exports.listInvoices = async (condition) => {
  const Query = `SELECT
   i.*,
   c.cu_display_name AS customer_name 
  from invoice i
  LEFT JOIN customer c ON i.i_customer_id = c.cu_id
  ${condition}`;
  console.log("query : ", Query)
  return await query(Query);
};

module.exports.getSingleInvoice = async (invoice_id, user_id) => {
  const Query = `
    SELECT 
  i.*, 
  c.cu_display_name AS customer_name,
  JSON_ARRAYAGG(
    DISTINCT
    CASE 
      WHEN ii.ii_id IS NOT NULL THEN JSON_OBJECT(
        'ii_id', ii.ii_id,
        'ii_name', ii.ii_name,
        'ii_quantity', ii.ii_quantity,
        'ii_rate', ii.ii_rate,
        'ii_amount', ii.ii_amount,
        'ii_description', ii.ii_description,
        'ii_discount', ii.ii_discount
      )
    END
  ) AS items,
  JSON_ARRAYAGG(
    DISTINCT
    CASE 
      WHEN sd.sd_id IS NOT NULL THEN JSON_OBJECT(
        'sd_id', sd.sd_id,
        'sd_file', sd.sd_file,
        'sd_status', sd.sd_status
      )
    END
  ) AS documents
FROM invoice i
LEFT JOIN customer c ON i.i_customer_id = c.cu_id
LEFT JOIN invoice_items ii ON i.i_id = ii.ii_in_id
LEFT JOIN sales_documents sd ON sd.sd_invoice_id = i.i_id
WHERE i.i_user_id = ? AND i.i_id = ?
GROUP BY i.i_id
  `;

  const result = await query(Query, [user_id, invoice_id]);

  if (result.length > 0) {
    // Parse documents if it's a string
    if (typeof result[0].documents === 'string') {
      try {
        result[0].documents = JSON.parse(result[0].documents);
      } catch (e) {
        console.error('Failed to parse documents JSON:', e);
        result[0].documents = [];
      }
    }
    if (typeof result[0].items === 'string') {
      try {
        result[0].items = JSON.parse(result[0].items);
      } catch (e) {
        console.error('Failed to parse items JSON:', e);
        result[0].items = [];
      }
    }

    // Filter out null values from both arrays
    if (Array.isArray(result[0].items)) {
      result[0].items = result[0].items.filter(item => item !== null);
    }
    // result[0].items.filter(item => console.log(item))

    if (Array.isArray(result[0].documents)) {
      result[0].documents = result[0].documents.filter(doc => doc !== null);
    }
  }
  return result;
};


module.exports.deleteInvoice = async (invoice_id, createdBy) => {
  var Query = `
  DELETE FROM invoice 
  WHERE id = ? AND createdBy = ?;
`;
  return await query(Query, [invoice_id, createdBy])
}

module.exports.editInvoice = async (
  status,
  invoice_id,
  invoiceDate,
  terms,
  dueDate,
  salesPerson,
  subject,
  subTotal,
  shippingCharge,
  notes,
  taxType,
  taxRate,
  adjustments,
  total,
  items,
  customerId,
  termsAndCondition,
  file,
  userId,
  invoice_path
) => {
  // Convert the items array to a JSON string
  const itemsJson = JSON.stringify(items);

  // SQL query to update the invoice
  var Query = `
    UPDATE invoice
    SET 
    status=?,
      invoiceDate = ?, 
      terms = ?, 
      dueDate = ?, 
      salesPerson = ?, 
      subject = ?, 
      subTotal = ?, 
      shippingCharge = ?, 
      notes = ?, 
      taxType = ?, 
      taxRate = ?, 
      adjustments = ?, 
      total = ?, 
      items = ?, 
      customer_id = ?, 
      termsAndCondition = ?, 
      file = ?, 
      createdBy = ?,
      invoice_path=?
    WHERE id = ?;
  `;

  // Execute the query with the provided values
  return await query(Query, [
    status,
    invoiceDate,
    terms,
    dueDate,
    salesPerson,
    subject,
    subTotal,
    shippingCharge,
    notes,
    taxType,
    taxRate,
    adjustments,
    total,
    itemsJson,
    customerId,
    termsAndCondition,
    file,
    userId,
    invoice_path,
    invoice_id
  ]);
};

module.exports.getCustomerDetails = async (customer_id) => {
  var Query = `select * from customer where cu_id=?`
  return await query(Query, [customer_id])
}

module.exports.getUserDetails = async (user_id) => {
  var Query = `select * from users where u_id=?`
  return await query(Query, [user_id])
}

module.exports.getItemNameById = async (item_id) => {
  var Query = `select * from items where i_id = ?`
  return await query(Query, [item_id])
}

module.exports.InsertFiles = async (fileURLToPath, invoice_id) => {
  let Query = `insert into sales_documents (sd_file,sd_invoice_id) values (?,?)`
  return await query(Query, [fileURLToPath, invoice_id]);
}

module.exports.CheckInvoice = async (invoice_id, user_id) => {
  let Query = `select * from invoice where i_id=? and i_user_id=?`
  return await query(Query, [invoice_id, user_id])
}

module.exports.EditItems = async (ii_id, item_id, name, description, quantity, rate, discount, amount) => {
  let Query = `update invoice_items set 
  ii_i_id=?,
   ii_name=?, 
    ii_description=?, 
    ii_quantity=?, 
    ii_rate=?, 
    ii_discount=?, 
    ii_amount=?
    where ii_id=?`
  return await query(Query, [item_id, name, description, quantity, rate, discount, amount, ii_id])
}

module.exports.CheckItems = async (invoice_id, item_id) => {
  let Query = `select * from invoice_items where ii_id=? and ii_in_id=?`
  return await query(Query, [item_id, invoice_id])
}

module.exports.DeleteInvoiceItem = async (invoice_id, item_id) => {
  let Query = `delete from invoice_items where ii_id=? and ii_in_id=?`
  return await query(Query, [item_id, invoice_id])
}

module.exports.CheckDocuments = async (invoice_id, document_id) => {
  let Query = `select * from sales_documents where sd_invoice_id=? and sd_id=?`
  return await query(Query, [invoice_id, document_id])
}

module.exports.DeleteInvoiceDocument = async (invoice_id, document_id) => {
  let Query = `delete from sales_documents where sd_invoice_id=? and sd_id=?`
  return await query(Query, [invoice_id, document_id])
}