
var model = require("../../model/purchase/deletepurchasesection");

module.exports.DeleteVendorSection = async (req, res) => {

    try {
        var { u_id } = req.user
        var {expenses_id,vcp_id,bill_id,purchase_order_id,purchase_order_item_id,recrring_bill_id,re_id} = req.body;
        if (expenses_id) {
            let checkexpenses = await model.CheckExpensesQuery(expenses_id, u_id);
            if (checkexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "expense not found"
                });
            } else {
                var deleteexpenses = await model.RemoveExpensesQuery(expenses_id);
                var deletedoc = await model.RemoveExpensesDocumentsQuery(expenses_id);
            }
            return res.send({
                result: true,
                message: "Expenses delete successfully"
            })
        }

        if (vcp_id) {
            let checkexpenses = await model.CheckVendorcontperson(vcp_id);
            if (checkexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "expense not found"
                });
            } else {
                var deletesection = await model.RemoveVendorcontperson(vcp_id);
            }
        }
        if (bill_id) {
            let checkexpenses = await model.Checkbills(bill_id, u_id);
            if (checkexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "expense not found"
                });
            } else {
                var deletebillsection = await model.Removebills(bill_id, u_id);
                var deletedoc = await model.RemovebillsDoc(bill_id);
            }
        }
        if (recrring_bill_id) {
            let checkexpenses = await model.Checkrecurringbills(recrring_bill_id, u_id);
            if (checkexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "recurring bill  not found"
                });
            } else {
                var deleterecrringbillsection = await model.Removerecurringbills(recrring_bill_id);
                var deleteitems = await model.RemovebillsItems(recrring_bill_id);
            }
            return res.send({
                result: true,
                message: "delete successfully"
            })
        }
        if (re_id) {
            let checkRecurringexpenses = await model.CheckRecurringExpenses(re_id, u_id);
            if (checkRecurringexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "expense not found"
                });
            } else {
                var deletesection = await model.RemoveRecurringExpenses(re_id);
            }
        }
        if (purchase_order_id) {
            let checkPurchaseOrder = await model.CheckPurchaseOrderQuery(purchase_order_id, u_id);
            if (checkPurchaseOrder.length == 0) {
                return res.send({
                    result: false,
                    message: "Sales order not found"
                });
            } else {
                var deletePurchaseOrder = await model.RemovePurchaseOrderQuery(purchase_order_id);
                var deletesalesitem = await model.RemovePurchaseOrderItemQuery(purchase_order_id);
                var deletedoc = await model.RemovePurchaseOrderDocumentsQuery(purchase_order_id);
                if (deletePurchaseOrder.affectedRows && deletesalesitem.affectedRows) {
                    return res.send({
                        result: true,
                        message: "Sales order delete successfully"
                    })
                }
            }
        }
        if (purchase_order_item_id) {
            let checkRecurringexpenses = await model.Checkpurchaseorderitem(purchase_order_item_id);
            if (checkRecurringexpenses.length == 0) {
                return res.send({
                    result: false,
                    message: "expense not found"
                });
            } else {
                var deletesection = await model.Removepurchaseorderitem(re_id);
            }
        }
        if (deletesection.affectedRows > 0) {
            return res.send({
                result: true,
                message: "delete successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "failed to delete"
            })
        }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })

    }

}


