var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);

module.exports.CreateQuote = async (customer_id, supply_place, tax_treatment, number, reference, date, expiry_date, sales_person_id, project_id, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, user_id) => {
    let Query = `insert into quote (q_c_id,q_no,q_date,q_expiry_date,q_p_id,q_sp_id,q_subject,q_template,q_notes,q_terms_c,q_sub_total,q_discount,q_adjustment,q_total,q_place_supply,q_tax_treatment,q_tax_preference,q_tcs_tds,q_tcs_tds_id,q_shipping_charges,q_user_id,q_reference) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [customer_id, number, date, expiry_date, project_id, sales_person_id, subject, template, notes, terms_condition, sub_total, discount, adjustment, total, supply_place, tax_treatment, tax_preference, tcs_tds, tcs_tds_id, shipping_charge, user_id, reference])
}

module.exports.CheckCustomer = async (customer_id, user_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=? `
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckSalesperson = async (sales_person_id, user_id) => {
    let Query = `select * from sales_person where id=? and createdBy=?`
    return await query(Query, [sales_person_id, user_id])
}

module.exports.CheckProject = async (project_id, customer_id, user_id) => {
    let Query = `select * from project where proj_id=? and proj_user_id=? and proj_cust_id=?`
    return await query(Query, [project_id, user_id, customer_id])
}

module.exports.CheckItem = async (item_id, user_id) => {
    let Query = `select * from items where i_id=? and i_user_id=?`
    return await query(Query, [item_id, user_id])
}

module.exports.InsertItems = async (item_id, description, quantity, rate, discount, discount_type, tax_id, amount, quote_id) => {
    let Query = `insert into quote_items (qi_i_id,qi_description,qi_quantity,qi_rate,qi_discount,qi_discount_type,qi_tax_id,qi_amount,qi_q_id) values(?,?,?,?,?,?,?,?,?)`
    return await query(Query, [item_id, description, quantity, rate, discount, discount_type, tax_id, amount, quote_id])
}

module.exports.InsertFiles = async (file, quote_id) => {
    let Query = `insert into sales_documents (sd_file,sd_quote_id) values(?,?)`
    return await query(Query, [file, quote_id])
}

module.exports.GetQuoteData = async (quote_id, user_id) => {
    let Query = `select * from quote where q_id=? and q_user_id=?`
    return await query(Query, [quote_id, user_id])
}

module.exports.UpdateQuote = async (supply_place, tax_treatment, number, reference, expiry_date, sales_person_id, project_id, subject, tax_preference, notes, terms_condition, template, sub_total, discount, shipping_charge, adjustment, tcs_tds, tcs_tds_id, total, quote_id) => {
    let Query = `update quote set q_no=?,q_expiry_date=?,q_p_id=?,q_sp_id=?,q_subject=?,q_template=?,q_notes=?,q_terms_c=?,q_sub_total=?,q_discount=?,q_adjustment=?,q_total=?,q_place_supply=?,q_tax_treatment=?,q_tax_preference=?,q_tcs_tds=?,q_tcs_tds_id=?,q_shipping_charges=?,q_reference=? where q_id=?`
    return await query(Query, [number, expiry_date, project_id, sales_person_id, subject, template, notes, terms_condition, sub_total, discount, adjustment, total, supply_place, tax_treatment, tax_preference, tcs_tds, tcs_tds_id, shipping_charge, reference, quote_id])
}

module.exports.CheckQuoteItem = async (quote_item_id, quote_id) => {
    let Query = `select * from quote_items where qi_id=? and qi_q_id=? `
    return await query(Query, [quote_item_id, quote_id])
}

module.exports.updateQuoteItem = async (description, quantity, rate, discount, discount_type, tax_id, amount, quote_item_id) => {
    let Query = `update quote_items set qi_description=?,qi_quantity=?,qi_rate=?,qi_discount=?,qi_discount_type=?,qi_tax_id=?,qi_amount=? where qi_id=?`
    return await query(Query, [description, quantity, rate, discount, discount_type, tax_id, amount, quote_item_id])
}

module.exports.ListAllQuotes = async (user_id, quote_id) => {
    let condition = quote_id ? `and q.q_id=? ` : ''
    // const queryStr = `
    //     SELECT 
    //         q.*,
    //         qi.qi_id,
    //         qi.qi_i_id,
    //         qi.qi_description,
    //         qi.qi_quantity,
    //         qi.qi_rate,
    //         qi.qi_amount,
    //         qi.qi_q_id,
    //         qi.qi_discount,
    //         qi.qi_discount_type,
    //         qi.qi_tax_id,
    //         sd.sd_id,
    //         sd.sd_file,
    //         sd.sd_status
    //     FROM quote q
    //     LEFT JOIN quote_items qi ON qi.qi_q_id = q.q_id
    //     LEFT JOIN sales_documents sd ON sd.sd_quote_id = q.q_id
    //     WHERE q.q_user_id = ? ${condition}
    //     ORDER BY q.q_id, qi.qi_id, sd.sd_id
    // `;
    const queryStr = `
  SELECT
      /* ── quote ─────────────────────────────── */
      q.*,

      /* ── quote_items ───────────────────────── */
      qi.qi_id,
      qi.qi_i_id,
      qi.qi_description,
      qi.qi_quantity,
      qi.qi_rate,
      qi.qi_amount,
      qi.qi_q_id,
      qi.qi_discount,
      qi.qi_discount_type,
      qi.qi_tax_id,

      /* ── items (product master) ────────────── */
      i.i_name         AS item_name,
      i.i_sku          AS item_sku,
      i.i_upc          AS item_upc,
      i.i_isbn         AS item_isbn,
      i.i_mpn          AS item_mpn,
      i.i_ean          AS item_ean,
      i.i_unit         AS item_unit,
      i.i_type         AS item_type,

      /* ── sales_documents ───────────────────── */
      sd.sd_id,
      sd.sd_file,
      sd.sd_status
  FROM quote q
  LEFT JOIN quote_items      qi ON qi.qi_q_id = q.q_id
  LEFT JOIN items            i  ON i.i_id     = qi.qi_i_id   /* NEW JOIN */
  LEFT JOIN sales_documents  sd ON sd.sd_quote_id = q.q_id
  WHERE q.q_user_id = ? ${condition}
  ORDER BY q.q_id, qi.qi_id, sd.sd_id
`;
    let values = [user_id]
    if (quote_id) {
        values.push(quote_id)
    }
    const rows = await query(queryStr, values);

    const grouped = {};

    for (const row of rows) {
        const quoteId = row.q_id;

        if (!grouped[quoteId]) {
            // Create base quote object without item/file specific fields
            grouped[quoteId] = {
                q_id: row.q_id,
                q_c_id: row.q_c_id,
                q_no: row.q_no,
                q_date: row.q_date,
                q_expiry_date: row.q_expiry_date,
                q_p_id: row.q_p_id,
                q_sp_id: row.q_sp_id,
                q_subject: row.q_subject,
                q_template: row.q_template,
                q_notes: row.q_notes,
                q_terms_c: row.q_terms_c,
                q_sub_total: row.q_sub_total,
                q_discount: row.q_discount,
                q_adjustment: row.q_adjustment,
                q_tcs_tds_id: row.q_tcs_tds_id,
                q_total: row.q_total,
                q_status: row.q_status,
                q_created_at: row.q_created_at,
                q_updated_at: row.q_updated_at,
                q_place_supply: row.q_place_supply,
                q_tax_treatment: row.q_tax_treatment,
                q_tax_preference: row.q_tax_preference,
                q_tcs_tds: row.q_tcs_tds,
                q_shipping_charges: row.q_shipping_charges,
                q_user_id: row.q_user_id,
                q_reference: row.q_reference,
                items: [],
                files: []
            };
        }

        // Process items if available
        if (row.qi_id && !grouped[quoteId].items.some(item => item.qi_id === row.qi_id)) {
            grouped[quoteId].items.push({
                qi_id: row.qi_id,
                qi_i_id: row.qi_i_id,
                qi_description: row.qi_description,
                qi_quantity: row.qi_quantity,
                qi_rate: row.qi_rate,
                qi_amount: row.qi_amount,
                qi_q_id: row.qi_q_id,
                qi_discount: row.qi_discount,
                qi_discount_type: row.qi_discount_type,
                qi_tax_id: row.qi_tax_id,
                item_name: row.item_name,
                item_sku:row.item_sku,
                item_upc:row.item_upc,
                item_isbn:row.item_isbn,
                item_mpn:row.item_mpn,
                item_ean:row.item_ean,
                item_unit:row.item_unit,
                item_type:row.item_type
            });
        }

        // Process files if available and active
        if (row.sd_id && row.sd_status === 'active' &&
            !grouped[quoteId].files.some(file => file.sd_id === row.sd_id)) {
            grouped[quoteId].files.push({
                sd_id: row.sd_id,
                file: row.sd_file,
                status: row.sd_status
            });
        }
    }

    return Object.values(grouped)
};


module.exports.DeleteQuote = async (quote_id, user_id) => {
    let Query = `delete from quote where q_id=? and q_user_id=?`
    return await query(Query, [quote_id, user_id])
}

module.exports.DeleteQuoteItem = async (quote_item_id, quote_id) => {
    let Query = `delete from quote_items where qi_id=? and qi_q_id=?`
    return await query(Query, [quote_item_id, quote_id])
}

module.exports.GetFileData = async (quote_file_id, quote_id) => {
    let Query = `select * from sales_documents where sd_id=? and sd_quote_id=?`
    return await query(Query, [quote_file_id, quote_id])
}

module.exports.DeleteQuoteFile = async (quote_file_id, quote_id) => {
    let Query = `delete from sales_documents where sd_id=? and sd_quote_id=?`
    return await query(Query, [quote_file_id, quote_id])
}

module.exports.CheckTax = async (tax_id, user_id) => {
    let Query = `select * from tax where tax_id=? and tax_user_id=?`
    return await query(Query, [tax_id, user_id])
}

module.exports.CheckTcsTds = async (tax_id, user_id, tax_type) => {
    let Query = `select * from tcs_tds_tax where tt_id=? and tt_user_id=? and tt_type=?`
    return await query(Query, [tax_id, user_id, tax_type])
}

module.exports.CreateComment = async (comment, quote_id) => {
    let Query = `insert into quote_comments (qc_q_id,qc_comment) values(?,?)`
    return await query(Query, [quote_id, comment])
}

module.exports.CheckComment = async (comment_id) => {
    let Query = `select * from quote_comments where qc_id=?`
    return await query(Query, [comment_id])
}

module.exports.UpdateComment = async (comment_id, comment) => {
    let Query = `update quote_comments set qc_comment=? where qc_id=?`
    return await query(Query, [comment, comment_id])
}

module.exports.ListQuoteComments = async (quote_id) => {
    let Query = `select * from quote_comments where qc_q_id=?`
    return await query(Query, [quote_id])
}

module.exports.CheckQuoteComment = async (quote_id, quote_comment_id) => {
    let Query = `select * from quote_comments where qc_id=? and qc_q_id=?`
    return await query(Query, [quote_comment_id, quote_id])
}

module.exports.DeleteQuoteComment = async (quote_comment_id) => {
    let Query = `delete from quote_comments where qc_id=?`
    return await query(Query, [quote_comment_id])
}