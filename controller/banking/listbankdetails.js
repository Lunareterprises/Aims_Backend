var model = require('../../model/banking/listbankdetails')

module.exports.ListbankDetails = async (req, res) => {
    try {
        let { u_id } = req.user
        let { bd_id } = req.body
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;

        if (bd_id) {
            condition = `and bd_id = ${bd_id}`
        }
        if (search) {
            condition = ` and (bd_acc_name like '%${search}%' or bd_acc_number like '%${search}%')`
        }
        let selectBankdetails = await model.SelectBankDetails(u_id, condition);
        let listbank = await model.ListBankDetailsQuery(u_id, condition, starting_offset, limit);

        if (listbank.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                total_count: selectBankdetails.length,
                list: listbank
            })
        } else {
            return res.send({
                result: false,
                message: "data not found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}