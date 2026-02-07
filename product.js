aq// js/product.js
document.addEventListener('DOMContentLoaded', () => {
    // Render products if container exists
    const grid = document.getElementById('products-grid');
    if (grid) {
        renderProducts(App.products);
        setupPinterestGrid();
    }
    
    // Set up product modal close button
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('product-modal').style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }
});

// Setup Pinterest-style grid layout
function setupPinterestGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    // Reset columns
    grid.style.columns = '';
    grid.style.columnGap = '';
    
    // Calculate optimal columns based on screen width
    const screenWidth = window.innerWidth;
    let columns = 2; // Default for mobile
    
    if (screenWidth >= 768) columns = 3;
    if (screenWidth >= 1024) columns = 4;
    if (screenWidth >= 1440) columns = 5;
    
    grid.style.columns = `${columns}`;
    grid.style.columnGap = '1rem';
}

// Handle window resize
window.addEventListener('resize', setupPinterestGrid);

// Render products in grid
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">PKR ${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');

    // Add click events to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.getAttribute('data-id'));
            const product = App.products.find(p => p.id === productId);
            openProductModal(product);
        });
    });
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-content');
    
    // Check if product is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-product-details">
            <h2 class="modal-product-title">${product.title}</h2>
            <div class="modal-product-price">$${product.price.toFixed(2)}</div>
            <p class="modal-product-description">${product.description}</p>
            <div class="modal-product-actions">
                <button class="action-btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="action-btn add-to-wishlist ${isInWishlist ? 'in-wishlist' : ''}" 
                        data-id="${product.id}">
                    ${isInWishlist ? '❤️ In Wishlist' : '♡ Save to Wishlist'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Add event listener to Add to Cart button
    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        if (typeof addToCart === 'function') {
            addToCart(productId);
        }
    });
    
    // Add event listener to Add to Wishlist button
    document.querySelector('.add-to-wishlist').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        if (typeof addToWishlist === 'function' && typeof removeFromWishlist === 'function') {
            if (this.classList.contains('in-wishlist')) {
                removeFromWishlist(productId);
                this.classList.remove('in-wishlist');
                this.textContent = '♡ Save to Wishlist';
            } else {
                addToWishlist(productId);
                this.classList.add('in-wishlist');
                this.textContent = '❤️ In Wishlist';
            }
            
            // Update wishlist count in header
            if (typeof updateWishlistCount === 'function') {
                updateWishlistCount();
            }
        }
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// Make functions available for product cards

window.openProductModal = openProductModal;
