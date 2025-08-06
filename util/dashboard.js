const moment = require('moment');


module.exports.filterDataByType = (invoiceData, type) => {
    return invoiceData.filter(data => data.type === type);
}

module.exports.calculateTotalByStatus = (invoiceData, status) => {
    return invoiceData.reduce((acc, data) => {
        if (data.status === status) {
            return acc + data.total;  // Accumulate the total if status matches
        }
        return acc;  // Otherwise, return the accumulated value
    }, 0);  // Initial accumulator value is 0
}


module.exports.calculateTotalDue = (invoiceData, status) => {
    let currentDate = moment();  // Get current date
    return invoiceData.reduce((acc, data) => {
        let dueDate = moment(data.due_date, "YYYY-MM-DD");  // Parse the due_date
        if (data.status === status && dueDate.isBefore(currentDate, 'day')) {
            return acc + data.total;  // Accumulate the total if conditions match
        }
        return acc;  // Return the accumulated value otherwise
    }, 0);  // Initial value for the accumulator is 0
}


module.exports.filterDataByDateRange = (data, fromDate, toDate) => {
    const from = moment(fromDate, "YYYY-MM-DD");
    const to = moment(toDate, "YYYY-MM-DD");

    return data.filter(item => {
        const dueDate = moment(item.createdAt);
        return dueDate.isBetween(from, to, 'day', '[]'); // inclusive of both ends
    });
};


module.exports.countDocumentsByStatus = (documents, status) => {
    return documents.reduce((count, document) => {
        // Increment count if the document's status matches the given status
        if (document.status === status) {
            count++;
        }
        return count;
    }, 0);  // Start with count = 0
}


module.exports.getTotalSalesByMonth = (salesOrders) => {
    const currentYear = new Date().getFullYear();  // Get the current year
    const salesByMonth = {};

    salesOrders.forEach(order => {
        const orderDate = new Date((order.so_order_date) || (order.ep_date) || order.currentDate);
        const orderYear = orderDate.getFullYear();
        // Only process orders from the current year
        if (orderYear === currentYear) {
            const yearMonth = `${orderYear}-${orderDate.getMonth() + 1}`; // Format as YYYY-MM
            // Initialize the month if not already present
            if (!salesByMonth[yearMonth]) {
                salesByMonth[yearMonth] = 0;
            }
            // Add the total amount for the month
            if (order.id) {
                salesByMonth[yearMonth] += order.total;
            } else if (order.ep_id) {
                salesByMonth[yearMonth] += order.ep_amount;
            } else {
                salesByMonth[yearMonth] += order.so_total_amount;
            }
        }
    });
    return salesByMonth;
}