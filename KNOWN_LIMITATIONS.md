# Known Limitations

This document outlines known limitations of the current implementation. These are design decisions made for the demo/prototype version and should be addressed when moving to production.

## In-Memory Data Storage

**Current Implementation:** All data (users, posts, products, carts, orders) is stored in memory using JavaScript arrays.

**Limitations:**
1. Data is lost when the server restarts
2. Not suitable for production use
3. No data persistence
4. Limited scalability

**Recommendation:** Integrate a proper database:
- MongoDB with Mongoose (NoSQL option)
- PostgreSQL with Sequelize (SQL option)
- MySQL with Sequelize (SQL option)

## ID Generation

**Current Implementation:** IDs are generated using `array.length + 1`.

**Limitations:**
1. Can create duplicate IDs if items are deleted
2. ID collisions possible after deletions
3. Not thread-safe for concurrent requests

**Affected Routes:**
- `server/routes/auth.js` (line 25) - User registration
- `server/routes/posts.js` (line 38) - Post creation
- `server/routes/products.js` (line 94) - Product creation
- `server/routes/orders.js` (line 38) - Order creation

**Recommendation:** 
- Use database auto-increment IDs
- Or use UUID/GUID for unique identifiers
- Example: `const { v4: uuidv4 } = require('uuid'); id: uuidv4()`

## Input Validation

**Current Limitations:**

### Product Updates (server/routes/products.js, line 120)
- Uses `Object.assign()` with entire request body
- Allows clients to modify any property including `id`, `createdAt`
- Potential security risk

**Recommendation:**
```javascript
// Validate and only update allowed fields
const allowedFields = ['name', 'description', 'price', 'category', 'stock', 'image', 'featured'];
const updates = {};
allowedFields.forEach(field => {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
});
Object.assign(product, updates);
```

### Order Status Updates (server/routes/orders.js, line 64)
- Missing validation for order status values
- Could accept invalid status strings

**Recommendation:**
```javascript
const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
if (!validStatuses.includes(req.body.status)) {
  return res.status(400).json({ message: 'Invalid order status' });
}
```

## Unused Code

### Cart Store Mutation (client/src/store/modules/cart.js, lines 70-73)
- `CLEAR_CART` mutation is defined but never used
- All cart clearing uses `SET_CART` with empty data

**Recommendation:** Either use the mutation or remove it:
```javascript
// Option 1: Use the mutation
async clearCart({ commit }) {
  try {
    const response = await api.delete('/cart/clear');
    commit('CLEAR_CART'); // Use the mutation
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Option 2: Remove the unused mutation
// Delete the CLEAR_CART mutation from mutations object
```

## Security Considerations

### JWT Secret
**Current:** Uses fallback secret 'fallback_secret' if not set in environment
**Recommendation:** Always require JWT_SECRET in production, fail fast if not provided

### Password Requirements
**Current:** Minimum 6 characters
**Recommendation:** Enforce stronger password requirements:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, special characters
- Use a validation library like `validator.js`

### Rate Limiting
**Current:** No rate limiting implemented
**Recommendation:** Add rate limiting middleware:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## Performance Considerations

### No Caching
**Current:** No caching layer
**Recommendation:** Implement caching for frequently accessed data:
- Redis for session storage
- Cache product catalog
- Cache user profiles

### No Pagination
**Current:** Returns all results for lists
**Recommendation:** Implement pagination:
- Posts list
- Products list
- Orders list
- Comments list

### No Image Upload
**Current:** Uses placeholder image URLs
**Recommendation:** Implement proper image upload:
- Use cloud storage (AWS S3, Cloudinary)
- Image optimization
- Multiple image sizes

## Missing Features for Production

1. **Email Notifications**
   - Order confirmation
   - Shipping updates
   - Password reset

2. **Payment Integration**
   - Stripe, PayPal, etc.
   - Secure payment processing
   - Payment status tracking

3. **Search Functionality**
   - Full-text search for products
   - Search in posts
   - Filters and sorting

4. **Admin Dashboard**
   - User management
   - Product management
   - Order management
   - Analytics

5. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

6. **Logging**
   - Application logging
   - Error tracking (Sentry)
   - Analytics

7. **Monitoring**
   - Performance monitoring
   - Error monitoring
   - Uptime monitoring

## Browser Compatibility

**Current:** Targets modern browsers
**Note:** Vue 2 and dependencies may not support older browsers (IE11)

## Deployment Considerations

**Current:** Development setup only
**Production Requirements:**
- Process manager (PM2)
- Reverse proxy (Nginx)
- SSL/HTTPS
- Environment-specific configurations
- Database migrations
- Backup strategy
- CI/CD pipeline

## Conclusion

This implementation is a **functional prototype/demo** that demonstrates the core features of a fan community & e-commerce platform. The known limitations are by design for rapid prototyping. For production deployment, address all items listed above and conduct thorough security audits and performance testing.
