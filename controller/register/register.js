var model = require('../../model/register/register');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var randtoken = require("rand-token").generator({
    chars: "0123456789",
});
var jwt = require('jsonwebtoken');
var moment = require('moment')


module.exports.Register = async (req, res) => {
    try {
        var { company_name, u_name, company_mail, company_mobile, password, country, currency } = req.body
        if (!company_name || !u_name || !company_mail || !company_mobile || !password || !country || !currency) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        var token = randtoken.generate(4);
        var salt = await bcrypt.genSalt(10);
        var hashedPassword = await bcrypt.hash(password, salt);
        let checkCompany = await model.CheckUserQuery(company_name);
        let checkmail = await model.CheckMail(company_mail);
        if (checkCompany.length > 0) {
            if (checkCompany[0]?.u_status == 'active') {
                return res.send({
                    result: false,
                    message: "Company name already taken"
                })
            }
        }
        if (checkmail.length > 0) {
            if (checkmail[0]?.u_status == 'active') {
                return res.send({
                    result: false,
                    message: "Email Id already taken"
                })
            }

        }
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "umeshudayan14@gmail.com",
                pass: "ntvowdicdtcnswhf",
            },
        });
        let info = await transporter.sendMail({
            from: "contact.crm@lunarsenterprises.com",
            to: company_mail,
            subject: "Your single-use code",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Single-Use Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                    .code {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        background-color: #28a745;
                        color: #fff;
                        font-size: 18px;
                        font-weight: bold;
                        border-radius: 5px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    
                    <div class="content">
                        <h1>Your Single-Use Code</h1>
                        <p>We received your request for a single-use code to use with your CRM software account.</p>
                        <p>Your single-use code is:</p>
                        <div class="code">${token}</div>
                        <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
                        <p>Thanks,<br>The CRM Software Account Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 CRM Software. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`,
        });
        // console.log('hai');
        nodemailer.getTestMessageUrl(info);
        console.log(info);
        if (checkmail.length == 0) {
            var adduser = await model.AddUser(company_name, u_name, company_mail, company_mobile, hashedPassword, country, currency);
            var user_i = adduser.insertId
        } else {
            var user_i = checkmail[0].u_id
        }
        var expirationDate = moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        let checkotp = await model.CheckOTP(user_i)
        console.log(expirationDate, "expiry");

        if (checkotp == 0) {
            await model.InsertVerificationQuery(user_i, token, expirationDate);
            return res.send({
                status: true,
                message: "verification code sent to your mail",
            })
        } else {
            await model.UpdatetVerificationQuery(token, expirationDate, user_i);
            return res.send({
                status: true,
                message: "verification code sent to your mail",
            })
        }
        // await model.InsertVerificationQuery(user_i, token);
        // return res.send({
        //     status: true,
        //     message: "verification code sent to your mail",
        // })

        // let adduser = await model.AddUser(company_name, u_name, company_mail, company_mobile, hashedPassword, role);
        if (adduser.affectedRows > 0) {
            return res.send({
                result: true,
                message: "User resgistered successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "User registeration failed"
            })
        }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
};


module.exports.RegisterVerify = async (req, res) => {
    try {
        var { email, otp } = req.body;
        if (!email || !otp) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        var SECRET_KEY = "dkjghkdghfhglknghdxlkdnflsfjopoijoigjhpokp";
        let verifymail = await model.CheckMail(email);
        if (verifymail.length > 0) {
            let user_id = verifymail[0].u_id;
            var loginstatus = verifymail[0]?.u_login_status

            let verifyotp = await model.VerifyOtp(user_id, otp);

            const otpexpiry = moment(verifyotp[0].uv_token_expiry)

            const date = moment().isAfter(otpexpiry);

            if (!verifyotp || date == true) {
                return res.send({
                    result: false,
                    message: "OTP expired,Please resend OTP"
                })
            } else {

                const payload = {
                    email: email,
                    u_id: user_id
                };

                const token = jwt.sign(
                    payload,
                    SECRET_KEY,
                    {}
                );
                return res.send({
                    result: true,
                    message: "Successfully verified",
                    user_id: user_id,
                    login_status: loginstatus,
                    user_token: token,
                })
            }
        } else {
            return res.send({
                result: false,
                message: "Mail not registered with us"
            })
        }
    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })

    }
}