var model = require("../../model/register/reglist");
module.exports.RegList = async (req, res) => {
    try {
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        var search = req.body.search;
        let condition = ``;
        if (search) {
            condition = ` where (u_company_name like '%${search}%' or u_name like '%${search}%')`
        }

        let reglist = await model.ListReg(condition, starting_offset, limit);
        if (reglist.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived",
                list: reglist
            })
        } else {
            return res.send({
                result: false,
                message: "Data not found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};