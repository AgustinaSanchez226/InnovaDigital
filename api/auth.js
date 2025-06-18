const express = require('express');
const router = express.Router();
const { connectDB } = require('../config/database');
const bcrypt = require('bcrypt');

// Login
router.post('/login', async (req, res) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;

        const user = await db.collection('users').findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.json({ success: false, message: 'Contraseña incorrecta' });
        }

        res.json({ success: true, message: 'Login exitoso' });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const db = await connectDB();
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.json({ success: true, message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Recuperación de contraseña
router.post('/recover', async (req, res) => {
    try {
        const db = await connectDB();
        const { email } = req.body;

        const user = await db.collection('users').findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'Email no encontrado' });
        }

        // Generar token de recuperación
        const resetToken = require('crypto').randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hora

        await db.collection('users').updateOne(
            { email },
            { 
                $set: { 
                    resetToken,
                    resetExpiry
                }
            }
        );

        // Aquí iría el código para enviar el email con el link de recuperación
        res.json({ success: true, message: 'Se ha enviado un enlace de recuperación' });
    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router; 