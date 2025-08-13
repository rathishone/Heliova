// Function to export cart data to Excel
function exportToExcel(cart, address) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare the data for the order summary sheet
    const orderSummary = [
        ['Order Summary'],
        ['Date', new Date().toLocaleString()],
        [''],
        ['Shipping Address'],
        ['Street', address.street],
        ['City', address.city],
        ['State', address.state],
        ['Postal Code', address.postal],
        ['Country', address.country],
        [''],
        ['Order Items'],
        ['Product ID', 'Product Name', 'Category', 'Price', 'Quantity', 'Total']
    ];

    // Add cart items to the summary
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        orderSummary.push([
            item.product_id,
            item.name,
            item.category,
            `₹${item.price.toFixed(2)}`,
            item.quantity,
            `₹${itemTotal.toFixed(2)}`
        ]);
    });

    // Add totals
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;
    orderSummary.push(
        [''],
        ['Subtotal', '', '', '', '', `₹${subtotal.toFixed(2)}`],
        ['Shipping', '', '', '', '', `₹${shipping.toFixed(2)}`],
        ['Total', '', '', '', '', `₹${total.toFixed(2)}`]
    );

    // Create worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(orderSummary);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Order Summary');

    // Generate Excel file
    const fileName = `order_${new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return fileName;
} 