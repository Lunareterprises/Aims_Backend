let model = require('../model/overview')
let invoiceModel = require('../model/invoice')
let { filterDataByDateRange } = require('../util/dashboard')

module.exports.WeekOverview = async (req, res) => {
    try {
        let { u_id } = req.user
        let { from, to } = req.body
        let clientData = await model.clientsOverview(u_id)
        let invoiceData = await invoiceModel.listInvoices(u_id)
        let itemsData = await model.listItems(u_id)
        let clientUpdatedData = (from && to) ? filterDataByDateRange(clientData, from, to) : clientData
        let invoiceUpdatedData = (from && to) ? filterDataByDateRange(invoiceData, from, to) : invoiceData
        let itemsUpdatedData = (from && to) ? filterDataByDateRange(itemsData, from, to) : itemsData
        return res.send({
            result: true,
            message: "Data retrived successfully.",
            data: { clientUpdatedData, invoiceUpdatedData, itemsUpdatedData }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}