# 🔐 HƯỚNG DẪN TẠO TÀI KHOẢN ADMIN

Có **3 cách** để tạo tài khoản admin:

---

## ✅ CÁCH 1: Dùng Script (Khuyến nghị - Dễ nhất)

### Bước 1: Cài đặt tsx (nếu chưa có)
```bash
npm install -D tsx
```

### Bước 2: Chạy script tạo admin
```bash
npm run seed:admin
```

### Bước 3: Đăng nhập
- **Email:** `admin@parthub.com`
- **Password:** `admin123`
- Vào: `http://localhost:3000/auth/login`

**✅ Xong!** Bạn đã có tài khoản admin.

---

## ✅ CÁCH 2: Dùng Prisma Studio (Trực quan)

### Bước 1: Mở Prisma Studio
```bash
npm run db:studio
```

### Bước 2: Tìm User đã có
1. Trình duyệt tự động mở: `http://localhost:5555`
2. Click vào model **User**
3. Tìm user bạn muốn set làm admin (ví dụ: `test@user.com`)

### Bước 3: Sửa role thành ADMIN
1. Click vào user đó
2. Tìm field **role**
3. Đổi từ `USER` thành `ADMIN`
4. Click **Save 1 change**

### Bước 4: Đăng nhập
- Dùng email và password của user đó
- Vào: `http://localhost:3000/auth/login`

**✅ Xong!** User đó giờ là admin.

---

## ✅ CÁCH 3: Tạo User mới với role ADMIN (Qua Prisma Studio)

### Bước 1: Mở Prisma Studio
```bash
npm run db:studio
```

### Bước 2: Tạo User mới
1. Click vào model **User**
2. Click nút **Add record**
3. Điền thông tin:
   - **name:** `Admin User`
   - **email:** `admin@test.com`
   - **password:** Cần hash trước (phức tạp) → Nên dùng Cách 1 hoặc Cách 2

**⚠️ Lưu ý:** Password cần được hash bằng bcrypt, nên cách này không khuyến nghị.

---

## 🎯 CÁCH NHANH NHẤT

**Chạy lệnh này:**
```bash
npm install -D tsx && npm run seed:admin
```

Sau đó đăng nhập với:
- **Email:** `admin@parthub.com`
- **Password:** `admin123`

---

## 📝 THÔNG TIN TÀI KHOẢN ADMIN MẶC ĐỊNH

Sau khi chạy script `seed:admin`:

- **Email:** `admin@parthub.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

**⚠️ Lưu ý bảo mật:** Đổi password ngay sau khi đăng nhập lần đầu!

---

## 🔍 KIỂM TRA ADMIN ĐÃ TẠO

### Cách 1: Dùng Prisma Studio
```bash
npm run db:studio
```
→ Vào model **User** → Tìm email `admin@parthub.com` → Kiểm tra role = `ADMIN`

### Cách 2: Đăng nhập thử
1. Vào: `http://localhost:3000/auth/login`
2. Đăng nhập với email/password admin
3. Nếu redirect về `/admin` → ✅ Thành công!

---

## 🚨 NẾU GẶP LỖI

### Lỗi: "Cannot find module 'tsx'"
**Giải pháp:**
```bash
npm install -D tsx
```

### Lỗi: "Email already exists"
**Giải pháp:** Script sẽ tự động update role thành ADMIN nếu user đã tồn tại.

### Lỗi: "Cannot find module '@/lib/hash'"
**Giải pháp:** Đảm bảo file `src/lib/hash.ts` tồn tại.

---

## 📌 TÓM TẮT

**Cách nhanh nhất:**
```bash
npm install -D tsx
npm run seed:admin
```

**Đăng nhập:**
- Email: `admin@parthub.com`
- Password: `admin123`

**✅ Xong!**

