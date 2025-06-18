// Clase para manejar el carrito de compras
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateTotal();
    }

    // Agregar producto al carrito
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    // Remover producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.updateTotal();
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Calcular el total del carrito
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Actualizar la interfaz del carrito
    updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.querySelector('.cart-count');
        
        // Actualizar contador del carrito
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Actualizar lista de items
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                <div class="cart-item__details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item__quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="cart.removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Actualizar total
        cartTotal.textContent = `$${this.total.toFixed(2)}`;
    }
}

// Inicializar el carrito
const cart = new Cart();

// Event Listeners para el carrito
document.addEventListener('DOMContentLoaded', () => {
    // Botón para abrir el carrito
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');

    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Cerrar el carrito al hacer clic fuera
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Botón de finalizar compra
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        // Aquí puedes agregar la lógica para procesar la compra
        alert('¡Gracias por tu compra!');
        cart.items = [];
        cart.saveCart();
        cart.updateCartUI();
        cartModal.classList.remove('active');
    });
});

// Exportar la instancia del carrito para usarla en otros archivos
export default cart; 