const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Mock cart database (in production, use a real database)
const carts = {};

// Get cart
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const cart = carts[userId] || { items: [], total: 0 };
  res.json({ cart });
});

// Add to cart
router.post('/add', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, price, name } = req.body;

  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0 };
  }

  const existingItem = carts[userId].items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({
      productId,
      name,
      price,
      quantity
    });
  }

  // Calculate total
  carts[userId].total = carts[userId].items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  res.json({ message: 'Item added to cart', cart: carts[userId] });
});

// Update cart item
router.put('/update', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const item = carts[userId].items.find(item => item.productId === productId);
  
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  // Recalculate total
  carts[userId].total = carts[userId].items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  res.json({ message: 'Cart updated', cart: carts[userId] });
});

// Remove from cart
router.delete('/remove/:productId', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);

  // Recalculate total
  carts[userId].total = carts[userId].items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  res.json({ message: 'Item removed from cart', cart: carts[userId] });
});

// Clear cart
router.delete('/clear', authMiddleware, (req, res) => {
  const userId = req.user.id;
  carts[userId] = { items: [], total: 0 };
  res.json({ message: 'Cart cleared', cart: carts[userId] });
});

module.exports = router;
