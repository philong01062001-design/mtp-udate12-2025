# API Testing Guide

This document provides examples for testing the API endpoints.

## Prerequisites

Start the server:
```bash
npm start
# or
node server/index.js
```

Server will be available at: http://localhost:3000

## Authentication Endpoints

### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response for authenticated requests.

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Community Posts Endpoints

### Get All Posts
```bash
curl http://localhost:3000/api/posts
```

### Get Single Post
```bash
curl http://localhost:3000/api/posts/1
```

### Create a Post (Authenticated)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Awesome Post",
    "content": "This is the content of my post about our favorite artist!"
  }'
```

### Like a Post (Authenticated)
```bash
curl -X POST http://localhost:3000/api/posts/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Comment to Post (Authenticated)
```bash
curl -X POST http://localhost:3000/api/posts/1/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post! I totally agree!"
  }'
```

## Products Endpoints

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl "http://localhost:3000/api/products?category=apparel"
```

### Get Featured Products
```bash
curl "http://localhost:3000/api/products?featured=true"
```

### Search Products
```bash
curl "http://localhost:3000/api/products?search=shirt"
```

### Get Single Product
```bash
curl http://localhost:3000/api/products/1
```

## Shopping Cart Endpoints

### Get Cart (Authenticated)
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Item to Cart (Authenticated)
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "name": "Official Fan T-Shirt",
    "price": 29.99,
    "quantity": 2
  }'
```

### Update Cart Item (Authenticated)
```bash
curl -X PUT http://localhost:3000/api/cart/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "quantity": 3
  }'
```

### Remove Item from Cart (Authenticated)
```bash
curl -X DELETE http://localhost:3000/api/cart/remove/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Clear Cart (Authenticated)
```bash
curl -X DELETE http://localhost:3000/api/cart/clear \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Orders Endpoints

### Get User Orders (Authenticated)
```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Single Order (Authenticated)
```bash
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Order / Checkout (Authenticated)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "productId": 1,
        "name": "Official Fan T-Shirt",
        "price": 29.99,
        "quantity": 2
      }
    ],
    "total": 59.98,
    "shippingAddress": {
      "fullName": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "phone": "555-1234"
    },
    "paymentMethod": "credit_card"
  }'
```

## Complete Workflow Example

```bash
# 1. Register a user
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Browse products
curl -s http://localhost:3000/api/products | jq '.products[] | {id, name, price}'

# 3. Add items to cart
curl -s -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"name":"Official Fan T-Shirt","price":29.99,"quantity":2}' \
  | jq .

# 4. View cart
curl -s http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# 5. Create a post
curl -s -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Great Product!","content":"Just ordered the t-shirt, cant wait!"}' \
  | jq .

# 6. Place order
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items":[{"productId":1,"name":"Official Fan T-Shirt","price":29.99,"quantity":2}],
    "total":59.98,
    "shippingAddress":{"fullName":"Test User","address":"123 Main St","city":"New York","state":"NY","zipCode":"10001","phone":"555-1234"},
    "paymentMethod":"credit_card"
  }' \
  | jq .

# 7. View order history
curl -s http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer TOKEN` header
- Replace `YOUR_TOKEN_HERE` with the actual token received from login/register
- The API uses in-memory storage, so data will be lost when the server restarts
- For production use, implement a proper database (MongoDB, PostgreSQL, etc.)
