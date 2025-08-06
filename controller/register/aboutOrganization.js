var model = require("../../model/register/aboutOrganization");
module.exports.aboutOrganization = async (req, res) => {
    try {
        var { u_id } = req.user
        var { Org_name, industry, Org_location, state, base_currency, fiscal_year, language, tax_type, gst_num } = req.body;
        if ( !Org_name || !industry || !Org_location || !state || !base_currency || !fiscal_year || !language || !tax_type || !gst_num) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let addOrganization = await model.AddOrganization(u_id, Org_name, industry, Org_location, state, base_currency, fiscal_year, language, tax_type, gst_num);
        if (addOrganization.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Organization added successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to add Organization"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};