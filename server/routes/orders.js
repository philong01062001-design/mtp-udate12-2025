const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Mock orders database
const orders = [];

// Get user orders
router.get('/', authMiddleware, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.id);
  res.json({ orders: userOrders });
});

// Get single order
router.get('/:id', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json({ order });
});

// Create order (checkout)
router.post('/', authMiddleware, (req, res) => {
  const { items, total, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id,
    items,
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Order created successfully', order: newOrder });
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = req.body.status;
  res.json({ message: 'Order status updated', order });
});

// Get all orders (admin only)
router.get('/admin/all', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  res.json({ orders });
});

module.exports = router;
