
var model = require('../../model/purchase/listbills')

module.exports.ListBills = async (req, res) => {
    try {
        let { u_id } = req.user
        var { bill_id, filter } = req.body

        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (bill_id) {
            condition = `and pb_id = ${bill_id}`
        }

        if (search) {
            condition = ` and (pb_vendor_name like '%${search}%' or pb_date like '%${search}%')`
        }

        let selectPurchase_Bills = await model.SelectPurchase_Bills(u_id, condition);
        let listPurchase_Bills = await model.ListPurchase_Bills(u_id, filter, condition, starting_offset, limit);


        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        var data = await Promise.all(
            listPurchase_Bills.map(async (el) => {
                let Purchase_Bills_id = el.pb_id;
                let getPurchase_Billsitem = await model.GetPurchase_Bills(Purchase_Bills_id)
                let getdocuments = await model.GetDocuments(Purchase_Bills_id)
                console.log(getdocuments, "ccc");
                el.bills_items = getPurchase_Billsitem;
                el.documents = getdocuments;
                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectPurchase_Bills.length,
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