// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Función para filtrar productos
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Actualizar botones activos
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filtrar productos
        products.forEach(product => {
            if (category === 'all' || product.getAttribute('data-category') === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Agregar event listeners a los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });

    // Funcionalidad del carrito
    let cart = [];

    // Función para agregar al carrito
    function addToCart(product) {
        cart.push(product);
        updateCartDisplay();
    }

    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            cartCount.style.display = cart.length > 0 ? 'block' : 'none';
        }

        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartItems) {
            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item__image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item__details">
                        <span class="cart-item__name">${item.name}</span>
                        <span class="cart-item__price">$${item.price}</span>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(itemElement);
                total += parseFloat(item.price);
            });

            if (cartTotal) {
                cartTotal.textContent = `$${total.toFixed(2)}`;
            }
        }
    }

    // Modificar la función de agregar al carrito para incluir la imagen
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: productCard.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // Funcionalidad del modal del carrito
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Función para cerrar el modal
    function closeCartModal() {
        cartModal.classList.remove('active');
    }

    // Función para finalizar la compra
    function checkout() {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        // Calcular el total
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        
        // Mostrar resumen de la compra
        const orderSummary = cart.map(item => 
            `${item.name} - $${item.price}`
        ).join('\n');

        // Crear mensaje de confirmación
        const message = `¡Gracias por tu compra!\n\nResumen de la compra:\n${orderSummary}\n\nTotal: $${total.toFixed(2)}\n\n¿Deseas seguir comprando?`;
        
        // Mostrar diálogo de confirmación
        if (confirm(message)) {
            // Si el usuario quiere seguir comprando, solo limpiamos el carrito
            cart = [];
            updateCartDisplay();
            closeCartModal();
        } else {
            // Si el usuario no quiere seguir comprando, limpiamos el carrito y redirigimos a la página de productos
            cart = [];
            updateCartDisplay();
            closeCartModal();
            window.location.href = '#productos';
        }
    }

    // Event listeners para el modal
    if (cartBtn && cartModal && closeCart) {
        // Abrir carrito
        cartBtn.addEventListener('click', function() {
            cartModal.classList.add('active');
        });

        // Cerrar carrito con la X
        closeCart.addEventListener('click', closeCartModal);

        // Cerrar carrito al hacer clic fuera del modal
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });

        // Finalizar compra
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
    }

    // Eliminar del carrito
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            if (e.target.closest('.remove-item')) {
                const index = e.target.closest('.remove-item').getAttribute('data-index');
                cart.splice(index, 1);
                updateCartDisplay();
            }
        });
    }

    // Funcionalidad del modal de autenticación
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.getElementById('close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Función para cambiar entre tabs
    function switchTab(tabName) {
        authTabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        authForms.forEach(form => {
            if (form.id === `${tabName}-form`) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
    }

    // Event listeners para el modal de autenticación
    if (loginBtn && authModal && closeAuth) {
        // Abrir modal
        loginBtn.addEventListener('click', () => {
            authModal.classList.add('active');
        });

        // Cerrar modal
        closeAuth.addEventListener('click', () => {
            authModal.classList.remove('active');
        });

        // Cerrar al hacer clic fuera
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });

        // Cambiar entre tabs
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
            });
        });

        // Modificar el manejo del formulario de login
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Inicio de sesión exitoso');
                    authModal.classList.remove('active');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al iniciar sesión');
            }
        });

        // Modificar el manejo del formulario de registro
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Registro exitoso');
                    authModal.classList.remove('active');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al registrar');
            }
        });
    }

    // Funcionalidad de recuperación de contraseña
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const recoverForm = document.getElementById('recover-form');
    const backToLoginLink = document.querySelector('.back-to-login');

    if (forgotPasswordLink && recoverForm && backToLoginLink) {
        // Mostrar formulario de recuperación
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.remove('active');
            recoverForm.classList.add('active');
            
            // Ocultar tabs
            document.querySelector('.auth-tabs').style.display = 'none';
        });

        // Volver al login
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            recoverForm.classList.remove('active');
            document.getElementById('login-form').classList.add('active');
            
            // Mostrar tabs
            document.querySelector('.auth-tabs').style.display = 'flex';
        });

        // Modificar el manejo del formulario de recuperación
        recoverForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('recover-email').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/recover', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (data.success) {
                    const message = document.createElement('div');
                    message.className = 'recover-message active';
                    message.textContent = data.message;
                    
                    recoverForm.innerHTML = '';
                    recoverForm.appendChild(message);
                    
                    setTimeout(() => {
                        recoverForm.classList.remove('active');
                        document.getElementById('login-form').classList.add('active');
                        document.querySelector('.auth-tabs').style.display = 'flex';
                        recoverForm.innerHTML = `
                            <div class="form__group">
                                <label for="recover-email">Email</label>
                                <input type="email" id="recover-email" required>
                            </div>
                            <button type="submit" class="btn btn--primary">Enviar Link de Recuperación</button>
                            <a href="#" class="back-to-login">Volver al inicio de sesión</a>
                        `;
                    }, 3000);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al procesar la solicitud');
            }
        });
    }
}); 