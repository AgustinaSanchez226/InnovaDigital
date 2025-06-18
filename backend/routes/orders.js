const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Obtener todas las órdenes del usuario
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Crear una nueva orden
router.post('/', async (req, res) => {
  try {
    const { products } = req.body;
    
    // Calcular el total y verificar el stock
    let total = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }
      total += product.price * item.quantity;
    }

    // Crear la orden
    const order = new Order({
      user: req.user.userId,
      products: products.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      total
    });

    // Actualizar el stock de los productos
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Obtener una orden específica
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Cancelar una orden
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'No se puede cancelar una orden que no está pendiente' });
    }

    // Devolver el stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router; 