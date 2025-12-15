# ⚡ QUICK START GUIDE - Bắt Đầu Nhanh

**Đọc tài liệu này nếu bạn muốn chạy dự án ngay lập tức!**

---

## 🚀 Chạy Dự Án (3 Bước)

### **Bước 1: Backend (Port 3000)**

Mở **PowerShell/Terminal 1:**

```powershell
cd backend
npm install    # Cài dependencies (chỉ lần đầu)
npm run dev    # Chạy server
```

**Kết quả mong đợi:**

```
Server Node.js đang chạy tại: http://localhost:3000
```

---

### **Bước 2: Frontend (Port 8080)**

Mở **PowerShell/Terminal 2:**

```powershell
cd frontend
npm install    # Cài dependencies (chỉ lần đầu)
npm run serve  # Chạy frontend
```

**Kết quả mong đợi:**

```
App running at: http://localhost:8080/
```

---

### **Bước 3: Truy Cập**

Mở trình duyệt: **http://localhost:8080**

---

## 🔓 Đăng Nhập Ngay

```
Username: admin
Password: admin123
```

Bấm **Login** → Trang Home → Thành công! ✅

---

## 📱 Thử Các Tính Năng

### **1. Xem Sản Phẩm**

- Vào **Shop** → Xem sản phẩm carousel
- Bấm sản phẩm → Xem chi tiết

### **2. Thêm Giỏ Hàng**

- Ở trang Product → Nhập số lượng → **Add to cart**
- Vào **Cart** → Xem giỏ hàng

### **3. Thanh Toán**

- Cart → **Check out** → ShippingInfo → CheckOut → **Transfer**
- Hoàn thành! ✅

### **4. Logout**

- Menu → **Logout** → Quay về Home

---

## 🐛 Lỗi Thường Gặp?

| Lỗi                               | Giải Pháp                                                |
| --------------------------------- | -------------------------------------------------------- |
| **CORS Error**                    | Đảm bảo backend chạy (port 3000)                         |
| **Cannot GET /api/products**      | Backend chưa start, bấm `npm run dev` ở terminal backend |
| **"Not authenticated"**           | Login lại                                                |
| **Port 3000/8080 already in use** | Tắt ứng dụng khác dùng port đó                           |

---

## 📚 Đọc Tiếp

- **Cách hoạt động:** `README.md`
- **Học khái niệm:** `LEARNING_GUIDE.md`
- **Kiến trúc chi tiết:** `ARCHITECTURE.md`
- **Tóm tắt công việc:** `COMPLETION_SUMMARY.md`

---

## 💡 Mẹo

**Mở DevTools để xem API calls:**

1. Bấm **F12** → **Network tab**
2. Thực hiện action (login, add to cart)
3. Xem request/response

**Xem Vuex store:**

1. Bấm **F12** → tìm **Vue** tab
2. Xem state thay đổi real-time

---

**Thế đấy! Bây giờ hãy khám phá dự án! 🎉**
