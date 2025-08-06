
var model = require('../../model/purchase/listvendor')

module.exports.ListVendors = async (req, res) => {
    try {
        let { u_id } = req.user
        var { vendor_id, filter } = req.body
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (vendor_id) {
            condition = `and ve_id = ${vendor_id}`

        }

        if (search) {
            condition = ` and (ve_first_name like '%${search}%' or ve_company_name like '%${search}%')`
        }
        let selectVendors = await model.SelectVendors(u_id, condition);
        let listVendors = await model.ListVendors(u_id, filter, condition, starting_offset, limit);

        var data = await Promise.all(
            listVendors.map(async (el) => {
                let vendor_id = el.ve_id;

                let getcontactperson = await model.GetContactPersons(vendor_id)
                let getbankdetails = await model.GetBankDetails(vendor_id)
                let getdocuments = await model.GetDocuments(vendor_id)
                console.log(getcontactperson, "ccc");

                el.contact_persons = getcontactperson;
                el.bank_details = getbankdetails;
                el.documents = getdocuments;
                return el
            })
        )
        return res.send({
            result: true,
            message: "Data retrived",
            total_count: selectVendors.length,
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