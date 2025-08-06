
var model = require('../../model/timetracking/listprojects')

module.exports.ListProject = async (req, res) => {
    try {
        let { user_id } = req.headers
        var { cust_id } = req.body


        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (cust_id) {
            condition = `and cu_id = ${cust_id}`

        }

        if (search) {
            condition = ` and (cu_first_name like '%${search}%' or cu_company_name like '%${search}%')`
        }
        let selectcustomer = await model.Selectcustomer(user_id, condition);
        let listcustomer = await model.ListCustomer(user_id, condition, starting_offset, limit);

        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");

        if (listcustomer.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived",
                total_count: selectcustomer.length,
                list: listcustomer
            })
        } else {
            return res.send({
                result: false,
                message: "failed to get Data "
            })
        }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
};