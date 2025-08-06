var model = require('../../model/items/additem');
var formidable = require("formidable");
var fs = require("fs");

module.exports.ItemAdd = async (req, res) => {
    try {
        let { u_id } = req.user
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { type, name, sku, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, preferred_vendor_id, sales_status, purchase_status, handsOnStock, track_inventory, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, excise_product, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point } = fields;
            if (!u_id || !type || !name || !unit) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkadmin = await model.CheckItem(name, u_id);
            if (checkadmin.length > 0) {
                return res.send({
                    result: false,
                    message: "Item name already taken"
                })
            }
            let unitData = await model.CheckUnit(unit)
            if (unit && unitData.length === 0) {
                return res.send({
                    result: false,
                    message: "Unit not found. Invalid unit id"
                })
            }
            let manufactureData = await model.CheckManufacture(manufacture_id)
            if (manufacture_id && manufactureData.length === 0) {
                return res.send({
                    result: false,
                    message: "Manufacture not found. Invalid manufacture id"
                })
            }
            let brandData = await model.CheckBrand(brand_id)
            if (brand_id && brandData.length === 0) {
                return res.send({
                    result: false,
                    message: "Brand not found. Invalid brand id"
                })
            }
            let imagepath = null
            if (files.image) {
                var oldPath = files?.image?.filepath;
                var newPath = process.cwd() + "/uploads/items/" + files?.image?.originalFilename
                let rawData = fs.readFileSync(oldPath);
                fs.writeFileSync(newPath, rawData)
                imagepath = "/uploads/items/" + files?.image?.originalFilename
            }
            let additem = await model.AddItem(u_id, type, sku, name, unitData[0]?.un_id, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, preferred_vendor_id, sales_status, purchase_status, imagepath, handsOnStock, track_inventory, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, excise_product, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point);
            if (additem.affectedRows == 0) {
                return res.send({
                    result: false,
                    message: "failed to add Item Details"
                })
            } else {
                return res.send({
                    result: true,
                    message: "Item Details added successfully"
                })
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};
