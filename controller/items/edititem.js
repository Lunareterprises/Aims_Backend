var model = require('../../model/items/edititem')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditItem = async (req, res) => {
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
            var { item_id, type, name, sku, unit, selling_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor, preferred_vendor_id, sales_status, purchase_status, handsOnStock, track_inventory, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, excise_product, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point } = fields;
            if (!u_id || !item_id) {
                return res.send({
                    result: false,
                    messaage: "insufficient parameter"
                })
            }
            var checkitem = await model.CheckItemQuery(item_id, u_id)
            if (checkitem.length > 0) {
                let unitData = await model.CheckUnit(unit)
                if (unitData.length === 0) {
                    return res.send({
                        result: false,
                        message: "Unit not found. Invalid unit id"
                    })
                }
                let manufactureData = await model.CheckManufacture(manufacture_id)
                if (manufactureData.length === 0) {
                    return res.send({
                        result: false,
                        message: "Manufacture not found. Invalid manufacture id"
                    })
                }
                let brandData = await model.CheckBrand(brand_id)
                if (brandData.length === 0) {
                    return res.send({
                        result: false,
                        message: "Brand not found. Invalid brand id"
                    })
                }
                let condition = ``;
                if (type) {
                    if (condition == '') {
                        condition = `set i_type ='${type}' `
                    } else {
                        condition += `,i_type='${type}'`
                    }
                }
                if (name) {
                    if (condition == '') {
                        condition = `set i_name ='${name}' `
                    } else {
                        condition += `,i_name='${name}'`
                    }
                }
                if (unit) {
                    if (condition == '') {
                        condition = `set i_unit='${unitData[0].un_id}' `
                    } else {
                        condition += `,i_unit='${unitData[0].un_id}'`
                    }
                }
                if (selling_price) {
                    if (condition == '') {
                        condition = `set i_sales_price ='${selling_price}' `
                    } else {
                        condition += `,i_sales_price='${selling_price}'`
                    }
                }
                if (sales_account) {
                    if (condition == '') {
                        condition = `set i_sales_account ='${sales_account}' `
                    } else {
                        condition += `,i_sales_account='${sales_account}'`
                    }
                }
                if (sales_description) {
                    if (condition == '') {
                        condition = `set i_sales_description ='${sales_description}' `
                    } else {
                        condition += `,i_sales_description='${sales_description}'`
                    }
                }
                if (purchase_cost_price) {
                    if (condition == '') {
                        condition = `set i_purchase_price ='${purchase_cost_price}' `
                    } else {
                        condition += `,i_purchase_price='${purchase_cost_price}'`
                    }
                }
                if (purchase_account) {
                    if (condition == '') {
                        condition = `set i_purchase_account ='${purchase_account}' `
                    } else {
                        condition += `,i_purchase_account='${purchase_account}'`
                    }
                }
                if (purchase_description) {
                    if (condition == '') {
                        condition = `set i_purchase_description ='${purchase_description}' `
                    } else {
                        condition += `,i_purchase_description='${purchase_description}'`
                    }
                }
                if (preferred_vendor) {
                    if (condition == '') {
                        condition = `set i_preferred_vendor ='${preferred_vendor}' `
                    } else {
                        condition += `,i_preferred_vendor='${preferred_vendor}'`
                    }
                }
                if (preferred_vendor_id) {
                    if (condition == '') {
                        condition = `set i_preferred_vendor_id ='${preferred_vendor_id}' `
                    } else {
                        condition += `,i_preferred_vendor_id='${preferred_vendor_id}'`
                    }
                }
                if (sales_status) {
                    if (condition == '') {
                        condition = `set i_sales_status ='${sales_status}' `
                    } else {
                        condition += `,i_sales_status='${sales_status}'`
                    }
                }
                if (purchase_status) {
                    if (condition == '') {
                        condition = `set i_purchase_status ='${purchase_status}' `
                    } else {
                        condition += `,i_purchase_status='${purchase_status}'`
                    }
                }
                if (handsOnStock) {
                    if (condition == '') {
                        condition = `set handsOnStock='${handsOnStock}'`
                    } else {
                        condition += `,handsOnStock='${handsOnStock}'`
                    }
                }
                if (track_inventory) {
                    if (condition == '') {
                        condition = `set i_track_inventory='${track_inventory}'`
                    } else {
                        condition += `,i_track_inventory='${track_inventory}'`
                    }
                }
                if (inventory_account) {
                    if (condition == '') {
                        condition = `set i_inventory_account='${inventory_account}'`
                    } else {
                        condition += `,i_inventory_account='${inventory_account}'`
                    }
                }
                if (inventory_valuation_method) {
                    if (condition == '') {
                        condition = `set i_valuation_method='${inventory_valuation_method}'`
                    } else {
                        condition += `,i_valuation_method='${inventory_valuation_method}'`
                    }
                }
                if (rate_per_unit) {
                    if (condition == '') {
                        condition = `set i_rate_per_unit='${rate_per_unit}'`
                    } else {
                        condition += `,i_rate_per_unit='${rate_per_unit}'`
                    }
                }
                if (sku) {
                    if (condition == '') {
                        condition = `set i_sku='${sku}'`
                    } else {
                        condition += `,i_sku='${sku}'`
                    }
                }
                if (returnable_item) {
                    if (condition == '') {
                        condition = `set i_returnable_item='${returnable_item}'`
                    } else {
                        condition += `,i_returnable_item='${returnable_item}'`
                    }
                }
                if (excise_product) {
                    if (condition == '') {
                        condition = `set i_excise_product='${excise_product}'`
                    } else {
                        condition += `,i_excise_product='${excise_product}'`
                    }
                }
                if (dimension_unit) {
                    if (condition == '') {
                        condition = `set i_dimension_unit='${dimension_unit}'`
                    } else {
                        condition += `,i_dimension_unit='${dimension_unit}'`
                    }
                }
                if (dimension_value) {
                    if (condition == '') {
                        condition = `set i_dimension_value='${dimension_value}'`
                    } else {
                        condition += `,i_dimension_value='${dimension_value}'`
                    }
                }
                if (weight_unit) {
                    if (condition == '') {
                        condition = `set i_weight_unit='${weight_unit}'`
                    } else {
                        condition += `,i_weight_unit='${weight_unit}'`
                    }
                }
                if (weight_value) {
                    if (condition == '') {
                        condition = `set i_weight_value='${weight_value}'`
                    } else {
                        condition += `,i_weight_value='${weight_value}'`
                    }
                }
                if (manufacture_id) {
                    if (condition == '') {
                        condition = `set i_manufacture='${manufacture_id}'`
                    } else {
                        condition += `,i_manufacture='${manufacture_id}'`
                    }
                }
                if (brand_id) {
                    if (condition == '') {
                        condition = `set i_brand='${brand_id}'`
                    } else {
                        condition += `,i_brand='${brand_id}'`
                    }
                }
                if (upc) {
                    if (condition == '') {
                        condition = `set i_upc='${upc}'`
                    } else {
                        condition += `,i_upc='${upc}'`
                    }
                }
                if (mpn) {
                    if (condition == '') {
                        condition = `set i_mpn='${mpn}'`
                    } else {
                        condition += `,i_mpn='${mpn}'`
                    }
                }
                if (ean) {
                    if (condition == '') {
                        condition = `set i_ean='${ean}'`
                    } else {
                        condition += `,i_ean='${ean}'`
                    }
                }
                if (isbn) {
                    if (condition == '') {
                        condition = `set i_isbn='${isbn}'`
                    } else {
                        condition += `,i_isbn='${isbn}'`
                    }
                }
                if (tax) {
                    if (condition == '') {
                        condition = `set i_tax='${tax}'`
                    } else {
                        condition += `,i_tax='${tax}'`
                    }
                }
                if (reorder_point) {
                    if (condition == '') {
                        condition = `set i_reorder_point='${reorder_point}'`
                    } else {
                        condition += `,i_reorder_point='${reorder_point}'`
                    }
                }

                if (condition !== '') {
                    var Edititem = await model.ChangeItem(condition, item_id, u_id)
                }
                if (Edititem) {

                    var filekeys = Object.keys(files)
                    // console.log(filekeys, "filekeys")
                    const files_ids = filekeys.filter(item => item !== 'image')
                    if (files_ids.length == 0) {
                        let deletefiles = await model.DeleteFilesQuery(item_id)
                    }

                    if (files.image) {
                        var oldPath = files.image.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/items/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var image = "/uploads/items/" + files.image.originalFilename
                        // console.log(name, price, image, description, stocks, quantity, unit);

                        var Insertitemimage = await model.Updateimage(image, item_id, u_id)
                        if (Insertitemimage.affectedRows) {
                            return res.send({
                                result: true,
                                message: "item updated successfully"
                            })
                        } else {
                            return res.send({
                                result: false,
                                message: "failed to update item"
                            })
                        }
                    }
                    return res.send({
                        result: true,
                        message: "item updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update item"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "item does not exists"
                })
            }
        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

