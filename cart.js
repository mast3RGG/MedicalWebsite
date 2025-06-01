
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
        
        setTimeout(() => {
            cartOverlay.style.opacity = '1';
            cartContent.style.transform = 'translateX(0)';
            
            if (this.items.length > 0) {
                document.querySelectorAll('.cart-item').forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, i * 100);
                });
            }
        }, 10);
        
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
        cartElement.querySelector('.close-cart')?.addEventListener('click', () => this.hideCart());
        
        cartElement.querySelector('.btn-continue-shopping')?.addEventListener('click', () => {
            this.hideCart();
        });
        
        cartElement.querySelector('.btn-checkout')?.addEventListener('click', () => {
            this.processCheckout();
        });
        
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
        
        quantityDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => {
            quantityDisplay.style.transform = 'scale(1)';
        }, 200);
        
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
        this.showCart(); 
    },
    
    removeItem(itemId) {
        const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        if (!itemElement) return;
        
        itemElement.style.transform = 'translateX(100%)';
        itemElement.style.opacity = '0';
        
        setTimeout(() => {
            this.items = this.items.filter(item => item.id != itemId);
            this.saveToLocalStorage();
            this.updateCartBadge();
            
            if (this.items.length === 0) {
                this.showCart(); 
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
        return this.getSubtotal() * 0.1;
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

document.addEventListener('DOMContentLoaded', () => Cart.init());