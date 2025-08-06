let model = require('../model/composite_items')
let formidable = require('formidable')
let fs = require('fs')


module.exports.CreateCompositeItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { name, sku, unit_id, sales_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor_id, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point, associate_items } = fields;
            if (!name || !unit_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let unitData = await model.FindUnitData(unit_id, u_id)
            if (unit_id && unitData.length === 0) {
                return res.send({
                    result: false,
                    message: "Unit not found. Invalid unit id."
                })
            }
            let manufactureData = await model.FindManufactureData(manufacture_id, u_id)
            if (manufacture_id && manufactureData.length === 0) {
                return res.send({
                    result: false,
                    message: "Manufacture not found. Invalid manufacture id."
                })
            }
            let brandData = await model.FindBrandData(brand_id, u_id)
            if (brand_id && brandData.length === 0) {
                return res.send({
                    result: false,
                    message: "Brand data not found. Invalid brand id."
                })
            }
            let vendorData = await model.FindVendorData(preferred_vendor_id, u_id)
            if (preferred_vendor_id && vendorData.length === 0) {
                return res.send({
                    result: false,
                    message: "Vendor data not found. Invalid vendor id."
                })
            }
            let additem = await model.CreateCompositeItem(u_id, sku, name, unit_id, sales_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor_id, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point);
            if (additem.affectedRows > 0) {
                let associate_item = JSON.parse(associate_items)
                if (associate_item && associate_item.length > 0) {
                    for (let item of associate_item) {
                        const { item_id, quantity, selling_price, cost_price } = item
                        let itemData = await model.CheckItem(item_id, u_id)
                        if (itemData.length == 0) {
                            return res.send({
                                result: false,
                                message: "Item not found. Invalid item id."
                            })
                        }
                        await model.InsertAssociateItems(item_id, quantity, selling_price, cost_price, additem.insertId)
                    }
                }
                let imagepath = null
                if (files.image) {
                    if (files?.image?.length > 0) {
                        for (let image of files.image) {
                            var oldPath = image?.filepath;
                            var newPath = process.cwd() + "/uploads/items/" + image?.originalFilename
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData)
                            imagepath = "/uploads/items/" + image?.originalFilename
                            await model.InsertImage(imagepath, additem.insertId)
                        }
                    } else {
                        var oldPath = files?.image?.filepath;
                        var newPath = process.cwd() + "/uploads/items/" + files?.image?.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData)
                        imagepath = "/uploads/items/" + files?.image?.originalFilename
                        await model.InsertImage(imagepath, additem.insertId)
                    }
                }
                return res.send({
                    result: true,
                    message: "Item Details added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Item Details"
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

module.exports.EditCompositeItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var { composite_item_id, name, sku, unit_id, sales_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor_id, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point, associate_items } = fields;
            if (!composite_item_id || !name || !unit_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let compositeData = await model.GetCompositeItems(composite_item_id, u_id)
            if (compositeData.length === 0) {
                return res.send({
                    result: false,
                    message: "Composite item data not found. Invalid composite id."
                })
            }
            let unitData = await model.FindUnitData(unit_id, u_id)
            if (unit_id && unitData.length === 0) {
                return res.send({
                    result: false,
                    message: "Unit not found. Invalid unit id."
                })
            }
            let manufactureData = await model.FindManufactureData(manufacture_id, u_id)
            if (manufacture_id && manufactureData.length === 0) {
                return res.send({
                    result: false,
                    message: "Mnaufacture not found. Invalid manufacture id."
                })
            }
            let brandData = await model.FindBrandData(brand_id, u_id)
            if (brand_id && brandData.length === 0) {
                return res.send({
                    result: false,
                    message: "Brand data not found. Invalid brand id."
                })
            }
            let vendorData = await model.FindVendorData(preferred_vendor_id, u_id)
            if (preferred_vendor_id && vendorData.length === 0) {
                return res.send({
                    result: false,
                    message: "Vendor data not found. Invalid vendor id."
                })
            }
            let additem = await model.EditCompositeItem(composite_item_id, u_id, sku, name, unit_id, sales_price, sales_account, sales_description, purchase_cost_price, purchase_account, purchase_description, preferred_vendor_id, handsOnStock, inventory_account, inventory_valuation_method, rate_per_unit, returnable_item, dimension_unit, dimension_value, weight_unit, weight_value, manufacture_id, brand_id, upc, mpn, ean, isbn, tax, reorder_point);
            if (additem.affectedRows > 0) {
                let associate_item=JSON.parse(associate_items)
                if (associate_item && associate_item.length > 0) {
                    for (let item of associate_item) {
                        const { item_id, quantity, selling_price, cost_price } = item
                        let itemData = await model.CheckItem(item_id, u_id)
                        if (itemData.length == 0) {
                            return res.send({
                                result: false,
                                message: "Item not found. Invalid item id."
                            })
                        }
                        await model.InsertAssociateItems(item_id, quantity, selling_price, cost_price, additem.insertId)
                    }
                }
                let imagepath = null
                if (files.newimage.length > 0) {
                    for (let image of files.newimage) {
                        var oldPath = image?.filepath;
                        var newPath = process.cwd() + "/uploads/items/" + image?.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData)
                        imagepath = "/uploads/items/" + image?.originalFilename
                        await model.InsertImage(imagepath, composite_item_id)
                    }
                } else {
                    var oldPath = files?.newimage?.filepath;
                    var newPath = process.cwd() + "/uploads/items/" + files?.newimage?.originalFilename
                    let rawData = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, rawData)
                    imagepath = "/uploads/items/" + files?.newimage?.originalFilename
                    await model.InsertImage(imagepath, composite_item_id)
                }
                return res.send({
                    result: true,
                    message: "Item Details added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Item Details"
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

module.exports.ListCompositeItems = async (req, res) => {
    try {
        let { u_id } = req.user
        let compositeData = await model.ListCompositeItem(u_id)
        if (compositeData.length >= 0) {
            return res.send({
                result: true,
                message: "Successfully retrieved composite data.",
                data: compositeData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrive composite data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteImage = async (req, res) => {
    try {
        let { u_id } = req.user
        let { image_id, composite_item_id } = req.body
        if (!image_id || !composite_item_id) {
            return res.send({
                result: false,
                message: "Image id and composite item id is required"
            })
        }
        let imageData = await model.GetImage(image_id, composite_item_id)
        if (imageData.length === 0) {
            return res.send({
                result: false,
                message: "Image not found. Invalid image id."
            })
        }
        let deletedImage = await model.DeleteImage(image_id)
        if (deletedImage.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Successfully deleted image."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete image."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteCompositeItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { composite_item_id } = req.body
        if (!composite_item_id) {
            return res.send({
                result: false,
                message: "Composite item id is required."
            })
        }
        let deletedData = await model.DeleteCompositeItem(composite_item_id, u_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Composite item deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete composite item."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetCompositeItemData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { composite_item_id } = req.body
        if (!composite_item_id) {
            return res.send({
                result: false,
                message: "Composite item id is required."
            })
        }
        let compositeData = await model.GetCompositeItems(composite_item_id, u_id)
        if (compositeData.length > 0) {
            return res.send({
                result: true,
                message: "Data founded.",
                data: compositeData
            })
        } else {
            return res.send({
                result: false,
                message: "Data not found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}