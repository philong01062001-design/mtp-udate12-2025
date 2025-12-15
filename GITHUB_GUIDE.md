# 📤 Hướng Dẫn Đưa Code Lên GitHub

Hướng dẫn này giúp bạn push dự án MTP-Update lên GitHub từ đầu đến cuối.

---

## 📋 Mục Lục

1. [Bước 1: Tạo GitHub Account](#bước-1-tạo-github-account)
2. [Bước 2: Tạo Repository](#bước-2-tạo-repository)
3. [Bước 3: Khởi Tạo Git Local](#bước-3-khởi-tạo-git-local)
4. [Bước 4: Push Code](#bước-4-push-code)
5. [Bước 5: Verify & Share](#bước-5-verify--share)
6. [Các Lệnh Git Hữu Ích](#các-lệnh-git-hữu-ích)

---

## 🔧 Yêu Cầu

- ✅ Git đã cài (kiểm tra: `git --version`)
- ✅ GitHub account (hoặc tạo mới tại https://github.com/signup)
- ✅ Project folder: `c:\Users\ADMIN\Desktop\MTP-Update`

---

## 🚀 Bước 1: Tạo GitHub Account

### Nếu chưa có account:

1. Vào https://github.com/signup
2. Điền thông tin:
   - Email
   - Password
   - Username (ví dụ: `your-username`)
3. Verify email
4. Xong! ✅

### Nếu đã có account:

Bỏ qua, đi sang **Bước 2**

---

## 📝 Bước 2: Tạo Repository Trên GitHub

### **Online - Trên GitHub Website**

1. Đăng nhập GitHub: https://github.com/login
2. Nhấp **+** (góc trên phải) → **New repository**

   ![image](https://docs.github.com/assets/cb-25267/images/help/repository/repo-create.png)

3. Điền thông tin:

   ```
   Repository name: MTP-Update
   Description: Fan community & e-commerce platform (Vue 2 + Express)
   Public / Private: Public (để mọi người xem)

   ☑ Initialize this repository with:
     ☐ README (bỏ, vì ta có sẵn)
     ☐ .gitignore (bỏ, ta sẽ tạo)
     ☐ License (optional)
   ```

4. Bấm **Create repository**

5. **Sao chép HTTPS URL** (quan trọng!)
   ```
   https://github.com/YOUR-USERNAME/MTP-Update.git
   ```

---

## 💻 Bước 3: Khởi Tạo Git Local

### Terminal 1 - Khởi Tạo Repo

```powershell
cd C:\Users\ADMIN\Desktop\MTP-Update

# 1. Khởi tạo git
git init

# 2. Cấu hình username & email (chỉ lần đầu)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Kiểm tra cấu hình
git config --list
```

**Lưu ý:**

- Thay `"Your Name"` bằng tên thực của bạn
- Thay `"your.email@example.com"` bằng email GitHub của bạn

---

### Thêm Repository Remote

```powershell
# Thêm remote (origin = tên mặc định của GitHub)
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git

# Kiểm tra remote
git remote -v

# Kết quả:
# origin  https://github.com/YOUR-USERNAME/MTP-Update.git (fetch)
# origin  https://github.com/YOUR-USERNAME/MTP-Update.git (push)
```

**Thay `YOUR-USERNAME` bằng username GitHub của bạn**

---

## 📤 Bước 4: Push Code

### **Step 1: Stage (Chuẩn Bị) Files**

```powershell
# Thêm tất cả files vào staging area
git add .

# Kiểm tra files
git status

# Kết quả:
# On branch master
# Changes to be committed:
#   new file:   README.md
#   new file:   LEARNING_GUIDE.md
#   ...
```

---

### **Step 2: Commit (Lưu) Changes**

```powershell
# Tạo commit với message
git commit -m "Initial commit: Complete MTP-Update e-commerce platform

- Backend: Express API with 13 endpoints
- Frontend: Vue 2 with authentication, cart, checkout
- Documentation: 5 comprehensive guides
- Features: Product listing, authentication, shopping cart, orders"

# Kiểm tra log
git log --oneline
```

**Ghi chú commit tốt:**

- Dòng đầu: Tiêu đề ngắn (50 chars)
- Dòng trống
- Chi tiết: Mô tả thay đổi (tùy chọn)

---

### **Step 3: Push (Đẩy) Lên GitHub**

```powershell
# Push lần đầu (-u: set upstream)
git push -u origin master

# Hoặc nếu dùng main (tùy cấu hình GitHub)
git push -u origin main

# Kết quả:
# ...
# * [new branch]      master -> master
# Branch 'master' set up to track remote branch 'master' from 'origin'.
```

---

**⏳ Lần đầu sẽ yêu cầu nhập:**

- **GitHub username** hoặc email
- **GitHub token** (password không dùng được)

**Lấy GitHub token:**

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Chọn scopes: `repo`, `write:packages`, `delete:packages`
4. Copy token
5. Dán token vào terminal khi hỏi password

---

## ✅ Bước 5: Verify & Share

### **Kiểm Tra Trên GitHub**

1. Vào https://github.com/YOUR-USERNAME/MTP-Update
2. Xem toàn bộ files đã upload ✅
3. Xem commit history ✅

### **URL Dùng Chung**

```
Repository: https://github.com/YOUR-USERNAME/MTP-Update
Clone URL:  https://github.com/YOUR-USERNAME/MTP-Update.git
```

---

## 🔄 Các Lệnh Git Hữu Ích

### **Sau Khi Đã Push Lần Đầu**

**Thêm file mới:**

```powershell
git add .
git commit -m "Add new feature: wishlist"
git push
```

**Kiểm tra status:**

```powershell
git status
```

**Xem thay đổi:**

```powershell
git diff
```

**Xem lịch sử:**

```powershell
git log --oneline -10
```

**Tạo branch mới:**

```powershell
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## 🐛 Troubleshooting

### **Lỗi 1: "fatal: remote origin already exists"**

```powershell
# Xóa remote cũ
git remote remove origin

# Thêm lại
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git
```

---

### **Lỗi 2: "error: src refspec master does not match any"**

```powershell
# Branch chưa có commit
git commit --allow-empty -m "Initial commit"
git push -u origin master
```

---

### **Lỗi 3: "Permission denied (publickey)"**

```powershell
# Setup SSH key (hoặc dùng HTTPS token)
# Hoặc sử dụng token GitHub thay vì password
```

---

### **Lỗi 4: node_modules quá lớn**

```powershell
# node_modules không nên push lên (đã trong .gitignore)
# Nếu push rồi:
git rm -r --cached node_modules
git add .gitignore
git commit -m "Remove node_modules from tracking"
git push
```

---

## 📊 Workflow Đầy Đủ

```powershell
# 1. Khởi tạo (lần đầu)
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git

# 2. Thêm files
git add .
git commit -m "Initial commit: MTP-Update platform"

# 3. Push lên GitHub
git push -u origin master

# 4. Lần sau (sau khi sửa code)
git add .
git commit -m "Fix: Update API responses"
git push

# 5. Tiếp tục...
git add .
git commit -m "Feature: Add wishlist"
git push
```

---

## 💡 Mẹo Hay

### **Commit thường xuyên**

```powershell
# Làm xong một feature → commit
git add .
git commit -m "Feature: Add product search"
git push
```

### **Message commit rõ ràng**

```
✅ Tốt:
"Fix: Correct session validation in auth flow"

❌ Tệ:
"Fix stuff"
"update"
"aslkdj"
```

### **Ignore lớn files**

Nếu file > 100MB, GitHub sẽ reject. Thêm vào `.gitignore`.

---

## 🎯 Hoàn Thành! ✅

Bây giờ repository bạn:

- ✅ Trên GitHub (public)
- ✅ Có toàn bộ source code
- ✅ Có documentation
- ✅ Có git history

**Tiếp theo:**

- Chia sẻ URL với team
- Dùng GitHub Issues để track tasks
- Dùng Pull Requests để code review

---

## 📚 Tài Liệu Thêm

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

**Xong! Repository của bạn đã lên GitHub! 🎉**
