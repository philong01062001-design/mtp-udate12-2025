# MTP-Update: Fan Community & E-Commerce Platform

## 📚 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
3. [Cài Đặt & Chạy Dự Án](#cài-đặt--chạy-dự-án)
4. [Cách Hoạt Động](#cách-hoạt-động)
5. [API Documentation](#api-documentation)
6. [Các Tính Năng Chính](#các-tính-năng-chính)
7. [Troubleshooting](#troubleshooting)
8. [Các Bước Phát Triển Tiếp Theo](#các-bước-phát-triển-tiếp-theo)

---

## 🎯 Giới Thiệu

**MTP-Update** là một nền tảng e-commerce & cộng đồng fan được xây dựng bằng:

- **Frontend**: Vue 2 + Vue Router + Vuex (JavaScript framework)
- **Backend**: Express.js (Node.js REST API)
- **Styling**: Bootstrap 4 + Custom CSS
- **Animations**: PIXI.js (WebGL) + GSAP

**Mục đích**: Bán hàng merchandise, quản lý tài khoản user, xử lý đơn hàng

---

## 📁 Cấu Trúc Dự Án

```
MTP-Update/
├── backend/                    # Node.js Express API server
│   ├── index.js               # Main server file (port 3000)
│   └── package.json           # Dependencies
│
├── frontend/                   # Vue 2 Application
│   ├── src/
│   │   ├── components/        # Vue components
│   │   │   ├── Layout.vue     # Main wrapper
│   │   │   ├── pages/         # Page components
│   │   │   │   ├── Shop.vue   # Trang hiển thị sản phẩm
│   │   │   │   ├── Product.vue# Chi tiết & thêm giỏ hàng
│   │   │   │   ├── Cart.vue   # Giỏ hàng
│   │   │   │   ├── Login.vue  # Đăng nhập
│   │   │   │   └── ...other pages
│   │   │   └── MTPEVideo.vue  # Custom video/animation component
│   │   ├── models/            # API client layer
│   │   │   ├── authen.js      # Authentication API calls
│   │   │   ├── products.js    # Product API calls
│   │   │   ├── cart.js        # Cart API calls
│   │   │   └── ...
│   │   ├── inc/               # Utilities
│   │   │   ├── api.js         # Axios wrapper (IMPORTANT!)
│   │   │   ├── lang.js        # i18n translations (EN/VN)
│   │   │   ├── utils.js       # Helper functions
│   │   │   └── cursor.js      # Custom cursor effect
│   │   ├── router/            # Vue Router configuration
│   │   ├── store.js           # Vuex store
│   │   ├── App.vue            # Root component
│   │   └── main.js            # Entry point
│   ├── public/                # Static assets
│   │   └── static/            # Images, fonts, videos
│   └── package.json           # Dependencies
│
└── .github/
    └── copilot-instructions.md # AI coding guide

```

---

## 🚀 Cài Đặt & Chạy Dự Án

### **Yêu Cầu Trước**

- Node.js v14+ (kiểm tra: `node --version`)
- npm v6+ (kiểm tra: `npm --version`)

### **Bước 1: Cài Đặt Dependencies**

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd frontend
npm install
```

### **Bước 2: Chạy Server**

#### Terminal 1 - Backend (Port 3000):

```bash
cd backend
npm run dev    # Run with nodemon (auto-reload khi code thay đổi)
# hoặc
npm start      # Run normally
```

**Output mong đợi:**

```
Server Node.js đang chạy tại: http://localhost:3000
```

#### Terminal 2 - Frontend (Port 8080):

```bash
cd frontend
npm run serve  # Dev server with hot reload
```

**Output mong đợi:**

```
  App running at:
  - Local:   http://localhost:8080/
```

### **Bước 3: Truy Cập Ứng Dụng**

Mở trình duyệt và vào: **http://localhost:8080**

---

## 💡 Cách Hoạt Động

### **Quy Trình Yêu Cầu (Request Flow)**

```
Frontend (Vue)
    ↓
Calls API Model (e.g., LoginModel.login())
    ↓
api.js (Axios wrapper)
    - Gắn sessionId vào header: x-session-id
    - Gọi http://localhost:3000/api/[endpoint]
    ↓
Backend (Express)
    - Kiểm tra sessionId từ header
    - Xử lý logic
    - Trả về JSON response: {status, data, message}
    ↓
Frontend nhận response
    - if status == 200: Success
    - else: Error, hiển thị message
```

### **Session Management (Quản Lý Phiên Đăng Nhập)**

**Cách lưu trữ session hiện tại:**

1. User login → Backend tạo sessionId ngẫu nhiên
2. Backend trả sessionId trong response
3. **Frontend lưu vào localStorage**: `localStorage.setItem('sessionId', data.sessionId)`
4. **Mỗi API call gửi sessionId** trong header: `x-session-id: [sessionId]`
5. User logout → Frontend xóa sessionId: `localStorage.removeItem('sessionId')`

**Ví dụ localStorage (F12 → Application → Local Storage):**

```javascript
{
  sessionId: "sess_abc123xyz"; // Giúp backend nhận diện user
}
```

### **State Management (Vuex Store)**

`frontend/src/store.js` quản lý toàn bộ app state:

```javascript
{
  themeDark: boolean,      // Light/dark theme
  endLoading: boolean,     // Loading screen hoàn thành
  userId: number,          // ID user đang login (0 = not logged in)
  user: object,            // User info {id, username, email}
  isApiLoading: number     // Số API calls đang chờ
}
```

**Truy cập state trong component:**

```javascript
this.$store.state.userId; // Get
this.$store.state.userId = 123; // Set
```

---

## 📡 API Documentation

### **Base URL**

```
http://localhost:3000/api/
```

### **Response Format (Tất Cả API)**

```javascript
{
  status: 200,                    // HTTP status
  data: {...} or [...],          // Response data
  message: "Optional message"     // Error message (nếu có)
}
```

---

### **Authentication (Xác Thực)**

#### 1. **POST /api/authen - Login**

**Gọi từ**: `AuthenModel.login(username, password)`

**Request:**

```javascript
{
  username: "admin",
  password: "admin123"
}
```

**Response (Success - 200):**

```javascript
{
  status: 200,
  data: {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    sessionId: "sess_abc123"  // ⭐ Frontend phải lưu cái này
  }
}
```

**Test Credentials:**

```
Username: admin
Password: admin123
```

---

#### 2. **GET /api/authen - Check Session**

**Gọi từ**: `AuthenModel.get()`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Response (Success - 200):**

```javascript
{
  status: 200,
  data: {
    id: 1,
    username: "admin",
    email: "admin@example.com"
  }
}
```

---

#### 3. **DELETE /api/authen - Logout**

**Gọi từ**: `AuthenModel.logout()`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Response:**

```javascript
{
  status: 200,
  data: null,
  message: "Logged out"
}
```

---

### **Products (Sản Phẩm)**

#### 1. **GET /api/products - Lấy Danh Sách**

**Gọi từ**: `ProductModel.getAll()`

**Response:**

```javascript
{
  status: 200,
  data: [
    {
      id: 1,
      title: "Áo Thun MTP Signature",
      thumbnail: "https://...",
      price: 500000,
      regular_price: 600000,
      content: "<p>Mô tả sản phẩm...</p>",
      redirect: null
    },
    ...
  ]
}
```

---

#### 2. **GET /api/products/:id - Chi Tiết Sản Phẩm**

**Gọi từ**: `ProductModel.getById(1)`

**Response:**

```javascript
{
  status: 200,
  data: {
    id: 1,
    title: "Áo Thun MTP Signature",
    ...
  }
}
```

---

### **Cart (Giỏ Hàng)**

#### 1. **PUT /api/cart - Thêm Vào Giỏ**

**Gọi từ**: `CartModel.addToCart(productId, quantity)`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Request Body:**

```javascript
{
  product_id: 1,
  quantity: 2
}
```

**Response:**

```javascript
{
  status: 200,
  data: [
    {
      cart_id: "abc123",
      product_id: 1,
      title: "Áo Thun MTP Signature",
      thumbnail: "...",
      quantity: 2,
      total_price: 1000000
    }
  ]
}
```

---

#### 2. **GET /api/cart/items - Lấy Giỏ Hàng**

**Gọi từ**: `CartModel.get()`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Response:**

```javascript
{
  status: 200,
  data: [
    { cart_id, product_id, title, quantity, total_price },
    ...
  ]
}
```

---

#### 3. **PUT /api/cart/:id - Update Quantity**

**Gọi từ**: `CartModel.update(cartItemId, quantity)`

**Request:**

```javascript
{
  quantity: 3;
}
```

**Note:** Nếu quantity ≤ 0 → item bị xóa khỏi giỏ

---

### **Users (Tài Khoản)**

#### 1. **POST /api/users - Tạo Tài Khoản**

**Gọi từ**: `UserModel.create(username, email, password)`

**Request:**

```javascript
{
  username: "newuser",
  email: "user@example.com",
  password: "pass123"
}
```

**Response (Success):**

```javascript
{
  status: 200,
  data: {
    id: 2,
    username: "newuser",
    email: "user@example.com"
  }
}
```

---

#### 2. **POST /api/users/verify - Xác Minh Email**

**Gọi từ**: `UserModel.verify(userId, verifyCode)`

**Request:**

```javascript
{
  user_id: 2,
  verify_code: "123456"
}
```

---

#### 3. **PUT /api/users - Cập Nhật Profile**

**Gọi từ**: `UserModel.update(password, phone, address)`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Request:**

```javascript
{
  password: "newpass",
  phone: "0901234567",
  address: "123 Main St"
}
```

---

### **Checkout (Thanh Toán)**

#### **POST /api/checkout/transfer - Tạo Đơn Hàng**

**Gọi từ**: `CheckoutModel.useTransfer(name)`

**Request Headers:**

```
x-session-id: sess_abc123
```

**Request:**

```javascript
{
  name: "Nguyễn Văn A";
}
```

**Response:**

```javascript
{
  status: 200,
  data: {
    order_id: "ORD_ABC123XYZ",
    name: "Nguyễn Văn A",
    message: "Đơn hàng đã được tạo. Vui lòng chuyển khoản..."
  }
}
```

---

## 🎨 Các Tính Năng Chính

### **1. Authentication (Xác Thực)**

- ✅ Login (Đăng nhập)
- ✅ Register (Đăng ký)
- ✅ Logout (Đăng xuất)
- ✅ Session management (Quản lý phiên)

### **2. Shopping (Mua Sắm)**

- ✅ View products (Xem sản phẩm)
- ✅ Product details (Chi tiết sản phẩm)
- ✅ Add to cart (Thêm giỏ hàng)
- ✅ Update cart (Cập nhật giỏ hàng)
- ✅ Checkout (Thanh toán)

### **3. User Account (Tài Khoản)**

- ✅ Update profile (Cập nhật hồ sơ)
- ✅ View profile (Xem thông tin)

### **4. Internationalization (Đa Ngôn Ngữ)**

- ✅ English / Vietnamese (EN/VN)

---

## 🐛 Troubleshooting

### **Vấn Đề 1: CORS Error**

**Lỗi:** `Access to XMLHttpRequest from origin 'http://localhost:8080' has been blocked by CORS policy`

**Nguyên nhân:** Backend và Frontend chạy trên port khác nhau

**Giải pháp:**

```bash
# Đảm bảo backend chạy trước
cd backend
npm run dev

# Chạy frontend sau
cd frontend
npm run serve
```

---

### **Vấn Đề 2: "Cannot GET /api/products"**

**Nguyên nhân:** Backend chưa được khởi động

**Giải pháp:**

1. Mở Terminal mới
2. `cd backend && npm run dev`
3. Kiểm tra console log: "Server Node.js đang chạy tại: http://localhost:3000"

---

### **Vấn Đề 3: "Not authenticated" khi API call**

**Nguyên nhân:** sessionId không được gửi đúng

**Kiểm tra:**

1. F12 → Network → chọn API request
2. Headers → tìm `x-session-id: [value]`
3. F12 → Application → Local Storage → kiểm tra `sessionId` có tồn tại

**Giải pháp:** Login lại

---

### **Vấn Đề 4: Port 3000 / 8080 đã được sử dụng**

**Giải pháp (Windows - PowerShell):**

```powershell
# Tìm process đang sử dụng port 3000
netstat -ano | findstr :3000

# Giết process
taskkill /PID [PID_NUMBER] /F
```

---

## 📋 Các Bước Phát Triển Tiếp Theo

### **Phase 1: Security (Bảo Mật) 🔐**

- [ ] Replace simple session với JWT tokens
- [ ] Hash passwords (bcrypt)
- [ ] Input validation & sanitization
- [ ] Rate limiting

### **Phase 2: Database (Cơ Sở Dữ Liệu) 💾**

- [ ] Replace in-memory storage với MongoDB hoặc PostgreSQL
- [ ] Create schemas: users, products, orders, cart
- [ ] Add indexes for performance

### **Phase 3: Features (Tính Năng) ✨**

- [ ] Order history (Lịch sử đơn hàng)
- [ ] Product filters & search (Tìm kiếm sản phẩm)
- [ ] Image upload (Tải ảnh lên)
- [ ] Payment integration (Cổng thanh toán: Stripe, VNPay)

### **Phase 4: UI/UX (Giao Diện) 🎨**

- [ ] Toast notifications (Thông báo)
- [ ] Loading skeletons
- [ ] Empty states (Trạng thái trống)
- [ ] Form validation feedback

### **Phase 5: Production (Triển Khai) 🚀**

- [ ] Build frontend: `npm run build`
- [ ] Deploy on hosting (Vercel, Netlify, Heroku)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Monitor & logging (Sentry, LogRocket)

---

## 📖 Tài Liệu Thêm

### **Các File Quan Trọng**

- `.github/copilot-instructions.md` - Hướng dẫn cho AI agents
- `frontend/src/inc/api.js` - **QUAN TRỌNG** - Axios wrapper (gửi sessionId)
- `frontend/src/models/` - Nơi gọi API từ components
- `backend/index.js` - Tất cả API endpoints

### **Hữu Ích**

- [Vue 2 Documentation](https://v2.vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)
- [Vuex Store Guide](https://vuex.vuejs.org/)

---

## 🤝 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra console (F12)
2. Kiểm tra Network tab (API responses)
3. Kiểm tra Vuex store (Vue DevTools)
4. Xem troubleshooting section ở trên

---

**Happy Coding! 🎉**
