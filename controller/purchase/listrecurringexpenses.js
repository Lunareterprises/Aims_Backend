
var model = require('../../model/purchase/listrecurringexpenses')

module.exports.ListRecurringExpenses = async (req, res) => {
    try {
        let { u_id } = req.user
        var { re_id, filter } = req.body


        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (re_id) {
            condition = `and re_id = ${re_id}`
        }

        if (search) {
            condition = ` and (rb_vendor_name like '%${search}%' or rb_profile_name like '%${search}%')`
        }

        let selectRecurringExpenses = await model.SelectRecurringExpenses(u_id, condition);
        let listRecurringExpenses = await model.ListRecurringExpenses(u_id, filter, condition, starting_offset, limit);
        if (listRecurringExpenses.length == 0) {
            return res.send({
                result: false,
                message: "data not found"
            })
        }


        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        // var data = await Promise.all(
        //     listRecurringBills.map(async (el) => {
        //         let RecurringBills_id = el.re_id;

        //         let getRecurringBillsitem = await model.GetRecurringBillsItem(RecurringBills_id)
        //         console.log(getRecurringBillsitem, "ccc");

        //         el.recurring_bills_items = getRecurringBillsitem;

        //         return el
        //     })
        // )

        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectRecurringExpenses.length,
            list: listRecurringExpenses
        })
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
};