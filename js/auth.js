import { authService } from './api.js';

// DOM Elements
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const userProfile = document.querySelector('.user-profile');
const userName = document.querySelector('.user-name');
const logoutBtn = document.getElementById('logout-btn');

// User state
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

// Utility functions
function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function showError(element, message) {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(element) {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function updateUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login button
    loginBtn.addEventListener('click', () => {
        showModal(loginModal);
    });

    // Register button
    registerBtn.addEventListener('click', () => {
        showModal(registerModal);
    });

    // Close buttons
    closeLoginBtn.addEventListener('click', () => {
        hideModal(loginModal);
    });

    closeRegisterBtn.addEventListener('click', () => {
        hideModal(registerModal);
    });

    // Switch between modals
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });

    // Login form
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        try {
            const user = await authService.login(email, password);
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', user.token);
            
            hideModal(loginModal);
            updateUI();
            showNotification('Inicio de sesión exitoso', 'success');
            loginForm.reset();
        } catch (error) {
            showError(loginForm.querySelector('input[type="email"]'), error.message);
        }
    });

    // Register form
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = registerForm.querySelector('input[name="name"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        
        if (!validateEmail(email)) {
            showError(registerForm.querySelector('input[type="email"]'), 'Email inválido');
            return;
        }
        
        if (!validatePassword(password)) {
            showError(registerForm.querySelector('input[type="password"]'), 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        try {
            const user = await authService.register(name, email, password);
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', user.token);
            
            hideModal(registerModal);
            updateUI();
            showNotification('Registro exitoso', 'success');
            registerForm.reset();
        } catch (error) {
            showError(registerForm.querySelector('input[type="email"]'), error.message);
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        updateUI();
        showNotification('Sesión cerrada', 'info');
    });

    // Input validation
    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            hideError(input);
        });
    });

    registerForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            hideError(input);
        });
    });

    // Close modals when clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideModal(loginModal);
        }
    });

    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            hideModal(registerModal);
        }
    });

    // Initialize UI
    updateUI();
});