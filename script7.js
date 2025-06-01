// Enhanced Cart System with Beautiful Animations
const Cart = {
    items: [],
    isOpen: false,
    
    init() {
        this.loadFromLocalStorage();
        this.setupCartToggle();
        this.updateCartBadge();
        this.injectStyles();
        this.setupGlobalListeners();
    },
    
    loadFromLocalStorage() {
        const savedItems = localStorage.getItem('cartItems');
        this.items = savedItems ? JSON.parse(savedItems) : [];
    },
    
    setupCartToggle() {
        document.querySelectorAll('[data-cart-toggle]').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateCartIcon(icon);
                this.toggleCart();
            });
        });
    },
    
    setupGlobalListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.hideCart();
        });
        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.cart-content') && 
                !e.target.closest('[data-cart-toggle]')) {
                this.hideCart();
            }
        });
    },
    
    animateCartIcon(icon) {
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
    },
    
    toggleCart() {
        this.isOpen ? this.hideCart() : this.showCart();
    },
    
    showCart() {
        if (this.isOpen || document.querySelector('.cart-overlay')) return;
        this.isOpen = true;
        
        const cartOverlay = document.createElement('div');
        cartOverlay.className = 'cart-overlay';
        
        const cartContent = document.createElement('div');
        cartContent.className = 'cart-content';
        
        // Cart header with close button
        const cartHeader = document.createElement('div');
        cartHeader.className = 'cart-header';
        cartHeader.innerHTML = `
            <h3>Your Cart ${this.items.length ? `(${this.getTotalItems()})` : ''}</h3>
            <button class="close-cart" aria-label="Close cart">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;
        
        // Cart body
        const cartBody = document.createElement('div');
        cartBody.className = 'cart-body';
        
        if (this.items.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty-state">
                    <div class="empty-cart-animation">
                        <svg class="cart-icon" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        <div class="pulse-effect"></div>
                    </div>
                    <h4>Your cart is empty</h4>
                    <p>Browse our services to add items</p>
                    <button class="btn-continue-shopping">Continue Shopping</button>
                </div>
            `;
        } else {
            cartBody.innerHTML = `
                <div class="cart-items">
                    ${this.items.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="cart-item-image">
                                <div class="image-placeholder">${item.name.charAt(0)}</div>
                            </div>
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.name}</h4>
                                <p class="cart-item-plan">${item.plan}</p>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus">−</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn plus">+</button>
                                </div>
                            </div>
                            <div class="cart-item-price">
                                $${item.total.toFixed(2)}
                                <button class="remove-item" aria-label="Remove item">
                                    <svg width="16" height="16" viewBox="0 0 24 24">
                                        <path d="M19 13H5v-2h14v2z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>Subtotal</span>
                        <span>$${this.getSubtotal().toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Tax</span>
                        <span>$${this.calculateTax().toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row total">
                        <span>Total</span>
                        <span>$${this.getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button class="btn-checkout">Proceed to Checkout</button>
                    <div class="cart-payment-methods">
                        <img src="imgs/visa.png" alt="Visa">
                        <img src="imgs/paypal.png" alt="Mastercard">
                        <img src="imgs/money.png" alt="PayPal">
                    </div>
                </div>
            `;
        }
        
        cartContent.appendChild(cartHeader);
        cartContent.appendChild(cartBody);
        cartOverlay.appendChild(cartContent);
        document.body.appendChild(cartOverlay);
        document.body.style.overflow = 'hidden';
        
        // Animate open
        setTimeout(() => {
            cartOverlay.style.opacity = '1';
            cartContent.style.transform = 'translateX(0)';
            
            // Animate items sequentially
            if (this.items.length > 0) {
                document.querySelectorAll('.cart-item').forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, i * 100);
                });
            }
        }, 10);
        
        // Setup event listeners
        this.setupCartEvents(cartContent);
    },
    
    hideCart() {
        const overlay = document.querySelector('.cart-overlay');
        const content = document.querySelector('.cart-content');
        
        if (!overlay || !content) return;
        
        this.isOpen = false;
        content.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    },
    
    setupCartEvents(cartElement) {
        // Close button
        cartElement.querySelector('.close-cart')?.addEventListener('click', () => this.hideCart());
        
        // Continue shopping button
        cartElement.querySelector('.btn-continue-shopping')?.addEventListener('click', () => {
            this.hideCart();
            // Add navigation logic here if needed
        });
        
        // Checkout button
        cartElement.querySelector('.btn-checkout')?.addEventListener('click', () => {
            this.processCheckout();
        });
        
        // Quantity controls
        cartElement.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                const isPlus = e.target.classList.contains('plus');
                
                this.updateItemQuantity(itemId, isPlus ? 1 : -1);
                this.animateQuantityChange(e.target, isPlus);
            });
        });
        
        cartElement.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                this.removeItem(itemId);
            });
        });
    },
    
    animateQuantityChange(button, isIncreasing) {
        const quantityDisplay = button.parentElement.querySelector('span');
        
        // Pulse animation
        quantityDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => {
            quantityDisplay.style.transform = 'scale(1)';
        }, 200);
        
        // Visual feedback
        button.style.backgroundColor = isIncreasing ? '#e8f5e9' : '#ffebee';
        setTimeout(() => {
            button.style.backgroundColor = '';
        }, 300);
    },
    
    updateItemQuantity(itemId, change) {
        const itemIndex = this.items.findIndex(item => item.id == itemId);
        if (itemIndex === -1) return;
        
        const newQuantity = this.items[itemIndex].quantity + change;
        if (newQuantity < 1) return;
        
        this.items[itemIndex].quantity = newQuantity;
        this.items[itemIndex].total = this.items[itemIndex].price * newQuantity;
        
        this.saveToLocalStorage();
        this.updateCartBadge();
        this.showCart(); // Refresh cart view
    },
    
    removeItem(itemId) {
        const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        if (!itemElement) return;
        
        // Animate removal
        itemElement.style.transform = 'translateX(100%)';
        itemElement.style.opacity = '0';
        
        setTimeout(() => {
            this.items = this.items.filter(item => item.id != itemId);
            this.saveToLocalStorage();
            this.updateCartBadge();
            
            if (this.items.length === 0) {
                this.showCart(); // Show empty state
            } else {
                itemElement.remove();
            }
        }, 300);
    },
    
    processCheckout() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;
        
        setTimeout(() => {
            console.log('Proceeding to checkout with:', this.items);
            
            checkoutBtn.textContent = 'Proceed to Checkout';
            checkoutBtn.disabled = false;
            location.href = "checkout.html"

        }, 1500);
    },
    
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.total, 0);
    },
    
    calculateTax() {
        return this.getSubtotal() * 0.1; // 10% tax for example
    },
    
    getTotalPrice() {
        return this.getSubtotal() + this.calculateTax();
    },
    
    updateCartBadge() {
        const totalItems = this.getTotalItems();
        document.querySelectorAll('[data-cart-badge]').forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
                badge.style.display = 'flex';
                
                // Add bounce animation
                badge.style.animation = 'bounce 0.5s ease';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 500);
            } else {
                badge.style.display = 'none';
            }
        });
    },
    
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    
    injectStyles() {
        if (document.getElementById('cart-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cart-styles';
        style.textContent = `
            [data-cart-badge] {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff5252;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: bold;
                display: none;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .cart-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(5px);
                z-index: 1000;
                display: flex;
                justify-content: flex-end;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .cart-content {
                background: white;
                width: 100%;
                max-width: 420px;
                height: 100%;
                padding: 25px;
                overflow-y: auto;
                transform: translateX(100%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
            }
            
            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #f0f0f0;
                margin-bottom: 20px;
            }
            
            .cart-header h3 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
            }
            
            .close-cart {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .close-cart:hover {
                background: #f5f5f5;
                transform: rotate(90deg);
            }
            
            .close-cart svg {
                width: 24px;
                height: 24px;
                fill: #666;
            }
            
            .cart-empty-state {
                text-align: center;
                padding: 40px 0;
                margin: auto;
            }
            
            .empty-cart-animation {
                position: relative;
                width: 100px;
                height: 100px;
                margin: 0 auto 30px;
            }
            
            .cart-icon {
                width: 100%;
                height: 100%;
                fill: #e0e0e0;
            }
            
            .pulse-effect {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(0,0,0,0.05);
                animation: pulse 2s infinite ease-out;
            }
            
            .btn-continue-shopping {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            }
            
            .btn-continue-shopping:hover {
                background: #43A047;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            }
            
            .cart-item {
                display: flex;
                padding: 15px 0;
                border-bottom: 1px solid #f5f5f5;
                opacity: 0;
                transform: translateX(30px);
                transition: all 0.4s ease;
            }
            
            .cart-item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                background: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                flex-shrink: 0;
                overflow: hidden;
            }
            
            .image-placeholder {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
            }
            
            .cart-item-details {
                flex-grow: 1;
            }
            
            .cart-item-title {
                margin: 0 0 5px 0;
                font-size: 1rem;
                color: #333;
            }
            
            .cart-item-plan {
                margin: 0 0 10px 0;
                font-size: 0.85rem;
                color: #666;
            }
            
            .cart-item-quantity {
                display: flex;
                align-items: center;
            }
            
            .quantity-btn {
                width: 28px;
                height: 28px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .quantity-btn:hover {
                background: #f5f5f5;
            }
            
            .quantity-btn:active {
                transform: scale(0.9);
            }
            
            .cart-item-quantity span {
                margin: 0 10px;
                min-width: 20px;
                text-align: center;
            }
            
            .cart-item-price {
                font-weight: bold;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                margin-left: 15px;
            }
            
            .remove-item {
                background: none;
                border: none;
                padding: 5px;
                cursor: pointer;
                margin-top: 5px;
                opacity: 0.6;
                transition: all 0.2s ease;
            }
            
            .remove-item:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            .remove-item svg {
                width: 16px;
                height: 16px;
                fill: #666;
            }
            
            .cart-summary {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #f0f0f0;
            }
            
            .cart-summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 0.95rem;
            }
            
            .cart-summary-row.total {
                font-size: 1.1rem;
                font-weight: bold;
                margin: 20px 0;
                color: #333;
            }
            
            .btn-checkout {
                width: 100%;
                padding: 15px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-checkout:hover {
                background: #1976D2;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
            }
            
            .btn-checkout:disabled {
                background: #BBDEFB;
                transform: none;
                box-shadow: none;
                cursor: not-allowed;
            }
            
            .cart-payment-methods {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
                opacity: 0.7;
            }
            
            .cart-payment-methods img {
                height: 25px;
                filter: grayscale(100%);
                transition: all 0.3s ease;
            }
            
            .cart-payment-methods img:hover {
                filter: grayscale(0%);
            }
            
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                30% { transform: scale(1.3); }
                50% { transform: scale(0.9); }
                70% { transform: scale(1.1); }
            }
            
            @keyframes pulse {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.2; }
                100% { transform: scale(0.8); opacity: 0.5; }
            }
            
            @media (max-width: 480px) {
                .cart-content {
                    max-width: 100%;
                    padding: 15px;
                }
                
                .cart-item {
                    flex-wrap: wrap;
                }
                
                .cart-item-price {
                    flex-direction: row;
                    align-items: center;
                    margin-left: 75px;
                    margin-top: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => Cart.init());

// Global variables
let currentTherapyQuantity = 1;
let currentTherapyPrice = 99.99;

document.addEventListener('DOMContentLoaded', function() {
    changeTherapyImage('🏥');
    
    // Update cart initialization to use our enhanced cart system
    updateCartCount();
    
    document.querySelectorAll('.therapy-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', () => {
            animateElement(thumbnail, 'pulse');
        });
        thumbnail.addEventListener('click', function() {
            animateElement(this, 'bounce');
        });
    });
    
    const stars = document.querySelectorAll('.contact-hero-star-element');
    stars.forEach((star, index) => {
        if (star.classList.contains('contact-hero-star-1')) {
            star.style.animation = `float 4s ease-in-out infinite alternate`;
        } else if (star.classList.contains('contact-hero-star-2')) {
            star.style.animation = `float 5s ease-in-out infinite alternate-reverse`;
        } else if (star.classList.contains('contact-hero-star-3')) {
            star.style.animation = `float 3.5s ease-in-out infinite alternate`;
        }
    });
});

function animateElement(element, animationName, duration = 300) {
    element.style.animation = 'none';
    void element.offsetWidth; // Trigger reflow
    element.style.animation = `${animationName} ${duration}ms ease-out`;
}
function changeTherapyImage(imageType) {
    const mainImageContainer = document.getElementById('therapyMainImage');
    
    const imageMap = {
        'img1': 'imgs/product-image(2).jpg',
        'img2': 'imgs/product-image(3).jpg',
        'img3': 'imgs/product-image(4).jpg',
        'img4': 'imgs/product-image(5).jpg',
        'img5': 'imgs/product-image(6).jpg',
        'img6': 'imgs/product-image(7).jpg',
        'img7': 'imgs/product-image(8).jpg',
        'img8': 'imgs/product-image(9).jpg'
    };
    
    if (imageMap[imageType]) {
        mainImageContainer.style.opacity = '0';
        
        setTimeout(() => {
            // Create image element dynamically
            mainImageContainer.innerHTML = `
                <img src="${imageMap[imageType]}" 
                     alt="${imageType}" 
                     class="therapy-display-image"
                     style="width:100%; height:100%; object-fit:cover;">
            `;
            
            mainImageContainer.style.opacity = '1';
            
            if (event && event.currentTarget) {
                const clickedThumb = event.currentTarget;
                clickedThumb.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    clickedThumb.style.transform = 'scale(1)';
                }, 300);
            }
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const initEvent = { currentTarget: document.querySelector('.therapy-thumbnail') };
    changeTherapyImage('img1');
});
function selectTherapyPlan(element, price) {
    document.querySelectorAll('.therapy-plan-option').forEach(plan => {
        plan.classList.remove('therapy-selected');
    });
    element.classList.add('therapy-selected');
    currentTherapyPrice = price;
    animateElement(element, 'pulse');
}

function changeTherapyQuantity(delta) {
    const newQuantity = currentTherapyQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
        currentTherapyQuantity = newQuantity;
        const quantityDisplay = document.getElementById('therapyQuantity');
        quantityDisplay.textContent = currentTherapyQuantity;
        animateElement(quantityDisplay, 'bounce');
    }
}

function switchTherapyTab(tabElement, tabType) {
    document.querySelectorAll('.therapy-tab').forEach(tab => {
        tab.classList.remove('therapy-active');
    });
    tabElement.classList.add('therapy-active');
    animateElement(tabElement, 'pulse');

    const content = document.getElementById('therapyTabContent');
    animateElement(content, 'fadeIn');
    
    if (tabType === 'service') {
        content.textContent = 'Personalized exercises and hands-on care to restore movement, reduce pain, and support recovery.';
    } else {
        content.textContent = 'Our comprehensive physical therapy approach combines evidence-based techniques with personalized treatment plans. Each session includes assessment, therapeutic exercises, manual therapy, and patient education to ensure optimal recovery outcomes.';
    }
}

// Modified cart functions to use our enhanced cart system
function addTherapyToCart() {
    const quantity = currentTherapyQuantity;
    const selectedPlan = document.querySelector('.therapy-plan-option.therapy-selected');
    const planName = selectedPlan.querySelector('.therapy-plan-name').textContent;
    const price = currentTherapyPrice;
    const serviceName = document.querySelector('.therapy-title').textContent;
    
    const item = {
        name: serviceName,
        plan: planName,
        price: price,
        quantity: quantity,
        total: price * quantity,
        id: Date.now() // Unique ID for animation purposes
    };
    
    // Add to our enhanced cart system
    Cart.items.push(item);
    Cart.saveToLocalStorage();
    Cart.updateCartBadge();
    
    // Animate add to cart button
    const button = event.currentTarget;
    animateElement(button, 'bounce');
    
    // Show flying item animation
    createFlyingItem(button);
    
    // Show notification
    showCartNotification(serviceName, quantity, price * quantity);
}

function createFlyingItem(sourceElement) {
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.textContent = '🛒';
    
    const rect = sourceElement.getBoundingClientRect();
    flyingItem.style.left = `${rect.left + rect.width/2}px`;
    flyingItem.style.top = `${rect.top}px`;
    
    document.body.appendChild(flyingItem);
    
    const cartIcon = document.querySelector('.social-icon[title="Cart"]');
    const cartRect = cartIcon.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width/2;
    const targetY = cartRect.top + cartRect.height/2;
    
    setTimeout(() => {
        flyingItem.style.transform = `translate(${targetX - rect.left - rect.width/2}px, ${targetY - rect.top}px) scale(0.5)`;
        flyingItem.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        flyingItem.remove();
        animateCartIcon(cartIcon);
    }, 1000);
}

function showCartNotification(serviceName, quantity, total) {
    const notification = document.createElement('div');
    notification.className = 'therapy-notification';
    notification.innerHTML = `
        <div class="therapy-notification-content">
            <div class="therapy-notification-icon">✓</div>
            <div class="therapy-notification-text">
                <strong>Added to cart!</strong><br>
                ${serviceName}<br>
                Quantity: ${quantity}<br>
                Total: $${total.toFixed(2)}
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateCartCount() {
    Cart.updateCartBadge();
}

function bookAppointment() {
    animateElement(event.currentTarget, 'pulse');
    setTimeout(() => alert("Booking appointment functionality would go here"), 300);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    if (menu.classList.contains('active')) {
        menu.style.animation = 'slideOutRight 0.3s forwards';
        overlay.style.opacity = '0';
        setTimeout(() => {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        }, 300);
    } else {
        menu.classList.add('active');
        overlay.classList.add('active');
        menu.style.animation = 'slideInRight 0.3s forwards';
        overlay.style.opacity = '1';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    menu.style.animation = 'slideOutRight 0.3s forwards';
    overlay.style.opacity = '0';
    setTimeout(() => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    }, 300);
}

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* Base animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-15px) rotate(5deg); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes pop {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .therapy-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .therapy-notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .therapy-notification-content {
        display: flex;
        align-items: center;
    }
    
    .therapy-notification-icon {
        font-size: 24px;
        margin-right: 15px;
    }
    
    .therapy-notification-text {
        line-height: 1.4;
    }
    
    .flying-item {
        position: fixed;
        font-size: 24px;
        z-index: 1001;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-origin: center;
    }
    
    #mobileMenu {
        transform: translateX(100%);
    }
    
    #mobileMenu.active {
        transform: translateX(0);
    }
    
    #mobileOverlay {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .therapy-plan-option {
        transition: all 0.3s ease;
    }
    
    .therapy-plan-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .therapy-thumbnail {
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.8;
    }
    
    .therapy-thumbnail:hover {
        opacity: 1;
        transform: scale(1.1);
    }
    
    #therapyMainImage {
        transition: all 0.3s ease;
    }
    
    .therapy-tab {
        transition: all 0.2s ease;
    }
    
    .therapy-tab:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(animationStyles);