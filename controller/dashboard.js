let invoiceModel = require('../model/invoice')
let dashboardModel = require('../model/dashboard')

let { filterDataByType, calculateTotalByStatus, calculateTotalDue, countDocumentsByStatus, getTotalSalesByMonth } = require('../util/dashboard')

module.exports.dashboard = async (req, res) => {
    try {
        let { u_id } = req.user
        let invoiceData = await invoiceModel.listInvoices(u_id)
        //Sales Data
        let salesData = filterDataByType(invoiceData, "sales")
        let salesUnpaidTotal = calculateTotalByStatus(salesData, "unpaid")
        let salesUnpaidCount = countDocumentsByStatus(salesData, "unpaid")
        let salesDueTotal = calculateTotalDue(salesData, "unpaid")
        let recievableData = {
            totalRecievable: salesData?.length,
            currentRecievedCount: salesUnpaidCount,
            currentTotal: salesUnpaidTotal - salesDueTotal,
            dueTotal: salesDueTotal
        }

        //Purchase Data
        let purchaseData = filterDataByType(invoiceData, "purchase")
        let purchaseUnpaidTotal = calculateTotalByStatus(purchaseData, "unpaid")
        let purchaseUnpaidCount = countDocumentsByStatus(purchaseData, "unpaid")
        let purchaseDueTotal = calculateTotalDue(purchaseData, "unpaid")
        let data = getTotalSalesByMonth(purchaseData)
        let payableData = {
            totalRecievable: purchaseData?.length,
            currentRecievedCount: purchaseUnpaidCount,
            currentTotal: purchaseUnpaidTotal - purchaseDueTotal,
            dueTotal: purchaseDueTotal,
            graphData:data
        }

        // Income Data
        let salesOrderData = await dashboardModel.listAllSalesOrder(u_id)
        let salesTotal = getTotalSalesByMonth(salesOrderData)
        // console.log(salesTotal)
        // Expense Data
        let expenseData = await dashboardModel.listAllExpenses(u_id)
        let expenseTotal = getTotalSalesByMonth(expenseData)

        let incomeAndExpense = { salesOrderData, salesTotal, expenseData, expenseTotal }


        if (invoiceData.length > 0) {
            return res.send({
                result: true,
                message: "Fetched Data Successfully",
                data: { recievableData, payableData, incomeAndExpense }
            });
        } else {
            return res.send({
                result: false,
                message: "Failed to fetch data",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};