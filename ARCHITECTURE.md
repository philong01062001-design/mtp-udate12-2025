# 🏗️ ARCHITECTURE - Kiến Trúc Dự Án MTP-Update

Tài liệu này mô tả chi tiết cách các thành phần của dự án tương tác với nhau.

---

## 📊 High-Level Architecture

```
┌──────────────────────────────────┐
│      Web Browser (Port 8080)      │
│  ┌─────────────────────────────┐  │
│  │   Vue 2 Frontend Application  │  │
│  │  - Components (UI)            │  │
│  │  - Router (Navigation)        │  │
│  │  - Models (API Calls)         │  │
│  │  - Store (State)              │  │
│  └────────────┬──────────────────┘  │
└───────────────┼────────────────────┘
                │
                │ HTTP/JSON
                │ (GET/POST/PUT/DELETE)
                │
┌───────────────┼────────────────────┐
│ Node.js Server (Port 3000)          │
│  ┌────────────▼──────────────────┐  │
│  │  Express.js Server            │  │
│  │  - Routes (API Endpoints)     │  │
│  │  - Middleware (CORS, etc)     │  │
│  │  - Logic (Authentication,etc) │  │
│  └────────────┬──────────────────┘  │
│               │                      │
│  ┌────────────▼──────────────────┐  │
│  │  In-Memory Data Storage       │  │
│  │  - users[]                    │  │
│  │  - products[]                 │  │
│  │  - carts{}                    │  │
│  │  - sessions{}                 │  │
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## 🔄 Data Flow (Luồng Dữ Liệu)

### **Login Flow (Ví Dụ Chi Tiết)**

```
STEP 1: User Action (Người dùng nhập dữ liệu)
┌─────────────────────────────────────────────────┐
│ User nhập:                                      │
│  - Username: admin                              │
│  - Password: admin123                           │
│ Bấm nút "Login"                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
STEP 2: Vue Component Method Trigger
┌─────────────────────────────────────────────────┐
│ Login.vue → methods.login() gọi                 │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
STEP 3: Call API Model
┌─────────────────────────────────────────────────┐
│ AuthenModel.login('admin', 'admin123')          │
│ (Gọi models/authen.js)                          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
STEP 4: Axios API Call (HTTP Request)
┌─────────────────────────────────────────────────┐
│ api.js:                                         │
│ axios.post('http://localhost:3000/api/authen',  │
│   { username: 'admin', password: 'admin123' },  │
│   headers: { 'x-session-id': '' }               │
│ )                                               │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP POST Request
                 │ ─────────────────────────────
                 │ POST /api/authen HTTP/1.1
                 │ Host: localhost:3000
                 │ Content-Type: application/json
                 │
                 │ {
                 │   "username": "admin",
                 │   "password": "admin123"
                 │ }
                 │
                 ↓
STEP 5: Backend Processing (Express)
┌─────────────────────────────────────────────────┐
│ app.post('/api/authen', (req, res) => {         │
│   const user = users.find(...)  // Tìm user    │
│   if (user) {                                    │
│     const sessionId = 'sess_abc123'             │
│     sessions[sessionId] = user.id  // Lưu      │
│   }                                              │
│ })                                              │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP Response
                 │ ─────────────────────────────
                 │ 200 OK
                 │ Content-Type: application/json
                 │
                 │ {
                 │   "status": 200,
                 │   "data": {
                 │     "id": 1,
                 │     "username": "admin",
                 │     "sessionId": "sess_abc123"
                 │   }
                 │ }
                 │
                 ↓
STEP 6: Frontend Process Response
┌─────────────────────────────────────────────────┐
│ Nhận response từ api.js:                         │
│ { status: 200, data: {..., sessionId: '...'} }  │
│                                                  │
│ if (status == 200) {                            │
│   // Lưu sessionId                              │
│   localStorage.setItem('sessionId', '...')      │
│                                                  │
│   // Cập nhật store                             │
│   this.$store.state.userId = data.id            │
│   this.$store.state.user = data                 │
│                                                  │
│   // Điều hướng                                 │
│   this.$router.push({ name: 'Index' })          │
│ }                                                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
STEP 7: UI Update
┌─────────────────────────────────────────────────┐
│ Vue re-render component:                        │
│ - Hiển thị user name                            │
│ - Ẩn login button, hiển thị logout button       │
│ - Cho phép truy cập trang cart/checkout         │
└─────────────────────────────────────────────────┘
```

---

## 📂 Frontend Structure

### **Component Hierarchy**

```
src/
├── main.js
│   └── App.vue (Root Component)
│       ├── Background.vue (Static background)
│       └── Layout.vue (Main wrapper)
│           ├── Menu.vue (Navigation menu)
│           └── <router-view>
│               ├── pages/
│               │   ├── Shop.vue (Product listing)
│               │   ├── Product.vue (Product details)
│               │   ├── Cart.vue (Shopping cart)
│               │   ├── Login.vue (Authentication)
│               │   ├── CreateNewAccount.vue
│               │   ├── Logout.vue
│               │   ├── CheckOut.vue
│               │   ├── PurchaseTransfer.vue
│               │   ├── CheckOutDone.vue
│               │   ├── Cart.vue
│               │   ├── ShippingInfo.vue
│               │   ├── UpdateAccount.vue
│               │   ├── VerifyAccount.vue
│               │   ├── ResetPassword.vue
│               │   ├── AboutUs.vue
│               │   ├── Contact.vue
│               │   ├── Schedule.vue
│               │   ├── Multimedia.vue
│               │   ├── PrivacyPolicy.vue
│               │   └── Artist.vue
│               └── MTPEVideo.vue (Animation/Video)
│
├── models/ (API Client Layer)
│   ├── authen.js (Login, Logout, Check Auth)
│   ├── products.js (Get products)
│   ├── cart.js (Cart operations)
│   ├── checkout.js (Checkout operations)
│   ├── user.js (User account operations)
│   └── pages.js (Get static pages)
│
├── inc/ (Utilities)
│   ├── api.js ⭐ (MOST IMPORTANT - Axios wrapper)
│   ├── lang.js (i18n - English/Vietnamese)
│   ├── utils.js (Math, mouse position helpers)
│   ├── cursor.js (Custom cursor effect)
│   └── fmt.js (Number formatting)
│
├── router/
│   └── index.js (Route configuration)
│
└── store.js (Vuex global state)
```

---

## 🔗 File Dependencies

### **How Everything Connects**

```
User clicks a button
    ↓
    └─→ Component (e.g., Login.vue)
         ├─ imports: AuthenModel
         └─ calls: AuthenModel.login()
               ↓
               └─→ Model (authen.js)
                    ├─ imports: api
                    └─ calls: api.call('authen', 'POST', {...})
                         ↓
                         └─→ API Layer (api.js) ⭐ CRITICAL
                              ├─ imports: axios
                              ├─ reads: localStorage.getItem('sessionId')
                              └─ calls: axios({...})
                                   ↓
                                   └─→ HTTP Request to Backend
```

---

## 🧪 Component Example Breakdown

### **Login.vue - Detailed Analysis**

```vue
<template>
  <!-- PRESENTATION LAYER -->
  <div class="login">
    <form @submit.prevent="login">
      <!-- Data binding: v-model="username" -->
      <!-- Event binding: @submit.prevent="login" -->
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
// BUSINESS LOGIC LAYER
import AuthenModel from "@/models/authen"; // Import API model
import ee from "@/inc/lang"; // Import i18n

export default {
  // Component name (should match file name)
  name: "Login",

  // REACTIVE STATE
  data() {
    return {
      username: "", // Form input
      password: "", // Form input
      error: "", // Error message display
      ee, // i18n function
    };
  },

  // COMPUTED PROPERTIES (Reactive properties)
  computed: {
    userId() {
      // Truy cập Vuex store
      return this.$store.state.userId;
    },
  },

  // LIFECYCLE HOOKS (Chạy ở các thời điểm nhất định)
  async mounted() {
    // Chạy sau khi component được render
    if (this.userId) {
      // Nếu đã login, điều hướng về Home
      this.$router.push({ name: "Index" });
    }
  },

  // EVENT HANDLERS
  methods: {
    async login() {
      // Gọi API model
      var { status, data, message } = await AuthenModel.login(
        this.username,
        this.password
      );

      if (status == 200) {
        // SUCCESS
        // 1. Lưu sessionId vào localStorage
        localStorage.setItem("sessionId", data.sessionId);

        // 2. Cập nhật Vuex store
        this.$store.state.userId = data.id;
        this.$store.state.user = data;

        // 3. Điều hướng
        this.$router.push({ name: "Index" });
      } else {
        // ERROR
        this.error = message || "Login failed";
      }
    },
  },
};
</script>

<style scoped>
/* COMPONENT-SPECIFIC STYLES -->
/* Only applies to this component */
.login {
  width: 320px;
  margin: auto;
}
</style>
```

---

## 🌐 Backend API Structure

### **Express.js Routes Organization**

```javascript
// backend/index.js

// 1. SETUP
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 2. MIDDLEWARE (runs before every request)
app.use(cors());
app.use(express.json());

// 3. DATA (In-memory)
const users = [...];
const products = [...];
const carts = {};
const sessions = {};

// 4. ROUTES

// ============ PRODUCTS ============
app.get('/api/products', (req, res) => {
  // req.method = 'GET'
  // req.path = '/api/products'
  // req.body = null
  // req.headers = { ... }

  // Process
  const response = {
    status: 200,
    data: products
  };

  // Send response
  res.status(200).json(response);
});

// ============ AUTHENTICATION ============
app.post('/api/authen', (req, res) => {
  // req.body = { username, password }

  // Process
  const user = users.find(u =>
    u.username === req.body.username &&
    u.password === req.body.password
  );

  if (user) {
    const sessionId = 'sess_' + Math.random().toString(36).substring(7);
    sessions[sessionId] = user.id;

    res.status(200).json({
      status: 200,
      data: {
        id: user.id,
        username: user.username,
        sessionId: sessionId
      }
    });
  } else {
    res.status(401).json({
      status: 401,
      data: null,
      message: 'Invalid credentials'
    });
  }
});

// ============ CART ============
app.put('/api/cart', (req, res) => {
  // req.headers['x-session-id'] = 'sess_123'
  // req.body = { product_id, quantity }

  const sessionId = req.headers['x-session-id'];
  const userId = sessions[sessionId];  // Get userId from sessionId

  if (!userId) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: 'Not authenticated'
    });
  }

  // Process...

  res.status(200).json({
    status: 200,
    data: carts[userId]
  });
});

// 5. START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 💾 Data Model

### **User**

```javascript
{
  id: 1,
  username: "admin",
  email: "admin@example.com",
  password: "admin123",  // In production: bcrypt hash
  phone: "0901234567",
  address: "HCM",
  verified: true
}
```

### **Product**

```javascript
{
  id: 1,
  title: "Áo Thun MTP Signature",
  thumbnail: "https://...",
  price: 500000,
  regular_price: 600000,
  content: "<p>Mô tả sản phẩm...</p>",
  redirect: null  // null = internal, string = external link
}
```

### **Cart Item**

```javascript
{
  cart_id: "abc123",
  product_id: 1,
  title: "Áo Thun MTP Signature",
  thumbnail: "https://...",
  quantity: 2,
  total_price: 1000000
}
```

### **Session**

```javascript
sessions = {
  sess_abc123: 1, // sessionId → userId
  sess_xyz789: 2,
};
```

---

## 🔄 State Updates Flow

```
User Action
    ↓
Component Method
    ↓
Call API Model
    ↓
api.js makes HTTP request
    ↓
Backend processes
    ↓
Returns {status, data}
    ↓
Component checks status
    ↓
Update: localStorage, Vuex store, UI
    ↓
Vue automatically re-renders
```

---

## 🔐 Authentication System

### **Current System (Session-based)**

```
┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │ store sessionId in localStorage
       │
┌──────┴───────────────────────┐
│ Browser Local Storage         │
│ {sessionId: 'sess_abc123'}   │
└──────┬───────────────────────┘
       │ send in header: x-session-id
       │
┌──────┴───────────────────────┐
│ Backend                       │
│ sessions = {                  │
│   'sess_abc123': 1   ← userId │
│ }                             │
└───────────────────────────────┘
```

### **How It Works**

1. **Login:** Backend creates sessionId, stores `sessions[sessionId] = userId`
2. **Subsequent Calls:** Frontend sends `x-session-id` in header
3. **Backend:** Looks up `sessions[sessionId]` to find userId
4. **Logout:** Delete from `sessions` object & localStorage

---

## 📝 Summary: Key Files & Their Purposes

| File                     | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `api.js`                 | ⭐ **CRITICAL** - Wraps axios, handles headers |
| `models/*.js`            | API calls for each feature                     |
| `components/pages/*.vue` | UI pages                                       |
| `store.js`               | Global app state                               |
| `router/index.js`        | Route definitions                              |
| `backend/index.js`       | All API endpoints                              |

---

**Next Step:** Read LEARNING_GUIDE.md to understand concepts better! 📚
