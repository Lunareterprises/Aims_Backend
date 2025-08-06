var model = require("../model/payment_list");

module.exports.paymentList = async (req, res) => {
  try {
    let paymentlist = await model.paymentlistquery();

    var data = await Promise.all(
      paymentlist.map(async (item) => {
        var Client_id = item.py_client_id;
        let Client_details = await model.Client_detailsquery(Client_id);
        item.client_name = Client_details[0]?.c_clientname;
        item.clientproject_name = Client_details[0]?.c_clientproject_name;

        return item;
      })
    );
    const totallength = paymentlist.length;

    if (paymentlist.length > 0) {
      return res.send({
        result: true,
        message: "data kitteee",
        list: data,
        totallength: totallength,
      });
    } else {
      return res.send({
        result: false,
        message: "data kittilaaa",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
