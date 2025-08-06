var express = require('express')
var route = express.Router()
var { verifyToken } = require('./components/jwt')

/// HAVE TO GIVE TO ALL API TO VERIFY THE ROLE BASED ACCESS
let { authorize } = require('./components/auth')


var { ItemAdd } = require('./controller/items/additem');
route.post('/item/add', verifyToken, ItemAdd)

var { ListItem } = require("./controller/items/listitem");
route.post('/item/list', verifyToken, ListItem)

var { ViewItem } = require('./controller/items/viewitem');
route.post('/item/view', verifyToken, ViewItem)

var { EditItem } = require('./controller/items/edititem');
route.post('/item/edit', verifyToken, EditItem)

var { DeleteItem } = require('./controller/items/deleteitem');
route.post('/item/delete', verifyToken, DeleteItem)

var { ListItemTransactions } = require('./controller/items/itemTransactions')
route.post('/item/transactions', verifyToken, ListItemTransactions)

let { UpdateItemStatus } = require('./controller/items/updateStatus')
route.post('/item/update_status', verifyToken, UpdateItemStatus)

var { Register } = require("./controller/register/register");
route.post('/user/registeration', Register)

var { RegisterVerify } = require("./controller/register/register");
route.post('/user/RegisterVerifyOTP', RegisterVerify)

var { Login } = require("./controller/login/login");
route.post('/user/login', Login)

var { ForgotPass } = require("./controller/login/otpsend");
route.post('/forgotpass/otp', ForgotPass)

var { OtpVerify } = require("./controller/login/otpverify");
route.post('/otp/verify', OtpVerify)

var { ChangePassword } = require("./controller/login/changepassword");
route.post('/changepass', ChangePassword)

var { AddUnit } = require("./controller/unit/unitadd");
route.post('/unit/add', verifyToken, AddUnit)

var { ListUnit } = require("./controller/unit/listunit");
route.post('/unit-list', verifyToken, ListUnit)

var { DeleteUnit } = require("./controller/unit/deleteunit");
route.post('/unit-delete', verifyToken, DeleteUnit)

var { AddCustomer } = require("./controller/sales/addcustomer")
route.post('/add-customer', verifyToken, AddCustomer)

var { EditCustomer } = require("./controller/sales/editcustomer");
route.post('/edit/customer', verifyToken, EditCustomer)

var { ListCustomer } = require("./controller/sales/listcustomer")
route.post('/list/customers', verifyToken, ListCustomer)

var { DeleteCustomer } = require("./controller/sales/deletecustomer");
route.post('/delete/customer', verifyToken, DeleteCustomer)

let { UpdateCustomerStatus } = require('./controller/customer')
route.post('/customer/update_status', verifyToken, UpdateCustomerStatus)

var { RegList } = require("./controller/register/reglist");
route.post('/list-reg', verifyToken, RegList)

var { DeleteReg } = require("./controller/register/deletereg");
route.post('/delete/reg', verifyToken, DeleteReg)

var { aboutOrganization } = require("./controller/register/aboutOrganization");
route.post('/about/organization', verifyToken, aboutOrganization)

var { AddBankDetails } = require("./controller/banking/addbankdetails")
route.post('/add/bank-details', verifyToken, AddBankDetails)

var { ListbankDetails } = require("./controller/banking/listbankdetails")
route.post('/list/bank-details', verifyToken, ListbankDetails)

var { EditBnakDetails } = require("./controller/banking/editbankdetails")
route.post('/edit/bank-details', verifyToken, EditBnakDetails)

var { DeleteBankDetails } = require("./controller/banking/deletebankdetails");
route.post('/delete/bank-details', verifyToken, DeleteBankDetails)

var { AddVendors } = require("./controller/purchase/addvendor")
route.post('/add/vendors', verifyToken, AddVendors)

var { ListVendors } = require("./controller/purchase/listvendor")
route.post('/list/vendors', verifyToken, ListVendors)

var { DeleteVendors } = require("./controller/purchase/deletevendor");
route.post('/delete/vendors', verifyToken, DeleteVendors)

var { DeleteCustomerContactPerson } = require("./controller/sales/deletecustcontperson");
route.post('/delete/customer-contact-person', verifyToken, DeleteCustomerContactPerson)

var { EditVendor } = require("./controller/purchase/editvendor");
route.post('/edit/vendor', verifyToken, EditVendor)

var { EditVendorBankDetails } = require("./controller/purchase/editvendorbankdetails");
route.post('/edit/vendor-bank-details', verifyToken, EditVendorBankDetails)

var { DeleteSalesSection } = require("./controller/sales/deleteslaessection");
route.post('/sales/delete', verifyToken, DeleteSalesSection)

var { AddExpenses } = require("./controller/purchase/addexpenses")
route.post('/add/expenses', verifyToken, AddExpenses)

var { ListExpenses } = require("./controller/purchase/listexpenses")
route.post('/list/expenses', verifyToken, ListExpenses)

var { DeleteVendorSection } = require("./controller/purchase/deletepurchasesection");
route.post('/delete/vendors-section', verifyToken, DeleteVendorSection)

var { EditExpenses } = require("./controller/purchase/editexpenses");
route.post('/edit/expenses', verifyToken, EditExpenses)

var { AddBills } = require("./controller/purchase/addbills")
route.post('/add/purchase-bills', verifyToken, AddBills)

var { ListBills } = require("./controller/purchase/listbills")
route.post('/list/purchase-bills', verifyToken, ListBills)

var { AddRecurringBills } = require("./controller/purchase/addrecurringbills")
route.post('/add/recurring_bills', verifyToken, AddRecurringBills)

var { ListRecurringBills } = require("./controller/purchase/listrecurringbills")
route.post('/list/recurring_bills', verifyToken, ListRecurringBills)

var { EditRecurringBills } = require("./controller/purchase/editrecurringbills")
route.post('/edit/recurring_bills', verifyToken, EditRecurringBills)

var { AddRecurringExpenses } = require("./controller/purchase/addrecurringexpenses")
route.post('/add/recurring_expenses', verifyToken, AddRecurringExpenses)

var { ListRecurringExpenses } = require("./controller/purchase/listrecurringexpenses")
route.post('/list/recurring_expenses', verifyToken, ListRecurringExpenses)

var { EditRecurringExpenses } = require("./controller/purchase/editrecurringexpenses")
route.post('/edit/recurring_expenses', verifyToken, EditRecurringExpenses)

var { AddPurchaseOrder } = require("./controller/purchase/addpurchaseorder")
route.post('/add/purchase-order', verifyToken, AddPurchaseOrder)

var { ListPurchaseOrder } = require("./controller/purchase/listpurchaseorder")
route.post('/list/purchase-order', verifyToken, ListPurchaseOrder)

var { EditPurchaseOrder } = require("./controller/purchase/editpurchaseorder")
route.post('/edit/purchase-order', verifyToken, EditPurchaseOrder)

var { dashboard } = require('./controller/dashboard')
route.get("/dashboard", verifyToken, dashboard)

var { WeekOverview } = require('./controller/overview')
route.post('/dashboard/overview', verifyToken, WeekOverview)

var { users } = require('./controller/users')
route.get('/dashboard/users', verifyToken, users)

var { downloadProductList } = require('./controller/download/products')
route.get('/download/products', verifyToken, downloadProductList)

var { createSalesPerson, updateStatus, listSalesPerson, deleteSalesPerson, GetSalespersonData } = require('./controller/sales/salesPerson')
route.post('/salesperson/create', verifyToken, createSalesPerson)
route.put('/salesperson/edit', verifyToken, updateStatus)
route.post('/salesperson/data', verifyToken, GetSalespersonData)
route.get('/salesperson/list', verifyToken, listSalesPerson)
route.delete('/salesperson/delete', verifyToken, deleteSalesPerson)

let { CreateManufacture, EditManufacture, ListManufactures, DeleteManufacture, GetManufactureData } = require('./controller/manufacture')
route.post('/manufacture/create', verifyToken, CreateManufacture)
route.post('/manufacture/edit', verifyToken, EditManufacture)
route.post('/manufacture/data', verifyToken, GetManufactureData)
route.get('/manufacture/list', verifyToken, ListManufactures)
route.delete('/manufacture/delete', verifyToken, DeleteManufacture)

let { CreateBrand, EditBrand, ListBrands, DeleteBrand, GetBrandData } = require('./controller/brand')
route.post('/brand/create', verifyToken, CreateBrand)
route.post('/brand/edit', verifyToken, EditBrand)
route.post('/brand/data', verifyToken, GetBrandData)
route.get('/brand/list', verifyToken, ListBrands)
route.delete('/brand/delete', verifyToken, DeleteBrand)

let { CreateCompositeItem, ListCompositeItems, EditCompositeItem, DeleteImage, DeleteCompositeItem, GetCompositeItemData } = require('./controller/composite_items')
route.post('/compositeItem/create', verifyToken, CreateCompositeItem)
route.post('/compositeItem/list', verifyToken, ListCompositeItems)
route.post('/compositeItem/data', verifyToken, GetCompositeItemData)
route.put('/compositeItem/edit', verifyToken, EditCompositeItem)
route.delete('/compositeItem/image/delete', verifyToken, DeleteImage)
route.delete('/compositeItem/delete', verifyToken, DeleteCompositeItem)

let { CreateCustomView, ListCustomViewFields, GetTables, EditCustomView, ListCustomView, GetCustomViewData, DeleteCustomView } = require('./controller/custom_view')
route.post('/custom_view/create', verifyToken, CreateCustomView)
route.post('/custom_view/table', verifyToken, ListCustomViewFields)
route.get('/tables', verifyToken, GetTables)
route.put('/custom_view/edit', verifyToken, EditCustomView)
route.post('/custom_view/list', verifyToken, ListCustomView)
route.post('/custom_view/data', verifyToken, GetCustomViewData)
route.delete('/custom_view/delete', verifyToken, DeleteCustomView)

let { CreateItemGroup, EditItemGroup, DeleteItemGroupImage, ListGroupItem, DeleteItemGroup, GetItemGroupData } = require('./controller/item_groups')
route.post('/itemGroup/create', verifyToken, CreateItemGroup)
route.put('/itemGroup/edit', verifyToken, EditItemGroup)
route.delete('/itemGroup/image/delete', verifyToken, DeleteItemGroupImage)
route.get('/itemGroup/list', verifyToken, ListGroupItem)
route.delete('/itemGroup/delete', verifyToken, DeleteItemGroup)
route.post('/itemGroup/data', verifyToken, GetItemGroupData)

let { CreateComment, DeleteComment, EditComment, ListComment, GetCommentData } = require('./controller/customer')
route.post('/customer/comment/create', verifyToken, CreateComment)
route.put('/customer/comment/edit', verifyToken, EditComment)
route.get('/customer/comment/list', verifyToken, ListComment)
route.delete('/customer/comment/delete', verifyToken, DeleteComment)
route.post('/customer/comment/data', verifyToken, GetCommentData)

let { CreateReason, EditReason, UpdateStatus, ListAllReasons, GetReasonData, DeleteReason } = require('./controller/reason')
route.post('/reason/create', verifyToken, CreateReason)
route.put('/reason/edit', verifyToken, EditReason)
route.put('/reason/status/edit', verifyToken, UpdateStatus)
route.post('/reason/list', verifyToken, ListAllReasons)
route.post('/reason/data', verifyToken, GetReasonData)
route.delete('/reason/delete', verifyToken, DeleteReason)

let { CreateInventoryAdjustment, EditInventoryAdjustment, ListAllInventory, DeleteInventoryImages, DeleteInventoryItem, GetSingleData, DeleteInventoryAdjustment } = require('./controller/inventory_adjustment')
route.post('/inventory_adjustment/create', verifyToken, CreateInventoryAdjustment)
route.post('/inventory_adjustment/edit', verifyToken, EditInventoryAdjustment)
route.get('/inventory_adjustment/list', verifyToken, ListAllInventory)
route.delete('/inventory_adjustment/item/image', verifyToken, DeleteInventoryImages)
route.delete('/inventory_adjustment/item', verifyToken, DeleteInventoryItem)
route.post('/inventory_adjustment/data', verifyToken, GetSingleData)
route.delete('/inventory_adjustment/delete', verifyToken, DeleteInventoryAdjustment)

let { CreateQuote, UpdateQuote, ListAllQuotes, DeleteQuote, DeleteQuoteItem, DeleteQuoteFile } = require('./controller/quote');
route.post('/quote/create', verifyToken, authorize("quote_create"), CreateQuote)
route.post('/quote/edit', verifyToken, UpdateQuote)
route.post('/quote/list', verifyToken, authorize("quote_view"), ListAllQuotes)
route.post('/quote/delete', verifyToken, DeleteQuote)
route.post('/quote/item/delete', verifyToken, DeleteQuoteItem)
route.post('/quote/file/delete', verifyToken, DeleteQuoteFile)

let { CreateProject, EditProject, DeleteProject, DeleteProjectTask, DeleteProjectUser, ListAllProjects, GetSingleProjectData } = require('./controller/project')
route.post('/project/create', verifyToken, CreateProject)
route.post('/project/edit', verifyToken, EditProject)
route.post('/project/delete', verifyToken, DeleteProject)
route.post('/project/task/delete', verifyToken, DeleteProjectTask)
route.post('/project/user/delete', verifyToken, DeleteProjectUser)
route.get('/project/list', verifyToken, ListAllProjects)
route.post('/project/data', verifyToken, GetSingleProjectData)

let { CreateRole, EditRole, ListAllRoles, GetSingleRoleData, DeleteRole } = require('./controller/RolesAndprivileges')
route.post('/role/create', verifyToken, CreateRole)
route.post('/role/edit', verifyToken, EditRole)
route.get('/role/list', verifyToken, ListAllRoles)
route.post('/role/data', verifyToken, GetSingleRoleData)
route.post('/role/delete', verifyToken, DeleteRole)

//Pending 
let { } = require('./controller/subuser')


let { CreateTcsTds, EditTcsTds, ListAllTcsTds, GetSingleTcsTds, DeleteTcsTds } = require('./controller/tcs')
route.post('/tcs_tds/create', verifyToken, CreateTcsTds)
route.post('/tcs_tds/edit', verifyToken, EditTcsTds)
route.post('/tcs_tds/list', verifyToken, ListAllTcsTds)
route.post('/tcs_tds/data', verifyToken, GetSingleTcsTds)
route.post('/tcs_tds/delete', verifyToken, DeleteTcsTds)

let { CreateTax, EditTax, ListAllTax, GetSingleTaxData, DeleteTax } = require('./controller/tax')
route.post('/tax/create', verifyToken, CreateTax)
route.post('/tax/edit', verifyToken, EditTax)
route.get('/tax/list', verifyToken, ListAllTax)
route.post('/tax/data', verifyToken, GetSingleTaxData)
route.post('/tax/delete', verifyToken, DeleteTax)

let { CreatePaymentTerm, EditPaymentTerm, ListAllPaymentTerms, GetPaymentTerm, DeletePaymentTerm, SetDefault } = require('./controller/terms')
route.post('/payment_term/create', verifyToken, CreatePaymentTerm)
route.post('/payment_term/edit', verifyToken, EditPaymentTerm)
route.get('/payment_term/list', verifyToken, ListAllPaymentTerms)
route.post('/payment_term/data', verifyToken, GetPaymentTerm)
route.post('/payment_term/delete', verifyToken, DeletePaymentTerm)
route.post('/payment_term/set_default', verifyToken, SetDefault)

let { ListAllDeliveryMethod, DeleteDeliveryMethod } = require('./controller/delivery_method')
route.get('/delivery_method/list', verifyToken, ListAllDeliveryMethod)
route.post('/deliver_method/delete', verifyToken, DeleteDeliveryMethod)

let { CreateSalesOrder, EditSalesOrder, ListAllSales, GetSingleSalesOrderData, DeleteSalesOrderItem, DeleteSalesOrder, DeleteSalesOrderDocument } = require('./controller/sales_order')
route.post('/sales_order/create', verifyToken, CreateSalesOrder)
route.post('/sales_order/edit', verifyToken, EditSalesOrder)
route.get('/sales_order/list', verifyToken, ListAllSales)
route.post('/sales_order/data', verifyToken, GetSingleSalesOrderData)
route.post('/sales_order/item/delete', verifyToken, DeleteSalesOrderItem)
route.post('/sales_order/delete', verifyToken, DeleteSalesOrder)
route.post('/sales_order/document/delete', verifyToken, DeleteSalesOrderDocument)

let { CreatePackage, EditPackage, ListAllPackages, GetSinglePackageData, DeletePackage, DeletePackageItem } = require('./controller/package')
route.post('/package/create', verifyToken, CreatePackage)
route.post('/package/edit', verifyToken, EditPackage)
route.post('/package/list', verifyToken, ListAllPackages)
route.post('/package/data', verifyToken, GetSinglePackageData)
route.post('/package/item/delete', verifyToken, DeletePackageItem)
route.post('/package/delete', verifyToken, DeletePackage)

let { CreateShipment, EditShipment, ListAllShipment, DeleteShipment, GetSingleShipment } = require('./controller/shipments')
route.post('/shipment/create', verifyToken, CreateShipment)
route.post('/shipment/edit', verifyToken, EditShipment)
route.post('/shipment/data', verifyToken, GetSingleShipment)
route.get('/shipment/list', verifyToken, ListAllShipment)
route.post('/shipment/delete', verifyToken, DeleteShipment)

let { CreateDeliveryChallan, EditDeliveryChallan, GetSingleDeliveryChallan, ListAllDeliveryChallan, DeleteChallanItems, DeleteDeliveryChallanDocument, DeleteDeliveryChallan } = require('./controller/delivery_challan')
route.post('/delivery_challan/create', verifyToken, CreateDeliveryChallan)
route.post('/delivery_challan/edit', verifyToken, EditDeliveryChallan)
route.get('/delivery_challan/list', verifyToken, ListAllDeliveryChallan)
route.post('/delivery_challan/data', verifyToken, GetSingleDeliveryChallan)
route.post('/delivery_challan/item/delete', verifyToken, DeleteChallanItems)
route.post('/delivery_challan/document/delete', verifyToken, DeleteDeliveryChallanDocument)
route.post('/delivery_challan/delete', verifyToken, DeleteDeliveryChallan)

let { createInvoice, listAllInvoice, listSingleInvoice, deleteInvoice, editInvoice, DeleteInvoiceItem, DeleteInvoiceFile } = require('./controller/invoice')
route.post('/invoice/create', verifyToken, createInvoice)
route.post('/invoice/list', verifyToken, listAllInvoice)
route.post('/invoice/singleInvoice', verifyToken, listSingleInvoice)
route.post('/invoice/delete', verifyToken, deleteInvoice)
route.post('/invoice/edit', verifyToken, editInvoice)
route.post('/invoice/item/delete', verifyToken, DeleteInvoiceItem)
route.post('/invoice/file/delete', verifyToken, DeleteInvoiceFile)

let { CreatePaymentReceived, EditPaymentReceived, ListAllPaymentReceived, GetSinglePaymentReceivedData, DeletePaymentReceived, DeletePaymentReceivedFile, DeletePaymentReceivedItem } = require('./controller/payment_received')
route.post('/payment_received/create', verifyToken, CreatePaymentReceived)
route.get('/payment_received/list', verifyToken, ListAllPaymentReceived)
route.post('/payment_received/edit', verifyToken, EditPaymentReceived)
route.post('/payment_received/data', verifyToken, GetSinglePaymentReceivedData)
route.post('/payment_received/delete', verifyToken, DeletePaymentReceived)
route.post('/payment_received/file/delete', verifyToken, DeletePaymentReceivedFile)
route.post('/payment_received/item/delete', verifyToken, DeletePaymentReceivedItem)

let { CreatePaymentMode, EditPaymentMode, ListAllPaymentMode, SetModeDefault, DeletePaymentMode } = require('./controller/payment_mode')
route.post('/payment_mode/create', verifyToken, CreatePaymentMode)
route.get('/payment_mode/list', verifyToken, ListAllPaymentMode)
route.post('/payment_mode/edit', verifyToken, EditPaymentMode)
route.post('/payment_mode/set_default', verifyToken, SetModeDefault)
route.post('/payment_mode/delete', verifyToken, DeletePaymentMode)

let { CreateQuoteComment, EditQuoteComment, ListQuoteComments, DeleteQuoteComment } = require('./controller/quote')
route.post('/quote/comment/create', verifyToken, CreateQuoteComment)
route.post('/quote/comment/edit', verifyToken, EditQuoteComment)
route.post('/quote/comment/list', verifyToken, ListQuoteComments)
route.post('/quote/comment/delete', verifyToken, DeleteQuoteComment)

let { ExportCustomerList } = require('./controller/customer')
route.post('/export/customer', verifyToken, ExportCustomerList)

let { ExportQuotesList } = require('./controller/quote')
route.post('/export/quote', verifyToken, ExportQuotesList)

let { ExportInvoiceList } = require('./controller/invoice')
route.post('/export/invoice', verifyToken, ExportInvoiceList)

let { ExportSalesOrder } = require('./controller/sales_order')
route.post('/export/sales_order', verifyToken, ExportSalesOrder)

let { ExportPackages } = require('./controller/package')
route.post('/export/packages', verifyToken, ExportPackages)

let { ExportDeliveryChallan } = require('./controller/delivery_challan')
route.post('/export/delivery_challan', verifyToken, ExportDeliveryChallan)





module.exports = route