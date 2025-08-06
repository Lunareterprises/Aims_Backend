var db = require("../db/db");
var util = require("util");
var query = util.promisify(db.query).bind(db);


module.exports.CheckCustomer = async (user_id, customer_id) => {
    let Query = `select * from customer where cu_id=? and cu_user_id=?`
    return await query(Query, [customer_id, user_id])
}

module.exports.CheckSalesOrder = async (user_id, salesorder_id) => {
    let Query = `select * from sales_orders where so_id=? and so_user_id=?`
    return await query(Query, [salesorder_id, user_id])
}

module.exports.CheckPackage = async (user_id, package_id, salesorder_id) => {
    let Query = `select * from packages where p_id=? and p_sales_order_id=? and p_user_id=?`
    return await query(Query, [package_id, salesorder_id, user_id])
}

module.exports.CheckCarrier = async (user_id, carrier_id) => {
    let Query = `select * from deliver_methods where dm_id=? and dm_user_id=?`
    return await query(Query, [carrier_id, user_id])
}

module.exports.CreateCarrier = async (carrier, user_id) => {
    let Query = `insert into deliver_methods (dm_method,dm_user_id) values(?,?)`
    return await query(Query, [carrier, user_id])
}

module.exports.CreateShipment = async (customer_id, salesorder_id, package_id, shipment_order, ship_date, carrier, tracking, tracking_url, shipping_charges, notes, shipment_delivered, deliverd_on, user_id, status) => {
    let Query = `insert into shipments (s_customer_id,s_sales_order_id,s_package_id,s_shipment_order,s_ship_date,s_carrier,s_tracking,s_tracking_url,s_shipping_charges,s_notes,s_shipment_delivered,s_delivered_on,s_user_id,s_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return await query(Query, [customer_id, salesorder_id, package_id, shipment_order, ship_date, carrier, tracking, tracking_url, shipping_charges, notes, shipment_delivered, deliverd_on, user_id, status])
}

module.exports.ChangePackageStatus = async (package_id, user_id, salesorder_id, status) => {
    let Query = `update packages set p_package_status=? where p_id=? and p_sales_order_id=? and p_user_id=?`
    return await query(Query, [status, package_id, salesorder_id, user_id])
}

module.exports.CheckShipment = async (shipment_id, user_id) => {
    let Query = `select * from shipments where s_id=? and s_user_id=?`
    return await query(Query, [shipment_id, user_id])
}

module.exports.UpdateShipment = async (shipment_id, package_id, shipment_order, ship_date, carrier, tracking, tracking_url, shipping_charges, notes, shipment_delivered, deliverd_on, status) => {
    let Query = `update shipments set s_package_id=?,s_shipment_order=?,s_ship_date=?,s_carrier=?,s_tracking=?,s_tracking_url=?,s_shipping_charges=?,s_notes=?,s_shipment_delivered=?,s_delivered_on=?,s_status=? where s_id=?`
    return await query(Query, [package_id, shipment_order, ship_date, carrier, tracking, tracking_url, shipping_charges, notes, shipment_delivered, deliverd_on, status, shipment_id])
}

module.exports.ListAllShipments = async (user_id) => {
    let Query = `select * from shipments where s_user_id=?`
    return await query(Query, [user_id])
}

module.exports.DeleteShipment = async (shipment_id, user_id) => {
    let Query = `delete from shipment where s_id=? and s_user_id=?`
    return await query(Query, [shipment_id, user_id])
}

module.exports.ChangeShipmentStatus = async (shipment_id, deliverd_on) => {
    let Query = `update shipments set s_status=? and s_delivered_on=? where s_id=?`
    return await query(Query, ["delivered", deliverd_on, shipment_id])
}