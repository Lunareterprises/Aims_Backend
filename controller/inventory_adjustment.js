let model = require('../model/inventory_adjustment')
let formidable = require('formidable')
let fs = require('fs')

module.exports.CreateInventoryAdjustment = async (req, res) => {
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
            var { mode, reference_number, date, account, reason_id, description, items } = fields;
            if (!mode || !date || !account | !reason_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let reasonData = await model.GetReason(reason_id, u_id)
            if (reason_id && reasonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Reason not found. Invalid reason id."
                })
            }
            let createInventory = await model.CreateInventoryAdjustments(mode, reference_number, date, account, reason_id, description, u_id);
            if (createInventory.affectedRows > 0) {
                let itemObject=JSON.parse(items)
                if (itemObject && itemObject.length > 0) {
                    for (let item of itemObject) {
                        const { item_id, description, available, changed, adjusted } = item
                        let itemData=await model.GetItemData(item_id,u_id)
                        if(itemData.length===0){
                            return res.send({
                                result:false,
                                message:"Item data not found."
                            })
                        }
                        await model.InsertItems(createInventory.insertId, item_id, description, available, changed, adjusted, u_id)
                    }
                }
                let imagepath = null
                if (files.image) {
                    if (files.image?.length > 0) {
                        for (let image of files.image) {
                            var oldPath = image?.filepath;
                            var newPath = process.cwd() + "/uploads/items/" + image?.originalFilename
                            let rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData)
                            imagepath = "/uploads/items/" + image?.originalFilename
                            await model.InsertImage(imagepath, createInventory.insertId)
                        }
                    } else {
                        var oldPath = files?.image?.filepath;
                        var newPath = process.cwd() + "/uploads/items/" + files?.image?.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData)
                        imagepath = "/uploads/items/" + files?.image?.originalFilename
                        await model.InsertImage(imagepath, createInventory.insertId)
                    }
                }
                return res.send({
                    result: true,
                    message: "Inventory adjustment created successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to create inventory adjustment"
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

module.exports.EditInventoryAdjustment = async (req, res) => {
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
            var { inventory_adjustment_id, mode, reference_number, date, account, reason_id, description, items } = fields;
            if (!inventory_adjustment_id || !mode || !date || !account | !reason_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameters"
                })
            }
            let checkData = await model.CheckInventoryData(inventory_adjustment_id, u_id)
            if (checkData.length === 0) {
                return res.send({
                    result: false,
                    message: "Inventory adjustment data not found. Invalid id."
                })
            }
            let reasonData = await model.GetReason(reason_id, u_id)
            if (reason_id && reasonData.length === 0) {
                return res.send({
                    result: false,
                    message: "Reason not found. Invalid reason id."
                })
            }
            let updateInventory = await model.EditInventoryAdjustment(inventory_adjustment_id, mode, reference_number, date, account, reason_id, description);
            if (updateInventory.affectedRows > 0) {
                if (items && items.length > 0) {
                    for (let item of items) {
                        const { iai_id, item_id, description, available, changed, adjusted } = item
                        await model.EditItems(iai_id, item_id, description, available, changed, adjusted)
                    }
                }
                let imagepath = null
                if (files.image.length > 0) {
                    for (let image of files.image) {
                        var oldPath = image?.filepath;
                        var newPath = process.cwd() + "/uploads/items/" + image?.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData)
                        imagepath = "/uploads/items/" + image?.originalFilename
                        await model.InsertImage(imagepath, updateInventory.insertId)
                    }
                } else {
                    var oldPath = files?.image?.filepath;
                    var newPath = process.cwd() + "/uploads/items/" + files?.image?.originalFilename
                    let rawData = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, rawData)
                    imagepath = "/uploads/items/" + files?.image?.originalFilename
                    await model.InsertImage(imagepath, updateInventory.insertId)
                }
                return res.send({
                    result: true,
                    message: "Inventory adjustment created successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to create inventory adjustment"
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

module.exports.DeleteInventoryImages = async (req, res) => {
    try {
        let { u_id } = req.user
        let { image_id, inventory_adjustment_id } = req.body
        if (!image_id || !inventory_adjustment_id) {
            return res.send({
                result: false,
                message: "Insufficient parameters"
            })
        }
        let inventoryData = await model.CheckInventoryData(inventory_adjustment_id, u_id)
        if (inventoryData.length === 0) {
            return res.send({
                result: false,
                message: "Inventory data not found."
            })
        }
        let checkImage = await model.CheckImage(image_id, inventory_adjustment_id)
        if (checkImage.length === 0) {
            return res.send({
                result: false,
                message: "Image not found."
            })
        }
        let deleted = await model.DeleteImage(image_id, inventory_adjustment_id)
        if (deleted.affectedRows > 0) {
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

module.exports.ListAllInventory = async (req, res) => {
    try {
        let { u_id } = req.user
        let inventoryData = await model.ListAllData(u_id)
        if (inventoryData?.length) {
            return res.send({
                result: true,
                message: "Data found",
                data: inventoryData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to fetch data."
            })
        }
    } catch (error) {
        return res.send({
            resilt: false,
            message: error.message
        })
    }
}

module.exports.DeleteInventoryItem = async (req, res) => {
    try {
        let { u_id } = req.user
        let { item_id, inventory_adjustment_id } = req.body
        if (!inventory_adjustment_id || !item_id) {
            return res.send({
                result: false,
                message: "Item id and Inventory adjustment id are required."
            })
        }
        let inventoryData = await model.CheckInventoryData(inventory_adjustment_id, u_id)
        if (inventoryData.length === 0) {
            return res.send({
                result: false,
                message: "Inventory data not found."
            })
        }
        let itemData = await model.CheckItem(item_id, inventory_adjustment_id)
        if (itemData.length === 0) {
            return res.send({
                result: false,
                message: "Item data not found."
            })
        }
        let deleted = await model.DeleteItem(item_id, inventory_adjustment_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Inventory item deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete inventory item"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.GetSingleData = async (req, res) => {
    try {
        let { u_id } = req.user
        let { inventory_adjustment_id } = req.body
        if (!inventory_adjustment_id) {
            return res.send({
                result: false,
                message: "Invetory adjustment id is required"
            })
        }
        let data = await model.CheckInventoryData(inventory_adjustment_id, u_id)
        if (data.length === 0) {
            return res.send({
                result: false,
                message: "Data not found"
            })
        }
        let singleData = await model.GetSingleData(inventory_adjustment_id, u_id)
        if (singleData.length > 0) {
            return res.send({
                result: true,
                message: "Data retrieved",
                data: singleData
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrive data."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.DeleteInventoryAdjustment = async (req, res) => {
    try {
        let { u_id } = req.user
        let { inventory_adjustment_id } = req.body
        if (!inventory_adjustment_id) {
            return res.send({
                result: false,
                message: "Inventory adjustment id is required"
            })
        }
        let data = await model.CheckInventoryData(inventory_adjustment_id, u_id)
        if (data.length === 0) {
            return res.send({
                result: false,
                message: "Data not found"
            })
        }
        let deleted = await model.DeleteInventoryAdjustments(inventory_adjustment_id, u_id)
        if(deleted.affectedRows>0){
            return res.send({
                result:true,
                message:"Inventory adjustment deleted successfully"
            })
        }else{
            return res.send({
                result:false,
                message:"Failed to delete adjustment successfully."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}