const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verificarToken = require("../middlewares/auth");
const permitirRol = require("../middlewares/roles");

// Get all orders (admin only)
router.get('/', verificarToken, permitirRol("admin"), orderController.getOrders);

// Get orders by user
router.get('/user/:userId', verificarToken, orderController.getOrdersByUser);
router.get('/user/:userId/:movieId', verificarToken, orderController.getOrdersByUserAndMovie);

// Get a single order
router.get('/:id', verificarToken, orderController.getOrder);

// Create a new order
router.post('/', verificarToken, orderController.createOrder);

// Update an order
router.put('/:id', verificarToken, orderController.updateOrder);

// Delete an order
router.delete('/:id', verificarToken, orderController.deleteOrder);

module.exports = router; 