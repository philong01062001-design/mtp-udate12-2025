# 📚 LEARNING GUIDE - Hướng Dẫn Học Tập MTP-Update

Tài liệu này giúp bạn **hiểu rõ** cách dự án hoạt động và **học các khái niệm** quan trọng.

---

## 🎯 Mục Lục

1. [Các Khái Niệm Cơ Bản](#các-khái-niệm-cơ-bản)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Authentication Flow (Luồng Xác Thực)](#authentication-flow)
5. [State Management (Quản Lý Trạng Thái)](#state-management)
6. [How to Add New Feature](#how-to-add-new-feature)

---

## 🧠 Các Khái Niệm Cơ Bản

### **1. Client-Server Architecture (Kiến Trúc Client-Server)**

```
┌──────────────────┐
│   Web Browser    │ ← Client (Frontend)
│  (Vue 2 App)     │
└────────┬─────────┘
         │ HTTP Requests/Responses (Port 8080)
         │ GET /api/products
         │ POST /api/authen
         ↓
┌──────────────────┐
│  Node.js Server  │ ← Server (Backend)
│  (Express API)   │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  In-Memory Data  │ (Tạm thời, sẽ thay bằng Database)
│  (users, carts)  │
└──────────────────┘
```

**Ý tưởng:** Frontend và Backend tách biệt, giao tiếp qua HTTP.

---

### **2. REST API (Representational State Transfer)**

API là cách Frontend gọi Backend để lấy/gửi dữ liệu.

**4 loại request chính:**

| Method     | Ý Tưởng     | Ví Dụ                                    |
| ---------- | ----------- | ---------------------------------------- |
| **GET**    | Lấy dữ liệu | `/api/products` (lấy danh sách sản phẩm) |
| **POST**   | Tạo mới     | `/api/users` (tạo tài khoản mới)         |
| **PUT**    | Cập nhật    | `/api/cart/123` (cập nhật giỏ hàng)      |
| **DELETE** | Xóa         | `/api/authen` (logout)                   |

**Ví dụ Flow:**

```javascript
// Frontend gọi API
const response = await axios.post("http://localhost:3000/api/authen", {
  username: "admin",
  password: "admin123",
});

// Backend nhận request, xử lý, trả response
// {status: 200, data: {id: 1, username: 'admin', sessionId: 'sess_123'}}
```

---

### **3. Session vs Token (Phiên làm việc)**

**Session (Cách hiện tại - Đơn Giản)**

```
Login → Backend tạo sessionId → Lưu vào localStorage
Mỗi API call → Gửi sessionId trong header
Logout → Xóa sessionId từ localStorage
```

**Token (JWT - Cách Bảo Mật Hơn, Dùng trong tương lai)**

```
Login → Backend tạo JWT token (mã hóa toàn bộ user info)
Mỗi API call → Gửi token trong header
Logout → Xóa token (server không cần lưu gì)
Ưu điểm: Scalable, stateless
```

---

### **4. Async/Await (Lập Trình Bất Đồng Bộ)**

Trong JavaScript, có nhiều tác vụ mất thời gian (network request, file read).

```javascript
// ❌ Cách cũ (Blocking - Chặn)
const user = getUser();
console.log(user);  // Phải chờ getUser() xong

// ✅ Cách mới (Async - Không chặn)
async function loadUser() {
  const user = await getUser();  // Chờ getUser() xong
  console.log(user);             // Sau đó chạy dòng này
}

// Tương tự trong Frontend:
async login() {
  var { status, data } = await AuthenModel.login(user, pass);  // Chờ API response
  if (status == 200) {
    console.log('Login thành công!');  // Sau đó làm việc này
  }
}
```

**Lợi ích:** UI không bị "đóng cứng" khi chờ API response.

---

## 🎨 Frontend Architecture

### **Cách Frontend Hoạt Động**

```
main.js (Entry Point)
    ↓
App.vue (Root Component)
    ├─ Layout.vue (Main wrapper)
    │   ├─ Menu.vue
    │   ├─ Background.vue
    │   └─ <router-view> (Page content)
    │       ├─ Shop.vue
    │       ├─ Product.vue
    │       ├─ Cart.vue
    │       ├─ Login.vue
    │       └─ ...
    └─ store.js (Vuex - Global State)
```

### **1. Vue Components (Các Khối UI)**

```vue
<template>
  <!-- HTML - Giao diện -->
  <div class="product">
    <h1>{{ product.title }}</h1>
    <button @click="addToCart">Add to Cart</button>
  </div>
</template>

<script>
// JavaScript - Logic
import CartModel from "@/models/cart";

export default {
  data() {
    return {
      product: null,
    };
  },

  async mounted() {
    // Chạy khi component được render
    // Thường dùng để load dữ liệu
  },

  methods: {
    async addToCart() {
      // Gọi API qua model
      var { status } = await CartModel.addToCart(this.productId, 1);
      if (status == 200) {
        alert("Added to cart!");
      }
    },
  },
};
</script>

<style scoped>
/* CSS - Styling (chỉ áp dụng component này) */
.product {
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
```

**3 phần chính:**

- `<template>` - HTML giao diện
- `<script>` - JavaScript logic
- `<style>` - CSS styling

---

### **2. Vue Router (Điều Hướng Trang)**

```javascript
// frontend/src/router/index.js

const routes = [
  {
    path: "/shop",
    name: "Shop",
    component: Shop,
    meta: { title: "Shop", themeDark: false }, // Route metadata
  },
  {
    path: "/product/:productId",
    name: "Product",
    component: Product,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
];
```

**Cách sử dụng trong component:**

```javascript
// Điều hướng đến trang khác
this.$router.push({ name: "Shop" });

// Lấy route params
const productId = this.$route.params.productId;

// Lấy route metadata
const title = this.$route.meta.title;
```

---

### **3. Vuex Store (Global State Management)**

Thay vì truyền data qua props (cách cũ), dùng Vuex để lưu data toàn app.

```javascript
// store.js
const store = new Vuex.Store({
  state: {
    userId: 0,        // Người dùng hiện tại
    user: null,       // Thông tin user
    themeDark: true,  // Light/dark theme
    isApiLoading: 0   // Số API đang chờ
  }
});

// Trong component - Truy cập state
computed: {
  userId() {
    return this.$store.state.userId;  // Lấy
  }
},

methods: {
  login() {
    this.$store.state.userId = 1;     // Đặt
  }
}
```

**Lợi ích:** Mọi component đều có quyền truy cập state toàn app.

---

### **4. Models (API Client Layer)**

Nơi để tất cả API calls, giúp code clean và reusable.

```javascript
// frontend/src/models/authen.js
import api from '../inc/api';

export default {
  async login(username, password) {
    // Gọi API
    return await api.call('authen', 'POST', {
      username, password
    });
  },

  async logout() {
    return await api.call('authen', 'DELETE');
  }
};

// Sử dụng trong component
methods: {
  async handleLogin() {
    const response = await AuthenModel.login('admin', 'admin123');
    if (response.status == 200) {
      console.log('Login success!');
    }
  }
}
```

**Lợi ích:** Tách riêng API logic khỏi UI logic → dễ test, dễ maintain.

---

## 🔧 Backend Architecture

### **Express.js Server (Node.js)**

```javascript
// backend/index.js

const express = require("express");
const app = express();

// Middleware (Xử lý trước request)
app.use(cors());
app.use(express.json());

// Routes (Điểm cuối API)
app.get("/api/products", (req, res) => {
  // req - Request từ client
  // res - Response gửi lại client
  res.json({ status: 200, data: products });
});

app.listen(3000, () => {
  console.log("Server chạy ở port 3000");
});
```

**Cấu trúc Request → Response:**

```
Client → Request:
{
  method: 'GET',
  url: '/api/products',
  headers: { 'x-session-id': 'sess_123' },
  body: null
}

Server → Response:
{
  status: 200,
  data: [...],
  message: 'Success'
}

← Client nhận response
```

---

### **Data Storage (Lưu Trữ Dữ Liệu - Hiện Tại)**

Hiện tại dùng **in-memory** (RAM) - mất khi restart server.

```javascript
// backend/index.js

// Data tạm thời (mất khi restart)
const users = [
  { id: 1, username: "admin", password: "admin123", email: "..." },
];

const carts = {
  // userId → [items]
  1: [{ cart_id: "abc", product_id: 1, quantity: 2, total_price: 1000000 }],
};

const sessions = {
  // sessionId → userId
  sess_123: 1,
};
```

**Lâu dài (Phase 2):** Sẽ thay bằng database (MongoDB, PostgreSQL).

---

## 🔐 Authentication Flow

### **Luồng Login (Đăng Nhập)**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User nhập username/password vào form                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend gọi: AuthenModel.login('admin', 'admin123')    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. api.js gửi POST request đến /api/authen với body        │
│    {username, password}                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend (Express) nhận request:                          │
│    - Tìm user với username/password                         │
│    - Tạo sessionId = 'sess_abc123'                          │
│    - Lưu vào sessions: {'sess_abc123': userId}             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend trả response:                                    │
│    {status: 200, data: {id: 1, sessionId: 'sess_abc123'}}  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend nhận response:                                  │
│    - Lưu sessionId vào localStorage                         │
│    - Đặt this.$store.state.userId = 1                      │
│    - Điều hướng đến Home page                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Mỗi API call tiếp theo:                                 │
│    - api.js lấy sessionId từ localStorage                  │
│    - Gắn vào header: x-session-id: 'sess_abc123'           │
│    - Backend kiểm tra sessionId để biết user nào gọi       │
└─────────────────────────────────────────────────────────────┘
```

### **Luồng Logout (Đăng Xuất)**

```
Click Logout Button
        ↓
Call AuthenModel.logout()
        ↓
api.js gửi DELETE /api/authen (với sessionId)
        ↓
Backend xóa sessionId từ sessions object
        ↓
Frontend nhận response
        ↓
localStorage.removeItem('sessionId')
this.$store.state.userId = null
Điều hướng về Home
```

---

## 📊 State Management

### **Luồng State Update**

```
Component:                  Store:
this.$store.state.userId = 123  →  state.userId = 123

Component:                  Store:
console.log(                    →  Truy cập state
  this.$store.state.userId
)
```

**Component có thể truy cập & thay đổi state từ bất cứ đâu:**

```javascript
// Component A
this.$store.state.userId = 1; // Thay đổi

// Component B
console.log(this.$store.state.userId); // Sẽ in ra 1 (có thay đổi!)
```

**Lợi ích:** Data được chia sẻ trực tiếp giữa các component.

---

## 🚀 How to Add New Feature

### **Ví Dụ: Thêm tính năng "Wishlist" (Danh Sách Yêu Thích)**

#### **Bước 1: Backend - Tạo API**

```javascript
// backend/index.js

// Dữ liệu wishlist
const wishlists = {}; // userId → [productIds]

// GET /api/wishlist - Lấy wishlist
app.get("/api/wishlist", (req, res) => {
  const sessionId = req.headers["x-session-id"];
  const userId = sessions[sessionId];

  if (!userId) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: "Not authenticated",
    });
  }

  const items = wishlists[userId] || [];
  res.status(200).json({
    status: 200,
    data: items,
  });
});

// POST /api/wishlist - Thêm vào wishlist
app.post("/api/wishlist", (req, res) => {
  const { product_id } = req.body;
  const sessionId = req.headers["x-session-id"];
  const userId = sessions[sessionId];

  if (!userId) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: "Not authenticated",
    });
  }

  if (!wishlists[userId]) {
    wishlists[userId] = [];
  }

  if (!wishlists[userId].includes(product_id)) {
    wishlists[userId].push(product_id);
  }

  res.status(200).json({
    status: 200,
    data: wishlists[userId],
  });
});
```

---

#### **Bước 2: Frontend - Tạo API Model**

```javascript
// frontend/src/models/wishlist.js
import api from "../inc/api";

export default {
  async get() {
    return await api.call("wishlist");
  },

  async add(productId) {
    return await api.call("wishlist", "POST", {
      product_id: productId,
    });
  },
};
```

---

#### **Bước 3: Frontend - Tạo Component**

```vue
<!-- frontend/src/components/pages/Wishlist.vue -->
<template>
  <div class="wishlist">
    <h1>My Wishlist</h1>

    <div v-if="items.length === 0" class="empty">No items in wishlist</div>

    <div v-else class="wishlist-items">
      <div v-for="productId in items" :key="productId">
        <router-link :to="{ name: 'Product', params: { productId } }">
          View Product {{ productId }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import WishlistModel from "@/models/wishlist";

export default {
  data() {
    return {
      items: [],
    };
  },

  async mounted() {
    const { status, data } = await WishlistModel.get();
    if (status == 200) {
      this.items = data;
    }
  },
};
</script>

<style scoped>
.wishlist {
  padding: 20px;
}

.wishlist-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}
</style>
```

---

#### **Bước 4: Thêm Route**

```javascript
// frontend/src/router/index.js

import Wishlist from "@/components/pages/Wishlist";

export default new Router({
  routes: [
    // ...existing routes
    {
      path: "/wishlist",
      name: "Wishlist",
      component: Wishlist,
      meta: { title: "My Wishlist" },
    },
  ],
});
```

---

#### **Bước 5: Thêm Button "Add to Wishlist"**

```vue
<!-- Product.vue -->
<template>
  <div class="product">
    <!-- ... existing content ... -->
    <button @click="addToWishlist">❤️ Add to Wishlist</button>
  </div>
</template>

<script>
import WishlistModel from "@/models/wishlist";

export default {
  // ...existing code...

  methods: {
    async addToWishlist() {
      const { status } = await WishlistModel.add(this.productId);
      if (status == 200) {
        alert("Added to wishlist!");
      }
    },
  },
};
</script>
```

---

### **Tóm Tắt 5 Bước**

1. **Backend** - Tạo API endpoint (GET/POST/PUT/DELETE)
2. **Frontend Model** - Tạo file gọi API (`models/wishlist.js`)
3. **Frontend Component** - Tạo Vue component hiển thị dữ liệu
4. **Router** - Thêm route nếu là trang mới
5. **Integrate** - Thêm button/link vào component khác

---

## 📝 Summary

### **Từ Vựng Quan Trọng**

| Từ                  | Ý Tưởng                                         |
| ------------------- | ----------------------------------------------- |
| **REST API**        | Cách Frontend gọi Backend (GET/POST/PUT/DELETE) |
| **Endpoint**        | Một "điểm" API, ví dụ `/api/products`           |
| **Request**         | Dữ liệu gửi từ Frontend đến Backend             |
| **Response**        | Dữ liệu Backend gửi lại Frontend                |
| **Session**         | Phiên làm việc của user (login/logout)          |
| **Token/SessionId** | Mã định danh user để backend nhận ra            |
| **Async/Await**     | Cách để chờ tác vụ mất thời gian mà không block |
| **Component**       | Một khối UI trong Vue                           |
| **Router**          | Điều hướng giữa các trang                       |
| **Vuex Store**      | Nơi lưu trữ data toàn app                       |
| **Model**           | File chứa các API calls                         |

---

**Bạn đã sẵn sàng! Tiếp theo, hãy đọc README.md để hiểu cách chạy dự án. 🚀**
