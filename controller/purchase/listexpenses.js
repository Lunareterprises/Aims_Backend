
var model = require('../../model/purchase/listexpenses')

module.exports.ListExpenses = async (req, res) => {
    try {
        let { u_id } = req.user
        var { expense_id, filter } = req.body
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;
        if (expense_id) {
            condition = `and ep_id = ${expense_id}`
        }
        if (search) {
            condition = ` and (ep_employee_name like '%${search}%' or ep_vendor_name like '%${search}%')`
        }
        let selectExpenses = await model.SelectExpenses(user_id, condition);
        let listExpenses = await model.ListExpenses(u_id, filter, condition, starting_offset, limit);
        var data = await Promise.all(
            listExpenses.map(async (el) => {
                let expense_id = el.ep_id;
                let getdocuments = await model.GetDocuments(expense_id)
                el.documents = getdocuments;
                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectExpenses.length,
            list: data
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};