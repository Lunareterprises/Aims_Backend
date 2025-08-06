
var model = require('../../model/sales/listsalesorder')

module.exports.ListSalesOrder = async (req, res) => {
    try {
        let { u_id } = req.user
        var { so_id, filter } = req.body

        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (so_id) {
            condition = `and so_id = ${so_id}`
        }

        if (search) {
            condition = ` and (so_customer_name like '%${search}%' or so_order_date like '%${search}%')`
        }

        let selectSalesOrder = await model.SelectSalesOrder(u_id, condition);
        let listSalesOrder = await model.ListSalesOrder(u_id, filter, condition, starting_offset, limit);


        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        var data = await Promise.all(
            listSalesOrder.map(async (el) => {
                let SalesOrder_id = el.so_id;

                let getsalesorderitem = await model.GetSalesOderItem(SalesOrder_id)
                let getdocuments = await model.GetDocuments(SalesOrder_id)
                console.log(getdocuments, "ccc");

                el.sales_order_item = getsalesorderitem;
                el.documents = getdocuments;

                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectSalesOrder.length,
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