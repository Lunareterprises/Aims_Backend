var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.listItemTransactions = async (item_id, type, status, page = 1, limit = 10) => {
  // Calculate offset and limit
  const offset = (page - 1) * limit;

  // If status is "all", we do not filter by status
  let condition = status === "all" ? "" : `AND i.status = ?`;

  var Query = `
  SELECT 
    i.id,
    i.type,
    i.invoiceDate,
    i.terms,
    i.dueDate,
    i.salesPerson,
    i.subject,
    i.subTotal,
    i.shippingCharge,
    i.notes,
    i.taxType,
    i.taxRate,
    i.adjustments,
    i.total,
    i.createdBy,
    i.updatedAt,
    i.status,
    i.customer_id,
    i.termsAndCondition,
    i.file,
    i.projectName,
    i.invoice_path,
    c.cu_display_name AS customer_name,
    -- Aggregate the items into a JSON array of objects
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'ii_id', ii.ii_id,
        'ii_name', ii.ii_name,
        'ii_quantity', ii.ii_quantity,
        'ii_rate', ii.ii_rate,
        'ii_amount', ii.ii_amount,
        'ii_description', ii.ii_description,
        'ii_discount', ii.ii_discount
      )
    ) AS items
  FROM 
    invoice i
  LEFT JOIN 
    customer c ON i.customer_id = c.cu_id
  LEFT JOIN
    invoice_items ii ON i.id = ii.ii_in_id
  WHERE 
    ii.ii_id = ?  -- The item ID you're looking for
    AND i.type = ?  -- The invoice type
    ${condition}
  GROUP BY 
    i.id, i.type, i.invoiceDate, i.terms, i.dueDate, i.salesPerson, i.subject, i.subTotal, 
    i.shippingCharge, i.notes, i.taxType, i.taxRate, i.adjustments, i.total, i.createdBy, 
    i.updatedAt, i.status, i.customer_id, i.termsAndCondition, i.file, i.projectName, 
    i.invoice_path, c.cu_display_name
  LIMIT ? OFFSET ?;  -- Add pagination
  `;

  // If status is not 'all', we pass the status parameter to the query
  var data = await query(Query, status === "all" ? [item_id, type, limit, offset] : [item_id, type, status, limit, offset]);
  return data;
};

