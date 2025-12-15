const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Mock products database
const products = [
  {
    id: 1,
    name: 'Official Fan T-Shirt',
    description: 'High-quality cotton t-shirt with exclusive design',
    price: 29.99,
    category: 'apparel',
    stock: 100,
    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
    featured: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Limited Edition Poster',
    description: 'Collectible poster signed by the artist',
    price: 49.99,
    category: 'collectibles',
    stock: 50,
    image: 'https://via.placeholder.com/300x300?text=Poster',
    featured: true,
    createdAt: new Date('2024-01-02')
  },
  {
    id: 3,
    name: 'Fan Club Hoodie',
    description: 'Comfortable hoodie with embroidered logo',
    price: 59.99,
    category: 'apparel',
    stock: 75,
    image: 'https://via.placeholder.com/300x300?text=Hoodie',
    featured: false,
    createdAt: new Date('2024-01-03')
  },
  {
    id: 4,
    name: 'Concert DVD Collection',
    description: 'Complete collection of past concerts',
    price: 39.99,
    category: 'media',
    stock: 30,
    image: 'https://via.placeholder.com/300x300?text=DVD',
    featured: false,
    createdAt: new Date('2024-01-04')
  }
];

// Get all products
router.get('/', (req, res) => {
  const { category, featured, search } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(p => p.featured);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({ products: filteredProducts });
});

// Get single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

// Create product (authenticated, admin only)
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { name, description, price, category, stock, image, featured } = req.body;
  
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category,
    stock,
    image: image || 'https://via.placeholder.com/300x300?text=Product',
    featured: featured || false,
    createdAt: new Date()
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product created', product: newProduct });
});

// Update product (authenticated, admin only)
router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  Object.assign(product, req.body);
  res.json({ message: 'Product updated', product });
});

// Delete product (authenticated, admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
