var model = require("../../model/register/client_register");

//Add Client

module.exports.client_register = async (req, res) => {
  try {
    var {
      c_client_Companyname,
      c_clientname,
      c_clientproject_name,
      gst_number,
      vat_number,
      c_email,
      c_ph,
      c_budget,
      c_date,
      c_project_deliverydate,
    } = req.body;

    // Validate the input parameters
    if (

      !c_clientname ||
      !c_clientproject_name ||
      !c_email ||
      !c_ph ||
      !c_budget ||
      !c_date ||
      !c_project_deliverydate
    ) {
      return res.send({
        result: false,
        message: "Insufficient parameters",
      });
    }

    // Call the model function to add a client
    var adduser = await model.client_register(
      c_client_Companyname,
      c_clientname,
      c_clientproject_name,
      gst_number,
      vat_number,
      c_email,
      c_ph,
      c_budget,
      c_date,
      c_project_deliverydate
    );

    if (adduser.affectedRows > 0) {
      return res.send({
        result: true,
        message: "Client registered successfully",
      });
    } else {
      return res.send({
        result: false,
        message: "Client registration failed",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};

//Add list of clients

module.exports.client_register_list = async (req, res) => {
  try {
    var c_clientname = await model.client_list();

    if (c_clientname.length > 0) {
      return res.send({
        result: true,
        message: "Your Client List Here",
        data: c_clientname,
      });
    } else {
      return res.send({
        result: false,
        message: "No clients found",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
