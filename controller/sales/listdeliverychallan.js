
var model = require('../../model/sales/listdeliverychallan')

module.exports.ListDeliveryChallan = async (req, res) => {
    try {
        let { u_id } = req.user
        var { dc_id, filter } = req.body
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;
        if (dc_id) {
            condition = `and dc_id = ${dc_id}`
        }
        if (search) {
            condition = ` and (dc_customer_name like '%${search}%' or dc_type like '%${search}%')`
        }
        let selectDeliveryChallan = await model.SelectDeliveryChallan(u_id, condition);
        let listDeliveryChallan = await model.ListDeliveryChallan(u_id, filter, condition, starting_offset, limit);
        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        var data = await Promise.all(
            listDeliveryChallan.map(async (el) => {
                let DeliveryChallan_id = el.dc_id;

                let getDeliveryChallanitem = await model.GetDeliveryChallanItem(DeliveryChallan_id)
                let getdocuments = await model.GetDocuments(DeliveryChallan_id)
                console.log(getdocuments, "ccc");

                el.contact_persons = getDeliveryChallanitem;
                el.documents = getdocuments;

                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectDeliveryChallan.length,
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