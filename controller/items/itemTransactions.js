var model = require("../../model/items/itemTransactions");
let viewModel = require("../../model/items/viewitem");

module.exports.ListItemTransactions = async (req, res) => {
    try {
        var { u_id } = req.user
        var { item_id, type, status } = req.body;
        if (!type || !status) {
            return res.send({
                result: false,
                message: "Item id, Type and status is required"
            })
        }
        let itemData=await viewModel.CheckAdmin(item_id,u_id)
        if(itemData.length===0){
            return res.send({
                result:false,
                message:"Item data not found."
            })
        }
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        var ending_offset = limit * page_no;
        let transactionData = await model.listItemTransactions(item_id, type, status, page_no, limit);
        if (transactionData.length > 0) {
            transactionData.forEach(data => {
                if (data.items) {
                    data.items = JSON.parse(data.items);  // Convert string to JSON array
                }
            })
            return res.send({
                result: true,
                message: "Data retrived",
                total_count: transactionData.length,
                data: transactionData
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