const API_URL = 'http://localhost:5000/api';

// Sample products for development
const sampleProducts = [
    {
        id: 1,
        name: 'Teclado Mecánico RGB',
        price: 89.99,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
        description: 'Teclado mecánico con retroiluminación RGB y switches blue.'
    },
    {
        id: 2,
        name: 'Mouse Gaming',
        price: 49.99,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
        description: 'Mouse gaming con 6 botones programables y sensor óptico de alta precisión.'
    },
    {
        id: 3,
        name: 'Monitor 27" 4K',
        price: 399.99,
        category: 'monitores',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
        description: 'Monitor 4K con panel IPS y tiempo de respuesta de 1ms.'
    },
    {
        id: 4,
        name: 'Monitor Curvo 32"',
        price: 299.99,
        category: 'monitores',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
        description: 'Monitor curvo con resolución QHD y frecuencia de actualización de 144Hz.'
    },
    {
        id: 5,
        name: 'Auriculares Gaming',
        price: 79.99,
        category: 'accesorios',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        description: 'Auriculares gaming con sonido envolvente 7.1 y micrófono retráctil.'
    },
    {
        id: 6,
        name: 'Alfombrilla Gaming',
        price: 24.99,
        category: 'accesorios',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&h=500&fit=crop',
        description: 'Alfombrilla gaming de gran tamaño con superficie de tela de alta calidad.'
    }
];

// Función para hacer peticiones a la API
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// Auth Service
export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al iniciar sesión');
        }
    },

    async register(name, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al registrar usuario');
        }
    }
};

// Product Service
export const productService = {
    async getProducts() {
        try {
            // For development, return sample products
            return sampleProducts;

            // Uncomment for production
            // const response = await fetch(`${API_URL}/products`);
            // if (!response.ok) {
            //     throw new Error('Error al cargar productos');
            // }
            // return await response.json();
        } catch (error) {
            throw new Error('Error al cargar productos');
        }
    }
};

// Order Service
export const orderService = {
    async createOrder(items) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No autorizado');
            }

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items })
            });

            if (!response.ok) {
                throw new Error('Error al crear la orden');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al procesar la orden');
        }
    }
}; 