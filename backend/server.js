const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB con opciones mejoradas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techessentials', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
  console.log('📦 Base de datos:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techessentials');
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1); // Terminar la aplicación si no se puede conectar a la base de datos
});

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 