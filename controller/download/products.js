let model = require('../../model/download/products')
const fs = require('fs')
const path = require('path');
const exceljs = require('exceljs');

module.exports.downloadProductList = async (req, res) => {
    try {
        let { u_id } = req.user
        let productData = await model.listAllProducts(u_id)
        if (productData.length > 0) {
            let user = await model.getUserDetails(u_id)
            const dirname = path.join(`${process.cwd()}/uploads/download`); // Corrected path
            // Ensure the folder exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true }); // Create directories recursively
            }

            const timestamp = Date.now(); // Get the current timestamp
            const outputFilePath = path.join(dirname, `Products_of_${user[0].u_name}_${timestamp}.xlsx`); // Full file path

            // Create a new workbook and add a worksheet
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Product List ${user[0].u_name}`);

            // Add headings and format the first section (similar to 'Withdraw Request' in previous code)
            let headingRow1 = worksheet.addRow(['Product List']);
            worksheet.mergeCells('A1:N1');
            headingRow1.getCell(1).font = { bold: true, size: 16, name: 'Liberation Serif' };
            headingRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            let headingRow2 = worksheet.addRow(["SL NO.", "TYPE", "NAME", "UNIT", "SALES PRICE", "SALES ACCOUNT", "SALES DESCRIPTION", "PURCHASE PRICE", "PURCHASE ACCOUNT", "PURCHASE DESCRIPTION", "PREFFERED VENDOR", "SALES STATUS", "PURCHASE STATUS", "STATUS"]);
            headingRow2.getCell(1).font = { bold: true, size: 14, name: 'Liberation Serif' };
            headingRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.addRow([]); // Empty row for spacing

            worksheet.columns = [
                { key: 'sl_no', width: 7 },
                { key: 'i_type', width: 21 },
                { key: 'i_name', width: 18 },
                { key: 'i_unit', width: 24 },
                { key: 'i_sales_price', width: 24 },
                { key: 'i_sales_account', width: 13 },
                { key: 'i_sales_description', width: 13 },
                { key: 'i_sales_status', width: 13 },
                { key: 'i_purchase_price', width: 13 },
                { key: 'i_purchase_account', width: 13 },
                { key: 'i_purchase_description', width: 13 },
                { key: 'i_purchase_status', width: 13 },
                { key: 'i_status', width: 13 },
                { key: 'i_preferred_vendor', width: 13 },

            ];

            // Add data rows to the worksheet
            productData.forEach((el, index) => {
                worksheet.addRow([
                    index + 1,
                    el.i_type,
                    el.i_name,
                    el.i_unit,
                    el.i_sales_price,
                    el.i_sales_account,
                    el.i_sales_description,
                    el.i_sales_status,
                    el.i_purchase_price,
                    el.i_purchase_description,
                    el.i_purchase_status,
                    el.i_preferred_vendor,
                    el.i_status,
                ]);
            });

            // Write the workbook to the file
            workbook.xlsx.writeFile(outputFilePath)
            return res.send({
                result: true,
                message: "data retrieved",
                file: req.protocol + "://" + req.get("host") + outputFilePath.replace(process.cwd(), '')
            })
        } else {
            return res.send({
                result: false,
                message: "No data found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}