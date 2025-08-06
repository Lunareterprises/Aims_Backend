var db = require("../../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddDeliveryChallan = async (user_id, dc_customer_name, dc_customer_id, dc_delivery_challan_id,
    dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment) => {

    try {
        var Query = `INSERT INTO delivery_challans (dc_user_id, dc_customer_name, dc_customer_id, dc_delivery_challan_id,
                dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment) VALUES (?,?,?,?,?,?,?,?,?)`;

        var data = await query(Query, [user_id, dc_customer_name, dc_customer_id, dc_delivery_challan_id,
            dc_reference, dc_date, dc_type, dc_customer_notes, dc_adjustment]);

        return data;
    } catch (error) {
        console.error("Error inserting Delivery Challan data:", error);
        throw new Error('Failed to add Delivery Challan');
    }
};


module.exports.InsertdeliverychallanItem = async (deliverychallan_id, el) => {
    var Query = `insert into items_sections(is_delivery_challans_id, is_item_name, is_item_id, is_quantity, is_rate, is_discount , is_amount) values (?,?,?,?,?,?,?)`;
    var data = await query(Query, [deliverychallan_id, el.is_item_name, el.is_item_id, el.is_quantity, el.is_rate, el.is_discount, el.is_amount,]);
    return data;
};

module.exports.AddImagesQuery = async (deliverychallan_id, imagepath) => {
    var Query = `insert into sales_documents (sd_delivery_challan_id,sd_file) values (?,?)`;
    var data = await query(Query, [deliverychallan_id, imagepath]);
    return data;
};