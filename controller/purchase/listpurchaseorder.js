
var model = require('../../model/purchase/listpurchaseorder')

module.exports.ListPurchaseOrder = async (req, res) => {
    try {
        let { u_id } = req.user
        var { po_id, filter } = req.body

        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (po_id) {
            condition = `and po_id = ${po_id}`
        }

        if (search) {
            condition = ` and (po_vendor_name like '%${search}%' or po_delivery_customer_name like '%${search}%')`
        }

        let selectPurchaseOrder = await model.SelectPurchaseOrder(u_id, condition);
        let listPurchaseOrder = await model.ListPurchaseOrder(u_id, filter, condition, starting_offset, limit);


        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        var data = await Promise.all(
            listPurchaseOrder.map(async (el) => {
                let PurchaseOrder_id = el.po_id;

                let getPurchaseOrderitem = await model.GetPurchaseOrderItem(PurchaseOrder_id)
                let getdocuments = await model.GetDocuments(PurchaseOrder_id)
                console.log(getdocuments, "ccc");

                el.purchase_order_item = getPurchaseOrderitem;
                el.documents = getdocuments;

                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectPurchaseOrder.length,
            list: data
        })
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
};