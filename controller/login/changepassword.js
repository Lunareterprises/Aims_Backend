var model = require("../../model/login/changepassword");
// var { languages } = require("../languages/languageFunc");
var bcrypt = require("bcrypt");

module.exports.ChangePassword = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        result: false,
        message: "insufficient parameters",
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    if (CheckUser.length > 0) {
      var hashedPassword = await bcrypt.hash(password, 10);
      await model.ChangepasswordQuery(hashedPassword, email);
      return res.send({
        result: true,
        message: "password has been changed successfully",
      });
    } else {
      return res.send({
        result: false,
        message: "user does not exist",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
