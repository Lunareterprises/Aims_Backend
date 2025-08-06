
var model = require("../../model/sales/deleteslaessection");

module.exports.DeleteSalesSection = async (req, res) => {

    try {
        var { u_id } = req.user
        var { sales_order_id, dc_id, sales_order_item_id } = req.body;
        if (!sales_order_id) {
            return res.send({
                result: false,
                message: "Sales order id is required."
            })
        }
        if (sales_order_id) {
            let checksalesorder = await model.CheckSalesorderQuery(sales_order_id, u_id);
            if (checksalesorder.length == 0) {
                return res.send({
                    result: false,
                    message: "Sales order not found"
                });
            } else {

                var deletesalesorder = await model.RemoveSalesorderQuery(sales_order_id);

                var deletesalesitem = await model.RemoveSalesorderItemQuery(sales_order_id);

                var deletedoc = await model.RemoveSalesorderDocumentsQuery(sales_order_id);

                if (deletesalesorder.affectedRows && deletesalesitem.affectedRows) {
                    return res.send({
                        result: true,
                        message: "Sales order delete successfully"
                    })
                }
            }
        }
        if (dc_id) {
            let checkdeliverychallan = await model.CheckdeliverychallanQuery(dc_id, u_id);
            if (checkdeliverychallan.length == 0) {
                return res.send({
                    result: false,
                    message: "delivery challan not found"
                });
            } else {
                var deletedoc = await model.RemovedeliverychallanDocumentsQuery(sales_order_id);


                var deletedeliverysection = await model.RemovedeliverychallanQuery(dc_id);


            }
            return res.send({
                result: true,
                message: "delivery challan delete successfully"
            })
        }
        if (sales_order_item_id) {
            let checkdeliverychallan = await model.ChecksalesOrderItemQuery(sales_order_item_id);
            if (checkdeliverychallan.length == 0) {
                return res.send({
                    result: false,
                    message: "dales order item not found"
                });
            } else {


                var deletesection = await model.RemovesalesOrderItemQuery(sales_order_item_id);

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


