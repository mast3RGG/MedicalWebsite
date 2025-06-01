let cartData = {
    items: [],
    promoCode: null,
    discountAmount: 0,
    taxRate: 0.08,
    serviceFee: 5
};

const promoCodes = {
    'SAVE10': { type: 'percentage', value: 10, description: '10% off your order' },
    'FIRST20': { type: 'percentage', value: 20, description: '20% off for first-time customers' },
    'HEALTH50': { type: 'fixed', value: 50, description: '$50 off health services' },
    'MEDICAL15': { type: 'percentage', value: 15, description: '15% off medical services' }
};

function initializeApp() {
    loadCartFromLocalStorage();
    renderCartItems();
    updateCartDisplay();
    setupEventListeners();
    validateForm();
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            
            if (Array.isArray(parsedCart)) {
                cartData.items = parsedCart.map(item => ({
                    id: item.id || Date.now(),
                    name: item.name || 'Unknown Item',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    description: item.description || '',
                    unit: item.unit || 'session',
                    total: item.total || (item.price || 0) * (item.quantity || 1),  
                    plan: item.plan || 'One-time service'  
                }));
            } else if (parsedCart && Array.isArray(parsedCart.items)) {
                cartData.items = parsedCart.items.map(item => ({
                    ...item,
                    total: item.total || (item.price || 0) * (item.quantity || 1)  
                }));
                cartData.promoCode = parsedCart.promoCode || null;
                cartData.discountAmount = parsedCart.discountAmount || 0;
            }
        }
    } catch (e) {
        console.error('Failed to load cart:', e);
        cartData.items = [];
    }
}
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cartItems', JSON.stringify({
            items: cartData.items,
            promoCode: cartData.promoCode,
            discountAmount: cartData.discountAmount
        }));
    } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (cartData.items.length === 0) {
        document.getElementById('empty-cart').style.display = 'flex';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    document.getElementById('empty-cart').style.display = 'none';
    
    cartData.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        cartItem.dataset.price = item.price;
        
        // Default image based on service type
        let imageSrc = 'imgs/pexels-chokniti-khongchum-1197604-3938023.jpg';
        if (item.name.toLowerCase().includes('consultation')) {
            imageSrc = 'imgs/pexels-chokniti-khongchum-1197604-3938023.jpg';
        } else if (item.name.toLowerCase().includes('radiography')) {
            imageSrc = 'imgs/pexels-thirdman-5327656.jpg';
        } else if (item.name.toLowerCase().includes('perfecton')) {
            imageSrc = 'imgs/perfectionpastile.png';
        }
        
        cartItem.innerHTML = `
            <img src="${imageSrc}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-description">${item.description || 'Medical service'}</p>
                <p class="item-unit-price">$${item.price} per ${item.unit || 'session'}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(this)">−</button>
                <span class="quantity-number">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(this)">+</button>
            </div>
            <span class="item-price">$${(item.price * item.quantity).toLocaleString()}</span>
            <button class="delete-btn" onclick="removeItem(this)">🗑</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
}

function setupEventListeners() {
    document.getElementById('card-number').addEventListener('input', formatCardNumber);
    document.getElementById('card-expiry').addEventListener('input', formatExpiryDate);
    
    document.getElementById('card-cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    document.querySelectorAll('.card-input').forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateField);
    });

    document.getElementById('promo-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromo();
        }
    });
}

function increaseQuantity(btn) {
    const cartItem = btn.closest('.cart-item');
    const quantitySpan = cartItem.querySelector('.quantity-number');
    const itemId = parseInt(cartItem.dataset.id);
    
    const currentQty = parseInt(quantitySpan.textContent);
    const newQty = Math.min(currentQty + 1, 10); 
    
    quantitySpan.textContent = newQty;
    updateCartData(itemId, newQty);
    updateItemPrice(cartItem, newQty);
    updateCartDisplay();
    
    showNotification('Item quantity updated', 'info');
}

function decreaseQuantity(btn) {
    const cartItem = btn.closest('.cart-item');
    const quantitySpan = cartItem.querySelector('.quantity-number');
    const itemId = parseInt(cartItem.dataset.id);
    
    const currentQty = parseInt(quantitySpan.textContent);
    const newQty = Math.max(currentQty - 1, 1); 
    
    quantitySpan.textContent = newQty;
    updateCartData(itemId, newQty);
    updateItemPrice(cartItem, newQty);
    updateCartDisplay();
    
    btn.disabled = newQty === 1;
}

function updateCartData(itemId, newQuantity) {
    cartData.items = cartData.items.map(item => {
        if (item.id === itemId) {
            return {
                ...item,        
                quantity: newQuantity,
                total: item.price * newQuantity 
            };
        }
        return item;
    });
    saveCartToLocalStorage();
}

function updateItemPrice(cartItem, quantity) {
    const unitPrice = parseInt(cartItem.dataset.price);
    const totalPrice = unitPrice * quantity;
    cartItem.querySelector('.item-price').textContent = `$${totalPrice.toLocaleString()}`;
}

function removeItem(btn) {
    const cartItem = btn.closest('.cart-item');
    const itemId = parseInt(cartItem.dataset.id);
    
    cartItem.classList.add('removing');
    
    setTimeout(() => {
        cartItem.remove();
        cartData.items = cartData.items.filter(item => item.id !== itemId);
        saveCartToLocalStorage();
        updateCartDisplay();
        showNotification('Item removed from cart', 'info');
        
        if (cartData.items.length === 0) {
            document.getElementById('empty-cart').style.display = 'block';
            document.getElementById('checkout-btn').disabled = true;
        }
    }, 300);
}

function updateCartDisplay() {
    const itemCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * cartData.taxRate;
    const discount = calculateDiscount(subtotal);
    const total = subtotal + tax + cartData.serviceFee - discount;

    document.getElementById('item-count').textContent = itemCount;
    document.getElementById('item-plural').textContent = itemCount === 1 ? '' : 's';

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('service-fee').textContent = `$${cartData.serviceFee}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-amount').textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        cartData.discountAmount = discount;
    } else {
        document.getElementById('discount-row').style.display = 'none';
        cartData.discountAmount = 0;
    }

    document.querySelectorAll('.cart-item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-number').textContent);
        const decreaseBtn = item.querySelector('.quantity-controls .quantity-btn:first-child');
        const increaseBtn = item.querySelector('.quantity-controls .quantity-btn:last-child');
        
        decreaseBtn.disabled = quantity <= 1;
        increaseBtn.disabled = quantity >= 10;
    });
}

function calculateDiscount(subtotal) {
    if (!cartData.promoCode) return 0;
    
    const promo = promoCodes[cartData.promoCode];
    if (!promo) return 0;
    
    if (promo.type === 'percentage') {
        return subtotal * (promo.value / 100);
    } else if (promo.type === 'fixed') {
        return Math.min(promo.value, subtotal);
    }
    
    return 0;
}

function applyPromo() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    const promoSuccess = document.getElementById('promo-success');
    
    if (!promoCode) {
        showNotification('Please enter a promo code', 'error');
        return;
    }
    
    if (promoCodes[promoCode]) {
        if (cartData.promoCode === promoCode) {
            showNotification('Promo code already applied', 'info');
            return;
        }
        
        cartData.promoCode = promoCode;
        promoSuccess.textContent = `✓ ${promoCodes[promoCode].description} applied!`;
        promoSuccess.style.display = 'block';
        promoInput.value = '';
        updateCartDisplay();
        showNotification('Promo code applied successfully!', 'success');
    } else {
        showNotification('Invalid promo code', 'error');
        promoInput.focus();
    }
}

function removePromo() {
    cartData.promoCode = null;
    document.getElementById('promo-success').style.display = 'none';
    updateCartDisplay();
    showNotification('Promo code removed', 'info');
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
    if (value.length > 16) {
        value = value.substr(0, 16);
    }
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
    validateField(e);
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
    if (value.length > 4) {
        value = value.substr(0, 4);
    }
    
    if (value.length > 2) {
        value = value.substr(0, 2) + '/' + value.substr(2);
    }
    
    e.target.value = value;
    validateField(e);
}

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (field.value.trim() === '') {
        errorElement.textContent = 'This field is required';
        errorElement.style.display = 'block';
        return false;
    }
    
    let isValid = true;
    
    switch (field.id) {
        case 'card-number':
            isValid = field.value.replace(/\s/g, '').length === 16;
            errorElement.textContent = isValid ? '' : 'Card number must be 16 digits';
            break;
        case 'card-expiry':
            const [month, year] = field.value.split('/');
            isValid = month && year && month.length === 2 && year.length === 2;
            errorElement.textContent = isValid ? '' : 'Please use MM/YY format';
            break;
        case 'card-cvv':
            isValid = field.value.length >= 3 && field.value.length <= 4;
            errorElement.textContent = isValid ? '' : 'CVV must be 3-4 digits';
            break;
        case 'card-name':
            isValid = field.value.trim().length >= 3;
            errorElement.textContent = isValid ? '' : 'Name must be at least 3 characters';
            break;
    }
    
    errorElement.style.display = isValid ? 'none' : 'block';
    return isValid;
}

function validateForm() {
    let isValid = true;
    const fields = document.querySelectorAll('.card-input');
    
    fields.forEach(field => {
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (field.value.trim() === '') {
            errorElement.textContent = 'This field is required';
            errorElement.style.display = 'block';
            isValid = false;
        } else {
            const event = { target: field };
            if (!validateField(event)) {
                isValid = false;
            }
        }
    });
    
    document.getElementById('checkout-btn').disabled = !isValid || cartData.items.length === 0;
    return isValid;
}

function processCheckout() {
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    if (cartData.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    const spinner = document.getElementById('loading-spinner');
    
    checkoutBtn.disabled = true;
    checkoutBtn.querySelector('span:nth-child(2)').textContent = 'Processing...';
    spinner.style.display = 'inline-block';
    
    // Simulate payment processing
    setTimeout(() => {
        spinner.style.display = 'none';
        checkoutBtn.querySelector('span:nth-child(2)').textContent = 'Payment Successful!';
        
        showNotification('Payment successful! Your order has been placed.', 'success');
        
        cartData.items = [];
        cartData.promoCode = null;
        saveCartToLocalStorage();
        
        document.getElementById('empty-cart').style.display = 'block';
        document.getElementById('cart-items').innerHTML = '';
        updateCartDisplay();
        
        setTimeout(() => {
            checkoutBtn.querySelector('span:nth-child(2)').textContent = 'Checkout';
            checkoutBtn.disabled = true;
        }, 2000);
    }, 2000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function selectPaymentMethod(element) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    element.classList.add('active');
}

function goBack() {
    window.history.back();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartData.items));
}

document.addEventListener('DOMContentLoaded', initializeApp);