// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart display
function updateCartDisplay() {
    const cartItemsBody = document.getElementById('cart-items-body');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    // Clear existing items
    cartItemsBody.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to the table
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                </div>
            </td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.product_id}', -1)">-</button>
                    <input type="number" class="form-control text-center" value="${item.quantity}" min="1" readonly style="width: 60px;">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.product_id}', 1)">+</button>
                </div>
            </td>
            <td>₹${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeItem('${item.product_id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cartItemsBody.appendChild(row);
    });
    
    // Calculate shipping (free over ₹500)
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;
    
    // Update summary
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    shippingElement.textContent = `₹${shipping.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Update cart badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-badge').textContent = totalItems;
}

// Update item quantity
function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.product_id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const address = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postal: document.getElementById('postal').value,
        country: document.getElementById('country').value
    };
    
    try {
        // Export cart data to Excel
        const fileName = exportToExcel(cart, address);
        
        // Show success message with file name
        alert(`Order placed successfully! Order details have been saved to ${fileName}`);
        
        // Clear the cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Reset form
        this.reset();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('There was an error saving your order details. Please try again.');
    }
});

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay); 