let model = require('../model/item_groups')
let formidable = require('formidable')
let fs = require('fs')
let path = require('path')

module.exports.CreateItemGroup = async (req, res) => {
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
            var { ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_attributes, ig_items } = fields;
            if (!ig_type || !ig_name || !ig_unit_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let unitData = await model.FindUnitData(ig_unit_id, u_id)
            if (ig_unit_id && unitData.length === 0) {
                return res.send({
                    result: false,
                    message: "Unit not found. Invalid unit id."
                })
            }
            let manufactureData = await model.FindManufactureData(ig_manufacture_id, u_id)
            if (ig_manufacture_id && manufactureData.length === 0) {
                return res.send({
                    result: false,
                    message: "Manufacture not found. Invalid manufacture id."
                })
            }
            let brandData = await model.FindBrandData(ig_brand_id, u_id)
            if (ig_brand_id && brandData.length === 0) {
                return res.send({
                    result: false,
                    message: "Brand data not found. Invalid brand id."
                })
            }
            let additem = await model.CreateItemGroup(ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, u_id);
            if (additem.affectedRows > 0) {
                let items = JSON.parse(ig_items)
                if (items && items.length > 0) {
                    for (let item of items) {
                        const { name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point } = item
                        await model.InsertItemGroupItems(name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point, additem.insertId)
                    }
                }
                let attributes = JSON.parse(ig_attributes)
                if (attributes && attributes.length > 0) {
                    for (let item of attributes) {
                        const { attribute, options } = item
                        await model.CreateAttribute(attribute, options, additem.insertId)
                    }
                }
                const uploadDir = path.join(process.cwd(), 'uploads', 'itemsGroup');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                let imagepath = null;
                const fileImages = Array.isArray(files.image) ? files.image : [files.image]; // normalize to array
                for (let image of fileImages) {
                    const oldPath = image?.filepath;
                    const newPath = path.join(uploadDir, image?.originalFilename);
                    try {
                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);
                        imagepath = "/uploads/itemsGroup/" + image?.originalFilename;
                        await model.InsertImage(imagepath, additem.insertId);
                    } catch (err) {
                        console.error("Error saving image:", err);
                    }
                }
                return res.send({
                    result: true,
                    message: "Item Group created successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to create Item Group"
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

module.exports.EditItemGroup = async (req, res) => {
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
            var { ig_id, ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, ig_attributes, ig_items } = fields;
            if (!ig_id || !ig_type || !ig_name || !ig_unit_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let groupData = await model.GetGroupData(ig_id, u_id)
            if (groupData.length === 0) {
                return res.send({
                    result: false,
                    message: "Item group data not found. Invlaid id"
                })
            }
            let unitData = await model.FindUnitData(ig_unit_id, u_id)
            if (ig_unit_id && unitData.length === 0) {
                return res.send({
                    result: false,
                    message: "Unit not found. Invalid unit id."
                })
            }
            let manufactureData = await model.FindManufactureData(ig_manufacture_id, u_id)
            if (ig_manufacture_id && manufactureData.length === 0) {
                return res.send({
                    result: false,
                    message: "Manufacture not found. Invalid manufacture id."
                })
            }
            let brandData = await model.FindBrandData(ig_brand_id, u_id)
            if (ig_brand_id && brandData.length === 0) {
                return res.send({
                    result: false,
                    message: "Brand data not found. Invalid brand id."
                })
            }
            let additem = await model.UpdateItemGroupData(ig_type, ig_name, ig_excise_product, ig_description, ig_returnable_item, ig_unit_id, ig_manufacture_id, ig_tax, ig_brand_id, ig_tax_preference, ig_inventory_valuation, ig_attributes_and_options, ig_item_type, ig_opening_stock, ig_sales_account, ig_purchase_account, ig_inventory_account, u_id);
            if (additem.affectedRows > 0) {
                let items=JSON.parse(ig_items)
                if (items && items.length > 0) {
                    for (let item of items) {
                        const { item_id, name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point } = item
                        await model.EditItemGroupItems(item_id, name, sku, opening_stock, opening_stock_value, cost_price, sales_price, upc, ean, isbn, reorder_point, additem.insertId)
                    }
                }
                let attributes=JSON.parse(ig_attributes)
                if (attributes && attributes.length > 0) {
                    for (let item of attributes) {
                        const { attribute_id, attribute, options } = item
                        await model.EditAttributes(attribute_id, attribute, options)
                    }
                }
                const uploadDir = path.join(process.cwd(), 'uploads', 'itemsGroup');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                let imagepath = null;
                const fileImages = Array.isArray(files.image) ? files.image : [files.image]; // normalize to array

                for (let image of fileImages) {
                    const oldPath = image?.filepath;
                    const newPath = path.join(uploadDir, image?.originalFilename);
                    try {
                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        imagepath = "/uploads/itemsGroup/" + image?.originalFilename;
                        await model.InsertImage(imagepath, additem.insertId);
                    } catch (err) {
                        console.error("Error saving image:", err);
                    }
                }
                return res.send({
                    result: true,
                    message: "Item Group created successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to create Item Group"
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

module.exports.DeleteItemGroupImage = async (req, res) => {
    try {
        let { u_id } = req.user
        let { igi_id, ig_id } = req.body
        if (!igi_id || !ig_id) {
            return res.send({
                result: false,
                message: "Image id and item group id is required."
            })
        }
        let getImage = await model.GetImage(igi_id, ig_id)
        if (getImage.length === 0) {
            return res.send({
                result: false,
                message: "Image not found. Invalid image id."
            })
        }
        let deletedData = await model.DeleteItemGroupImage(igi_id)
        if (deletedData.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Image deleted successfully."
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

module.exports.ListGroupItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let groupList = await model.ListGroupItem(u_id)
        if (groupList.length > 0) {
            return res.send({
                result: true,
                message: "Group list found.",
                data: groupList
            })
        } else {
            return res.send({
                result: false,
                message: "Group list not found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteItemGroup = async (req, res) => {
    try {
        let { u_id } = req.user
        let { ig_id } = req.body
        if (!ig_id) {
            return res.send({
                result: false,
                message: "Item group id is required."
            })
        }
        let deletedData = await model.DeleteItemGroup(ig_id, u_id)
        if (deletedData.affectedRows > 0) {
            await model.DeleteAllImages(ig_id)
            await model.DeleteAllAttributes(ig_id)
            return res.send({
                result: true,
                message: "Items group deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete item group."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetItemGroupData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { ig_id } = req.body
        if (!ig_id) {
            return res.send({
                result: false,
                message: "Item group id is required."
            })
        }
        let groupData = await model.GetGroupData(ig_id, u_id)
        if (groupData.length === 0) {
            return res.send({
                result: false,
                message: "Item group data not found. Invlaid id"
            })
        } else {
            return res.send({
                result: true,
                message: "Data found successfully.",
                data: groupData
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}