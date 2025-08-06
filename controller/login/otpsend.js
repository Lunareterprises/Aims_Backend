var model = require("../../model/login/otpsend");
var nodemailer = require("nodemailer");
var randtoken = require("rand-token").generator({
  chars: "0123456789",
});

module.exports.ForgotPass = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.send({
        result: false,
        message: "insufficient parameters",
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    var token = randtoken.generate(4);
    console.log(token);


    if (CheckUser.length > 0) {
      let CheckVerificationCode = await model.CheckVerificationQuery(
        CheckUser[0].u_id
      );
      console.log(CheckUser[0].u_id);

      if (CheckVerificationCode.length > 0) {
        await model.UpdateVerificationQuery(token, CheckUser[0].u_id);
      } else {
        await model.InsertVerificationQuery(CheckUser[0].u_id, token);
      }
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "umeshudayan14@gmail.com",
          pass: "ntvowdicdtcnswhf",
        },
      });
      console.log("haiiiii", token);
      let info = await transporter.sendMail({
        from: "contact@bhakshanangal.com",
        to: email,
        subject: "Your single-use code",
        text: `
                We received your request for a single-use code to use with your CRM account.
              
                Your single-use code is: ${token}
              
                If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
              
                Thanks,
                CRM account team
              `,
      });
      // console.log('hai');
      nodemailer.getTestMessageUrl(info);
      console.log(info);
      return res.send({
        status: true,
        message: "verification code sent to ur mail",
      });
    } else {
      return res.send({
        result: false,
        message: "email not registered",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
