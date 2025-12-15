# Fan Community & E-commerce Platform

A full-stack web application built with Vue 2 and Express that combines a fan community platform with e-commerce functionality. Users can share posts, engage with the community, and purchase exclusive merchandise.

## Features

### Fan Community
- **User Authentication**: Secure registration and login system with JWT
- **Community Posts**: Create, view, and interact with community posts
- **Social Features**: Like posts and add comments
- **Real-time Engagement**: Connect with fellow fans and share your passion

### E-commerce
- **Product Catalog**: Browse exclusive merchandise with filtering options
- **Shopping Cart**: Add products, manage quantities, and review orders
- **Checkout System**: Complete orders with shipping information
- **Order Management**: Track order history and status
- **Featured Products**: Highlight special and limited edition items

### User Features
- User profiles with activity tracking
- Protected routes for authenticated users
- Admin capabilities for content management
- Responsive design with Element UI components

## Technology Stack

### Frontend
- **Vue 2.6**: Progressive JavaScript framework
- **Vue Router 3**: Client-side routing
- **Vuex 3**: State management
- **Element UI**: UI component library
- **Axios**: HTTP client

### Backend
- **Express 4**: Node.js web framework
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request parsing

## Project Structure

```
mtp-udate12-2025/
├── client/                 # Vue 2 frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── assets/       # Images, styles, etc.
│   │   ├── components/   # Reusable Vue components
│   │   ├── router/       # Vue Router configuration
│   │   ├── store/        # Vuex store modules
│   │   ├── views/        # Page components
│   │   ├── App.vue       # Root component
│   │   └── main.js       # Application entry point
│   └── package.json
├── server/                # Express backend API
│   ├── middleware/       # Authentication middleware
│   ├── routes/           # API endpoints
│   │   ├── auth.js      # Authentication routes
│   │   ├── posts.js     # Community posts routes
│   │   ├── products.js  # Product catalog routes
│   │   ├── cart.js      # Shopping cart routes
│   │   └── orders.js    # Order management routes
│   └── index.js         # Server entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json          # Root package configuration
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mtp-udate12-2025
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your configuration:
   ```
   PORT=3000
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Start the application**

   **Development mode** (runs both client and server):
   ```bash
   npm run dev
   ```

   **Or run separately:**
   
   Start backend server:
   ```bash
   npm run server
   ```
   
   Start frontend client (in another terminal):
   ```bash
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Community Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (authenticated)
- `POST /api/posts/:id/like` - Like post (authenticated)
- `POST /api/posts/:id/comment` - Add comment (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Shopping Cart
- `GET /api/cart` - Get user cart (authenticated)
- `POST /api/cart/add` - Add item to cart (authenticated)
- `PUT /api/cart/update` - Update cart item (authenticated)
- `DELETE /api/cart/remove/:productId` - Remove item from cart (authenticated)
- `DELETE /api/cart/clear` - Clear cart (authenticated)

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated)
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `GET /api/orders/admin/all` - Get all orders (admin only)

## Usage

### For Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Explore Community**: View and create posts, like and comment
3. **Shop Products**: Browse the product catalog with filters
4. **Add to Cart**: Select products and quantities
5. **Checkout**: Complete purchase with shipping information
6. **Track Orders**: View order history and status

### For Developers

#### Adding New Features

**Create a new route:**
```javascript
// server/routes/feature.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  // Your logic here
});

module.exports = router;
```

**Create a new Vuex module:**
```javascript
// client/src/store/modules/feature.js
export default {
  namespaced: true,
  state: {},
  getters: {},
  actions: {},
  mutations: {}
};
```

**Add a new view:**
```vue
<!-- client/src/views/Feature.vue -->
<template>
  <div class="feature">
    <!-- Your component -->
  </div>
</template>

<script>
export default {
  name: 'Feature'
};
</script>
```

## Building for Production

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

The built files will be in `client/dist/` directory.

## Development

- Frontend runs on port 8080 with hot-reload
- Backend runs on port 3000 with nodemon
- API proxy configured for seamless development

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and middleware
- Input validation
- CORS configuration

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Payment gateway integration
- Email notifications
- Advanced search and filtering
- User profiles and avatars
- Product reviews and ratings
- Admin dashboard
- Real-time notifications
- Social media integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.