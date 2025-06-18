import { productService } from './api.js';
import { orderService } from './api.js';
import cart from './cart.js';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const headerActions = document.querySelector('.header__actions');
const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Utility Functions
const showModal = (modal) => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const hideModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Cart Functions
const updateCartDisplay = () => {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item__image">
            <div class="cart-item__details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <div class="cart-item__quantity">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="btn btn--text" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    showNotification('Producto agregado al carrito');
};

const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Producto eliminado del carrito');
};

// Product Functions
const createProductElement = (product) => {
    const productElement = document.createElement('div');
    productElement.className = 'product-card';
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-card__image">
        <div class="product-card__content">
            <h3 class="product-card__title">${product.name}</h3>
            <p class="product-card__price">$${product.price}</p>
            <button class="btn btn--primary" onclick="addToCart(${JSON.stringify(product)})">
                Agregar al Carrito
            </button>
        </div>
    `;
    return productElement;
};

const loadProducts = async (category = 'all') => {
    try {
        const products = await productService.getProducts();
        productsGrid.innerHTML = '';
        
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);

        filteredProducts.forEach(product => {
            productsGrid.appendChild(createProductElement(product));
        });
    } catch (error) {
        showNotification('Error al cargar los productos', 'error');
    }
};

// Event Listeners
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    headerActions.classList.toggle('active');
});

document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        headerActions.classList.remove('active');
    });
});

document.getElementById('cart-btn').addEventListener('click', () => {
    showModal(cartModal);
});

closeCart.addEventListener('click', () => {
    hideModal(cartModal);
});

checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Debes iniciar sesión para realizar la compra', 'error');
        return;
    }

    try {
        await orderService.createOrder(cart);
        cart = [];
        updateCartDisplay();
        hideModal(cartModal);
        showNotification('¡Compra realizada con éxito!');
    } catch (error) {
        showNotification('Error al procesar la compra', 'error');
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadProducts(button.dataset.category);
    });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validación básica
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Aquí iría la lógica para enviar el formulario
    showNotification('Mensaje enviado correctamente');
    contactForm.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartDisplay();
});

// Make functions available globally for onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

console.log('Script cargado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    // Función simple para filtrar
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            if (category === 'all' || product.getAttribute('data-category') === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Agregar listeners a los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });
});

// Datos de ejemplo de productos
const products = [
    {
        id: 1,
        name: 'Teclado Mecánico RGB',
        price: 89.99,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
        description: 'Teclado mecánico gaming con retroiluminación RGB y switches blue.'
    },
    {
        id: 2,
        name: 'Mouse Gaming',
        price: 49.99,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
        description: 'Mouse gaming con sensor óptico de alta precisión y 6 botones programables.'
    },
    {
        id: 3,
        name: 'Monitor 27" 4K',
        price: 399.99,
        category: 'monitores',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
        description: 'Monitor 4K con panel IPS, HDR y tiempo de respuesta de 1ms.'
    },
    {
        id: 4,
        name: 'Auriculares Bluetooth',
        price: 79.99,
        category: 'accesorios',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        description: 'Auriculares inalámbricos con cancelación de ruido y 30 horas de batería.'
    }
];

function renderProducts(category = 'all') {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-card__image-container">
                <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
                <div class="product-card__overlay">
                    <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product)})">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                </div>
            </div>
            <div class="product-card__content">
                <h3>${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <p class="product-card__price">${formatPrice(product.price)}</p>
            </div>
        </div>
    `).join('');

    // Precargar imágenes
    filteredProducts.forEach(product => {
        const img = new Image();
        img.src = product.image;
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('Inicializando aplicación...');
    renderProducts();
    console.log('Aplicación inicializada');
}