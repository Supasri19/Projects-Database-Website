document.addEventListener('DOMContentLoaded', () => {
  // Cart state
  let cart = [];
  
  // DOM Elements
  const cartToggle = document.getElementById('cart-toggle');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const closeCart = document.querySelector('.close-cart');
  const overlay = document.querySelector('.overlay');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.querySelector('.cart-total span');
  const addToCartButtons = document.querySelectorAll('.menu__item-add-to-cart');
  
  // Toggle cart sidebar
  function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
  
  // Update cart count
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  // Update cart total
  function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total}฿`;
  }
  
  // Add item to cart
  function addToCart(menuItem) {
    const id = menuItem.closest('.menu__item').dataset.id;
    const title = menuItem.closest('.menu__item').querySelector('.menu__item-title').textContent;
    const price = parseInt(menuItem.closest('.menu__item').querySelector('.menu__item-price').textContent);
    const img = menuItem.closest('.menu__item').querySelector('.menu__item-image').src;
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        title,
        price,
        img,
        quantity: 1
      });
    }
    
    updateCartCount();
    updateCartTotal();
    renderCart();
    
    // Show cart sidebar when item is added
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
  }
  
  // Remove item from cart
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartTotal();
    renderCart();
  }
  
  // Update item quantity
  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(id);
      } else {
        updateCartCount();
        updateCartTotal();
        renderCart();
      }
    }
  }
  
  // Render cart items
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price}฿</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase">+</button>
          </div>
        </div>
        <button class="remove-item">×</button>
      `;
      
      cartItemsContainer.appendChild(cartItem);
      
      // Add event listeners for quantity buttons
      cartItem.querySelector('.decrease').addEventListener('click', () => {
        updateQuantity(item.id, -1);
      });
      
      cartItem.querySelector('.increase').addEventListener('click', () => {
        updateQuantity(item.id, 1);
      });
      
      // Add event listener for remove button
      cartItem.querySelector('.remove-item').addEventListener('click', () => {
        removeFromCart(item.id);
      });
    });
  }

  // Add event listeners for Add to Cart buttons
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      addToCart(button);
    });
  });
  
  // Add event listeners for cart toggle
  cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart();
  });
  
  closeCart.addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);
  
  // Initialize cart
  updateCartCount();
  updateCartTotal();
});