# 🎯 GITHUB STEP-BY-STEP - Hướng Dẫn Chi Tiết Từng Lệnh

Hướng dẫn này giúp bạn **sao chép đúng từng lệnh** để push code lên GitHub.

---

## 📋 Bước Chuẩn Bị

### **Cách 1: Kiểm Tra Git Đã Cài Chưa**

Mở PowerShell (Windows) hoặc Terminal (Mac/Linux):

```powershell
git --version
```

Kết quả:

```
git version 2.40.0.windows.1
```

✅ Nếu thấy version → Git đã cài
❌ Nếu không thấy → Download git từ https://git-scm.com/

---

### **Cách 2: Tạo GitHub Account (Nếu Chưa Có)**

1. Vào https://github.com/signup
2. Điền: Email, Password, Username
3. Xác nhận email
4. Done! ✅

---

## 🚀 Bước Thực Hành

### **STEP 1: Mở PowerShell / Terminal**

Windows: Bấm `Win + X` → chọn **PowerShell** (hoặc Command Prompt)

Mac/Linux: Mở Terminal

---

### **STEP 2: Vào Thư Mục Project**

**Copy-paste lệnh này vào PowerShell:**

```powershell
cd C:\Users\ADMIN\Desktop\MTP-Update
```

**Kiểm tra:**

```powershell
pwd
```

**Kết quả phải là:**

```
C:\Users\ADMIN\Desktop\MTP-Update
```

✅ Xong

---

### **STEP 3: Khởi Tạo Git**

```powershell
git init
```

**Kết quả:**

```
Initialized empty Git repository in C:\Users\ADMIN\Desktop\MTP-Update\.git/
```

✅ Xong

---

### **STEP 4: Cấu Hình Git User**

**Thay `Your Name` bằng tên thực của bạn:**

```powershell
git config user.name "Your Name"
```

**Thay email bằng email GitHub của bạn:**

```powershell
git config user.email "your.email@gmail.com"
```

**Ví dụ:**

```powershell
git config user.name "Nguyen Van A"
git config user.email "nguyenvana@gmail.com"
```

**Kiểm tra cấu hình:**

```powershell
git config --list
```

✅ Xong

---

### **STEP 5: Tạo Repository Trên GitHub**

**Trên website GitHub:**

1. Đăng nhập: https://github.com/login
2. Góc trên phải → Bấm **+** → **New repository**
3. Điền:
   ```
   Repository name: MTP-Update
   Description: E-commerce platform Vue 2 + Express
   Visibility: Public
   ```
4. Bấm **Create repository**
5. **Sao chép HTTPS URL:**
   ```
   https://github.com/YOUR-USERNAME/MTP-Update.git
   ```

✅ Xong

---

### **STEP 6: Thêm Remote Repository**

**Thay `YOUR-USERNAME` bằng username GitHub của bạn:**

```powershell
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git
```

**Ví dụ:**

```powershell
git remote add origin https://github.com/nguyenvana/MTP-Update.git
```

**Kiểm tra:**

```powershell
git remote -v
```

**Kết quả phải là:**

```
origin  https://github.com/YOUR-USERNAME/MTP-Update.git (fetch)
origin  https://github.com/YOUR-USERNAME/MTP-Update.git (push)
```

✅ Xong

---

### **STEP 7: Thêm Tất Cả Files Vào Git**

```powershell
git add .
```

**Kiểm tra files được thêm:**

```powershell
git status
```

**Kết quả:**

```
On branch master

No commits yet

Changes to be committed:
  new file:   README.md
  new file:   LEARNING_GUIDE.md
  new file:   ARCHITECTURE.md
  ...
  new file:   backend/index.js
  new file:   frontend/src/components/...
```

✅ Xong

---

### **STEP 8: Commit (Lưu) Changes**

```powershell
git commit -m "Initial commit: Complete MTP-Update e-commerce platform

- Backend: 13 API endpoints (products, auth, cart, checkout)
- Frontend: Vue 2 with authentication and shopping cart
- Documentation: Comprehensive guides and architecture
- Features: Product listing, user auth, cart, order management"
```

**Hoặc đơn giản hơn:**

```powershell
git commit -m "Initial commit: MTP-Update platform setup"
```

**Kết quả:**

```
[master (root-commit) abc1234] Initial commit: MTP-Update platform
 45 files changed, 5000+ insertions(+)
 create mode 100644 README.md
 create mode 100644 backend/index.js
 ...
```

✅ Xong

---

### **STEP 9: Push Code Lên GitHub**

```powershell
git push -u origin master
```

**Lần đầu, GitHub sẽ hỏi:**

```
Username for 'https://github.com': YOUR-USERNAME
Password for 'https://YOUR-USERNAME@github.com':
```

**Điền:**

- Username: `your-github-username`
- Password: **KHÔNG phải password** → Nhập **GitHub Token**

**Cách lấy GitHub Token:**

1. GitHub → Settings (góc trên phải)
2. Developer settings → Personal access tokens
3. Tokens (classic) → Generate new token
4. Chọn scopes: `repo`
5. Generate → **Copy token**
6. Dán token vào terminal

**Hoặc nếu dùng SSH (tổi ưu):**

```powershell
git push -u origin master
```

**Kết quả:**

```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (40/40), done.
Writing objects: 100% (45/45), 500KB, done.
Total 45 (delta 0), reused 0 (delta 0), pack-reused 0
...
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

✅ **Thành công!** 🎉

---

## ✅ Kiểm Tra Trên GitHub

1. Vào https://github.com/YOUR-USERNAME/MTP-Update
2. Bạn sẽ thấy:
   - ✅ Tất cả files & folders
   - ✅ README.md hiển thị
   - ✅ Commit history

---

## 🔄 Sau Khi Push (Lần Tiếp Theo)

Mỗi khi sửa code & muốn push lại:

```powershell
git add .
git commit -m "Fix: Update API responses"
git push
```

**Không cần `-u origin master` nữa!**

---

## 🎯 Quick Command Reference

```powershell
# Kiểm tra status
git status

# Thêm files
git add .

# Commit
git commit -m "Message"

# Push
git push

# Xem lịch sử
git log --oneline

# Xem thay đổi
git diff
```

---

## ❌ Lỗi Thường Gặp & Cách Fix

### **Lỗi 1: "fatal: not a git repository"**

**Nguyên nhân:** Không phải trong project folder

**Fix:**

```powershell
cd C:\Users\ADMIN\Desktop\MTP-Update
git init
```

---

### **Lỗi 2: "error: src refspec master does not match any"**

**Nguyên nhân:** Branch chưa có commit

**Fix:**

```powershell
git commit -m "Initial commit"
git push -u origin master
```

---

### **Lỗi 3: "fatal: remote origin already exists"**

**Nguyên nhân:** Remote đã tồn tại

**Fix:**

```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git
git push -u origin master
```

---

### **Lỗi 4: "Permission denied" hoặc authentication fails**

**Fix:**

- Sử dụng token GitHub thay vì password
- Hoặc setup SSH key
- Hoặc xóa credentials & setup lại:

```powershell
# Windows
git credential-manager uninstall

# Sau đó push lại
git push
```

---

### **Lỗi 5: node_modules quá lớn (>100MB)**

**Nguyên nhân:** .gitignore chưa bao gồm node_modules

**Fix:**

```powershell
# Xóa node_modules khỏi git
git rm -r --cached node_modules

# Kiểm tra .gitignore
# Đảm bảo có dòng: node_modules/

# Commit lại
git add .
git commit -m "Remove node_modules from tracking"
git push
```

---

## 📊 Complete Workflow (Bước Đầu Tiên)

**Dán toàn bộ vào PowerShell:**

```powershell
# 1. Vào thư mục
cd C:\Users\ADMIN\Desktop\MTP-Update

# 2. Khởi tạo git
git init

# 3. Cấu hình (thay tên & email)
git config user.name "Your Name"
git config user.email "your@email.com"

# 4. Thêm remote (thay YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/MTP-Update.git

# 5. Thêm tất cả files
git add .

# 6. Commit lần đầu
git commit -m "Initial commit: MTP-Update platform"

# 7. Push lên GitHub
git push -u origin master
```

**Sau đó làm theo hướng dẫn về GitHub Token nếu cần**

---

## ✨ Tips & Tricks

**Commit frequently:**

```powershell
# Làm xong một feature
git add .
git commit -m "Feature: Add wishlist"
git push
```

**Xem thay đổi trước khi commit:**

```powershell
git diff
```

**Hủy commit chưa push:**

```powershell
git reset HEAD~1
```

**Xem tất cả branches:**

```powershell
git branch -a
```

---

## 📚 Tài Liệu Thêm

- [GitHub Docs](https://docs.github.com)
- [Git Tutorial](https://git-scm.com/docs)
- [Atlassian Git Guide](https://www.atlassian.com/git)

---

## ✅ Hoàn Thành!

Nếu bạn:

- ✅ Theo hết các bước trên
- ✅ Code đã lên GitHub
- ✅ Thấy files trên https://github.com/YOUR-USERNAME/MTP-Update

**Thì bạn đã thành công!** 🎉

---

**Hãy chia sẻ repository URL với team hoặc bạn bè!**

```
https://github.com/YOUR-USERNAME/MTP-Update
```

---

**Cần giúp? Xem GITHUB_GUIDE.md để hiểu sâu hơn!** 📖
