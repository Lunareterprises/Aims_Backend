var model = require("../../model/login/otpverify");
module.exports.OtpVerify = async (req, res) => {
    try {
        var { email, otp } = req.body;
        if (!email || !otp) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let verifymail = await model.CheckMail(email);
        if (verifymail.length > 0) {
            let user_id = verifymail[0].u_id;
            let verifyotp = await model.VerifyOtp(user_id, otp);
            if (verifyotp.length > 0) {
                return res.send({
                    result: true,
                    message: "Successfully logged in"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to login"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Mail not registereed with us"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};