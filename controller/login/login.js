
var model = require("../../model/login/login");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

module.exports.Login = async (req, res) => {
    try {

        let password = req.body.password;
        let email = req.body.email;
        if (
            !password ||
            !email
        ) {
            return res.send({
                result: false,
                message: "insufficient parameters",
            });
        }
        let CheckUser = await model.CheckUserQuery(email);

        if (CheckUser.length > 0) {
            let Checkpassword = await bcrypt.compare(
                password,
                CheckUser[0].u_password
            );
            if (Checkpassword == true) {
                const payload = {
                    email: CheckUser[0].u_email,
                    u_id: CheckUser[0].u_id
                };

                const token = jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {}
                );
                let changeloginstatus = await model.ChangeLoginStatus(CheckUser[0]?.u_id, email)

                return res.send({
                    result: true,
                    message: "logged in successfully",
                    u_id: CheckUser[0].u_id,
                    user_token: token,

                })
            } else {
                return res.send({
                    result: false,
                    message: "incorrect password please check and try again",
                });
            }
        } else {
            return res.send({
                result: false,
                message: "email not registered with us",
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};