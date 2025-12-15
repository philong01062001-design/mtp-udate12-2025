# Development Guide

This guide covers development workflows and best practices for the Fan Community & E-commerce Platform.

## Getting Started

### Initial Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd mtp-udate12-2025
   npm run install-all
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start development servers:**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## Project Structure

```
mtp-udate12-2025/
├── client/                    # Vue 2 Frontend
│   ├── public/               # Static files
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── api/             # API client
│   │   │   └── index.js     # Axios configuration
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── router/          # Vue Router
│   │   │   └── index.js     # Routes configuration
│   │   ├── store/           # Vuex Store
│   │   │   ├── index.js     # Store setup
│   │   │   └── modules/     # Store modules
│   │   │       ├── auth.js  # Authentication state
│   │   │       ├── cart.js  # Shopping cart state
│   │   │       ├── posts.js # Posts state
│   │   │       └── products.js # Products state
│   │   ├── views/           # Page components
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Community.vue
│   │   │   ├── PostDetail.vue
│   │   │   ├── Shop.vue
│   │   │   ├── ProductDetail.vue
│   │   │   ├── Cart.vue
│   │   │   ├── Checkout.vue
│   │   │   ├── Orders.vue
│   │   │   └── Profile.vue
│   │   ├── App.vue          # Root component
│   │   └── main.js          # Application entry
│   ├── babel.config.js      # Babel configuration
│   ├── vue.config.js        # Vue CLI configuration
│   └── package.json         # Frontend dependencies
├── server/                   # Express Backend
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── routes/              # API routes
│   │   ├── auth.js          # Auth endpoints
│   │   ├── posts.js         # Posts endpoints
│   │   ├── products.js      # Products endpoints
│   │   ├── cart.js          # Cart endpoints
│   │   └── orders.js        # Orders endpoints
│   └── index.js             # Server entry point
├── .env.example             # Environment template
├── .gitignore
├── package.json             # Root dependencies
├── README.md                # Main documentation
├── API_TESTING.md           # API testing guide
└── DEVELOPMENT.md           # This file
```

## Development Workflow

### Frontend Development

#### Adding a New Page

1. **Create view component:**
   ```bash
   touch client/src/views/NewPage.vue
   ```

2. **Add route in router:**
   ```javascript
   // client/src/router/index.js
   {
     path: '/new-page',
     name: 'NewPage',
     component: () => import('../views/NewPage.vue')
   }
   ```

3. **Add navigation link:**
   ```vue
   <!-- client/src/App.vue -->
   <router-link to="/new-page">New Page</router-link>
   ```

#### Creating a New Store Module

```javascript
// client/src/store/modules/feature.js
export default {
  namespaced: true,
  state: {
    data: []
  },
  getters: {
    getData: state => state.data
  },
  actions: {
    async fetchData({ commit }) {
      // API call
    }
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data;
    }
  }
};
```

Register in store:
```javascript
// client/src/store/index.js
import feature from './modules/feature';

export default new Vuex.Store({
  modules: {
    feature
  }
});
```

#### Using Element UI Components

```vue
<template>
  <el-button type="primary" @click="handleClick">
    Click Me
  </el-button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$message.success('Button clicked!');
    }
  }
};
</script>
```

### Backend Development

#### Adding a New API Route

1. **Create route file:**
   ```javascript
   // server/routes/feature.js
   const express = require('express');
   const router = express.Router();
   const authMiddleware = require('../middleware/auth');

   router.get('/', async (req, res) => {
     try {
       // Your logic
       res.json({ data: [] });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   });

   module.exports = router;
   ```

2. **Register in server:**
   ```javascript
   // server/index.js
   const featureRoutes = require('./routes/feature');
   app.use('/api/feature', featureRoutes);
   ```

#### Authentication

Protected routes use the auth middleware:
```javascript
const authMiddleware = require('../middleware/auth');

router.post('/protected', authMiddleware, (req, res) => {
  // req.user contains decoded JWT data
  const userId = req.user.id;
  // Your logic
});
```

#### Error Handling

```javascript
router.get('/endpoint', async (req, res) => {
  try {
    // Your logic
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});
```

## Testing

### Manual Testing

#### Frontend Testing
1. Start the development server: `npm run client`
2. Open http://localhost:8080
3. Test user flows manually

#### Backend Testing
1. Start the server: `npm run server`
2. Use curl or Postman to test endpoints
3. See API_TESTING.md for examples

#### Full Stack Testing
```bash
npm run dev
# Access frontend at http://localhost:8080
# Backend API at http://localhost:3000
```

## Code Style

### Vue Components

Follow Vue 2 style guide:
```vue
<template>
  <div class="component-name">
    <!-- Template -->
  </div>
</template>

<script>
export default {
  name: 'ComponentName',
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.component-name {
  /* Styles */
}
</style>
```

### JavaScript

- Use ES6+ features
- Use async/await for async operations
- Use arrow functions where appropriate
- Add error handling for all async operations

## Common Tasks

### Adding a New Product Category

1. Update product data in `server/routes/products.js`
2. Add category option in `client/src/views/Shop.vue`

### Adding Form Validation

```vue
<el-form :model="form" :rules="rules" ref="formRef">
  <el-form-item prop="field">
    <el-input v-model="form.field"></el-input>
  </el-form-item>
</el-form>

<script>
export default {
  data() {
    return {
      form: { field: '' },
      rules: {
        field: [
          { required: true, message: 'Required', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // Submit
        }
      });
    }
  }
};
</script>
```

## Troubleshooting

### Frontend Issues

**Problem:** Module not found errors
```bash
cd client
npm install
```

**Problem:** Port 8080 already in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Backend Issues

**Problem:** Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Problem:** CORS errors
- Check that CORS is enabled in server/index.js
- Verify proxy configuration in client/vue.config.js

## Deployment

### Production Build

1. **Build frontend:**
   ```bash
   npm run build
   ```
   Output: `client/dist/`

2. **Serve static files:**
   ```javascript
   // server/index.js
   app.use(express.static('client/dist'));
   ```

3. **Start server:**
   ```bash
   NODE_ENV=production npm start
   ```

### Environment Variables

Production `.env`:
```
PORT=3000
JWT_SECRET=your_production_secret
NODE_ENV=production
```

## Best Practices

1. **Always handle errors** in async operations
2. **Use try-catch** blocks for API calls
3. **Validate user input** on both frontend and backend
4. **Use environment variables** for configuration
5. **Keep components small** and focused
6. **Use Vuex** for shared state
7. **Implement proper authentication** for protected routes
8. **Add loading states** for async operations
9. **Show user feedback** with messages
10. **Test thoroughly** before committing

## Resources

- [Vue 2 Documentation](https://v2.vuejs.org/)
- [Vue Router Documentation](https://v3.router.vuejs.org/)
- [Vuex Documentation](https://v3.vuex.vuejs.org/)
- [Element UI Documentation](https://element.eleme.io/)
- [Express Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

## Support

For questions and issues:
1. Check existing documentation
2. Review API_TESTING.md for API examples
3. Open an issue in the repository
