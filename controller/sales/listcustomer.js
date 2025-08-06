
var model = require('../../model/sales/listcustomer')

module.exports.ListCustomer = async (req, res) => {
    try {
        let { u_id } = req.user
        var { cust_id, filter } = req.body


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
        let selectcustomer = await model.Selectcustomer(u_id, condition);
        let listcustomer = await model.ListCustomer(u_id, filter, condition, starting_offset, limit);

        // console.log(itemlist.length,"ljdfgsldhfgadskjfvasdjvnasdbvkahsgh");
        var data = await Promise.all(
            listcustomer.map(async (el) => {
                let customer_id = el.cu_id;

                let getcontactperson = await model.GetContactPersons(customer_id)
                let getdocuments = await model.GetDocuments(customer_id)
                console.log(getdocuments, "ccc");

                el.contact_persons = getcontactperson;
                el.documents = getdocuments;

                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectcustomer.length,
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