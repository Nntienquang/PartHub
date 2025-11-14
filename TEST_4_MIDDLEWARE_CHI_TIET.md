# 🧪 TEST 4: MIDDLEWARE PROTECTION - HƯỚNG DẪN CHI TIẾT

## 🎯 MỤC ĐÍCH

Kiểm tra xem middleware có bảo vệ đúng các routes theo role không:
- User không được vào `/admin` và `/employer`
- Employer không được vào `/admin` nhưng được vào `/employer`
- Admin được vào cả `/admin` và `/employer`

---

## ✅ TEST 4.1: User không vào được /admin

### BƯỚC 1: Đăng nhập với User
1. Vào: `http://localhost:3000/auth/login`
2. Đăng nhập với:
   - Email: `test@user.com` (hoặc email User bạn đã tạo)
   - Mật khẩu: `123456`
3. **Kết quả:** Redirect về `/` (trang chủ)
4. **Kiểm tra Navbar:** Thấy tên user + "Ứng viên"

### BƯỚC 2: Thử vào /admin
1. Trong thanh địa chỉ trình duyệt, gõ: `http://localhost:3000/admin`
2. Nhấn Enter

**✅ KẾT QUẢ MONG ĐỢI:**
- Tự động redirect về `/` (trang chủ)
- **KHÔNG** vào được trang admin
- **KHÔNG** thấy sidebar admin
- URL chuyển thành: `http://localhost:3000`

**❌ NẾU VÀO ĐƯỢC:** Middleware chưa hoạt động đúng → Báo cho tôi

---

## ✅ TEST 4.2: User không vào được /employer

### BƯỚC 1: Vẫn đăng nhập với User
(Đang đăng nhập với User từ test 4.1)

### BƯỚC 2: Thử vào /employer
1. Trong thanh địa chỉ, gõ: `http://localhost:3000/employer`
2. Nhấn Enter

**✅ KẾT QUẢ MONG ĐỢI:**
- Tự động redirect về `/` (trang chủ)
- **KHÔNG** vào được employer dashboard
- **KHÔNG** thấy sidebar employer
- URL chuyển thành: `http://localhost:3000`

**❌ NẾU VÀO ĐƯỢC:** Middleware chưa hoạt động đúng → Báo cho tôi

---

## ✅ TEST 4.3: Employer vào được /employer

### BƯỚC 1: Đăng xuất User (nếu đang đăng nhập)
1. Click nút **"Đăng xuất"** trên Navbar
2. **Kết quả:** Quay về trang chủ, Navbar hiển thị lại nút "Đăng nhập"

### BƯỚC 2: Đăng nhập với Employer
1. Vào: `http://localhost:3000/auth/login`
2. Đăng nhập với:
   - Email: `test@employer.com` (hoặc email Employer bạn đã tạo)
   - Mật khẩu: `123456`
3. **Kết quả:** Redirect về `/employer` (employer dashboard)
4. **Kiểm tra:** Thấy sidebar bên trái với menu Employer

### BƯỚC 3: Kiểm tra vào /employer
1. Đảm bảo bạn đang ở: `http://localhost:3000/employer`
2. **Kiểm tra:**
   - ✅ Thấy sidebar bên trái
   - ✅ Thấy menu: Tổng quan, Tin tuyển dụng, Ứng viên, Công ty, Doanh thu
   - ✅ Thấy nội dung dashboard

**✅ KẾT QUẢ MONG ĐỢI:**
- **VÀO ĐƯỢC** employer dashboard
- Thấy đầy đủ giao diện employer

---

## ✅ TEST 4.4: Employer không vào được /admin

### BƯỚC 1: Vẫn đăng nhập với Employer
(Đang đăng nhập với Employer từ test 4.3)

### BƯỚC 2: Thử vào /admin
1. Trong thanh địa chỉ, gõ: `http://localhost:3000/admin`
2. Nhấn Enter

**✅ KẾT QUẢ MONG ĐỢI:**
- Tự động redirect về `/` (trang chủ)
- **KHÔNG** vào được admin dashboard
- **KHÔNG** thấy sidebar admin
- URL chuyển thành: `http://localhost:3000`

**❌ NẾU VÀO ĐƯỢC:** Middleware chưa hoạt động đúng → Báo cho tôi

---

## ✅ TEST 4.5: Admin vào được cả /admin và /employer (Tùy chọn)

### BƯỚC 1: Tạo Admin Account

**Cách 1: Dùng Prisma Studio (Dễ nhất)**
1. Mở terminal mới (giữ dev server đang chạy)
2. Chạy:
   ```bash
   npm run db:studio
   ```
3. Trình duyệt tự động mở: `http://localhost:5555`
4. Tìm model **User** hoặc **Employer**
5. Tìm user/employer đã tạo (ví dụ: `test@user.com`)
6. Click vào record đó
7. Sửa field **role** từ `USER` hoặc `EMPLOYER` thành `ADMIN`
8. Click nút **Save** (hoặc Save 1 change)

**Cách 2: Tạo User mới với role ADMIN**
1. Vào Prisma Studio
2. Model **User** → Click **Add record**
3. Điền:
   - name: `Admin User`
   - email: `admin@test.com`
   - password: `$2b$10$...` (cần hash trước - phức tạp)
   - role: `ADMIN`
4. Save

**Cách 3: Dùng SQL (Nếu có quyền)**
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'test@user.com';
```

### BƯỚC 2: Đăng nhập với Admin
1. Đăng xuất (nếu đang đăng nhập)
2. Vào: `http://localhost:3000/auth/login`
3. Đăng nhập với email đã set role = ADMIN
4. **Kết quả:** Redirect về `/admin`

### BƯỚC 3: Kiểm tra /admin
1. Đảm bảo đang ở: `http://localhost:3000/admin`
2. **Kiểm tra:**
   - ✅ Thấy sidebar admin bên trái
   - ✅ Thấy menu: Tổng quan, Người dùng, Công ty, Tin tuyển dụng, etc.
   - ✅ Thấy nội dung admin dashboard

### BƯỚC 4: Kiểm tra /employer (Admin có quyền)
1. Trong thanh địa chỉ, gõ: `http://localhost:3000/employer`
2. Nhấn Enter

**✅ KẾT QUẢ MONG ĐỢI:**
- **VÀO ĐƯỢC** employer dashboard
- Admin có quyền vào cả employer area

---

## 📋 CHECKLIST TỔNG HỢP

Sau khi test xong, đánh dấu:

- [ ] **Test 4.1:** User không vào được `/admin` → Redirect về `/`
- [ ] **Test 4.2:** User không vào được `/employer` → Redirect về `/`
- [ ] **Test 4.3:** Employer vào được `/employer` → ✅ Vào được
- [ ] **Test 4.4:** Employer không vào được `/admin` → Redirect về `/`
- [ ] **Test 4.5:** (Tùy chọn) Admin vào được cả `/admin` và `/employer`

---

## 🚨 NẾU CÓ VẤN ĐỀ

### Vấn đề 1: User vẫn vào được /admin hoặc /employer
**Nguyên nhân:** Middleware không chạy
**Giải pháp:** 
- Kiểm tra file `middleware.ts` có trong root không
- Restart dev server
- Kiểm tra `matcher` trong middleware config

### Vấn đề 2: Redirect không hoạt động
**Nguyên nhân:** Session không có role
**Giải pháp:**
- Kiểm tra NextAuth callbacks
- Kiểm tra session có role không

### Vấn đề 3: Employer không vào được /employer
**Nguyên nhân:** Role không đúng
**Giải pháp:**
- Kiểm tra role trong database
- Kiểm tra session có role đúng không

---

## ✅ SAU KHI TEST XONG

Nếu tất cả đều ✅ → **Bạn đã sẵn sàng cho PROMPT 4!** 🎉

---

**Chúc bạn test thành công! 🚀**

