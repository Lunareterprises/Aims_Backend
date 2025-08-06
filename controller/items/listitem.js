var model = require("../../model/items/listitem");
module.exports.ListItem = async (req, res) => {
    try {
        var { u_id } = req.user
        var { search, filter, type } = req.body;
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no;
        let condition = ``;
        if (search) {
            condition = ` and (i_name like '%${search}%' or i_unit like '%${search}%')`
        }
        let selectitem = await model.SelectItem(u_id, condition, type, filter);
        let itemlist = await model.ItemList(u_id, filter, condition, starting_offset, limit, type);
        console.log("itemlist : ", itemlist)

        if (itemlist.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived",
                total_count: selectitem.length,
                list: itemlist
            })
        } else {
            return res.send({
                result: false,
                message: "failed to get Data "
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};