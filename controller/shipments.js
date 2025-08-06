let model = require('../model/shipment')


module.exports.CreateShipment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { customer_id, salesorder_id, package_id, shipment_order, ship_date, carrier, carrier_id, tracking, tracking_url, shipping_charges, notes, shipment_delivered, delivered_on } = req.body
        if (!customer_id || !salesorder_id || !package_id || !shipment_order || !ship_date || (!carrier && !carrier_id)) {
            return res.send({
                result: false,
                message: "Insufficient parameters."
            })
        }
        let checkCustomer = await model.CheckCustomer(u_id, customer_id)
        if (checkCustomer.length === 0) {
            return res.send({
                result: false,
                message: "Customer not found."
            })
        }
        let checkSalesOrder = await model.CheckSalesOrder(u_id, salesorder_id)
        if (checkSalesOrder.length === 0) {
            return res.send({
                result: false,
                message: "Sales order not found."
            })
        }
        let checkPackage = await model.CheckPackage(u_id, package_id, salesorder_id)
        if (checkPackage.length === 0) {
            return res.send({
                result: false,
                message: "Package not found."
            })
        }
        let checkCarrier = await model.CheckCarrier(u_id, carrier_id)
        if (carrier_id && checkCarrier.length === 0) {
            return res.send({
                result: false,
                message: "Carrier not found."
            })
        }
        let carrierData = nul
        if (!carrier_id && carrier) {
            carrierData = await model.CreateCarrier(carrier, u_id)
            if (carrierData.affectedRows === 0) {
                return res.send({
                    result: false,
                    message: "Failed to create carrier"
                })
            }
        }
        let carrierId = carrier_id ?? carrierData.insertId
        let status = shipment_delivered == true ? "delivered" : "shipped"
        let createdShipment = await model.CreateShipment(customer_id, salesorder_id, package_id, shipment_order, ship_date, carrierId, tracking, tracking_url, shipping_charges, notes, shipment_delivered, delivered_on, u_id, status)
        if (createdShipment.affectedRows > 0) {
            await model.ChangePackageStatus(package_id, u_id, salesorder_id, status)
            return res.send({
                result: true,
                message: "Shipment created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create shipment."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditShipment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { shipment_id, package_id, shipment_order, ship_date, carrier, carrier_id, tracking, tracking_url, shipping_charges, notes, shipment_delivered, delivered_on } = req.body
        if (!shipment_id) {
            return res.send({
                result: false,
                message: "Shipment id is required."
            })
        }
        if (!package_id || !shipment_order || !ship_date || (!carrier && !carrier_id)) {
            return res.send({
                result: false,
                message: "Insufficient parameters."
            })
        }
        let checkShipment = await model.CheckShipment(shipment_id, u_id)
        if (checkShipment.length === 0) {
            return res.send({
                result: false,
                message: "Shipment not found."
            })
        }
        let checkPackage = await model.CheckPackage(u_id, package_id, salesorder_id)
        if (checkPackage.length === 0) {
            return res.send({
                result: false,
                message: "Package not found."
            })
        }
        let checkCarrier = await model.CheckCarrier(u_id, carrier_id)
        if (carrier_id && checkCarrier.length === 0) {
            return res.send({
                result: false,
                message: "Carrier not found."
            })
        }
        let carrierData = nul
        if (!carrier_id && carrier) {
            carrierData = await model.CreateCarrier(carrier, u_id)
            if (carrierData.affectedRows === 0) {
                return res.send({
                    result: false,
                    message: "Failed to create carrier"
                })
            }
        }
        let carrierId = carrier_id ?? carrierData.insertId
        let status = shipment_delivered == true ? "delivered" : "shipped"
        let updatedShipment = await model.UpdateShipment(shipment_id, package_id, shipment_order, ship_date, carrierId, tracking, tracking_url, shipping_charges, notes, shipment_delivered, delivered_on, status)
        if (updatedShipment.affectedRows > 0) {
            await model.ChangePackageStatus(package_id, u_id, salesorder_id, status)
            return res.send({
                result: true,
                message: "Shipment updated successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update shipment."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.ListAllShipment = async (req, res) => {
    try {
        let { u_id } = req.user
        let shipments = await model.ListAllShipments(u_id)
        if (shipments.length) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: shipments
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteShipment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { shipment_id } = req.body
        if (!shipment_id) {
            return res.send({
                result: false,
                message: "Shipment id is required."
            })
        }
        let checkShipment = await model.CheckShipment(shipment_id, u_id)
        if (checkShipment.length === 0) {
            return res.send({
                result: false,
                message: "Shipment not found."
            })
        }
        let deleted = await model.DeleteShipment(shipment_id, u_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Shipment deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete shipment"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.GetSingleShipment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { shipment_id } = req.body
        if (!shipment_id) {
            return res.send({
                result: false,
                message: "Shipment id is required."
            })
        }
        let checkShipment = await model.CheckShipment(shipment_id, u_id)
        if (checkShipment.length > 0) {
            return res.send({
                result: true,
                message: "Data retrieved successfully.",
                data: checkShipment
            })
        } else {
            return res.send({
                result: false,
                message: "Data not found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.UpdateDeliveryStatus = async (req, res) => {
    try {
        let { u_id } = req.user
        let { shipment_id, delivered_on, send_delivery_notification } = req.body
        if (!shipment_id) {
            return res.send({
                result: false,
                message: "Shipment id is required."
            })
        }
        let checkShipment = await model.CheckShipment(shipment_id, u_id)
        if (checkShipment.length === 0) {
            return res.send({
                result: false,
                message: "Shipment not found."
            })
        }
        let updateStatus = await model.ChangeShipmentStatus(shipment_id, delivered_on)
        if (updateStatus.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Delivery status updated successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to update delivery status."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}