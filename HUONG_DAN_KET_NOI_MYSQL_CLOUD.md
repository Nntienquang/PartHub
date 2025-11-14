# Hướng dẫn kết nối MySQL Cloud cho PartHub

## Bước 1: Lấy Connection String từ Dashboard

Trong MySQL dashboard của bạn (Railway/Render/...):

1. **Click vào tab "Credentials"** (hoặc "Connect" button)
2. Bạn sẽ thấy thông tin kết nối:
   - **Host** (ví dụ: `containers-us-west-xxx.railway.app`)
   - **Port** (thường là `3306` hoặc port khác)
   - **Database** (tên database, ví dụ: `railway` hoặc `parthub`)
   - **User** (username)
   - **Password** (password)

3. **Copy connection string** hoặc tự tạo theo format:

```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

**Ví dụ:**
```
mysql://root:abc123xyz@containers-us-west-123.railway.app:3306/railway
```

## Bước 2: Cập nhật DATABASE_URL trong .env.local

Mở file `.env.local` và thay thế dòng `DATABASE_URL`:

```env
# Database - Cập nhật với connection string từ cloud
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="0DUAL6ZJfqFWR+R2T2OGU6owteC7zvyyfyQncspxh6g="

# UploadThing
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## Bước 3: Test Connection

Sau khi cập nhật, restart dev server:

```bash
npm run dev
```

## Lưu ý quan trọng

1. **Password có ký tự đặc biệt**: Nếu password có ký tự đặc biệt như `@`, `#`, `%`, cần URL encode:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`

2. **Database chưa tồn tại**: Nếu database chưa có, tạo database trước:
   ```sql
   CREATE DATABASE parthub;
   ```

3. **Chạy Prisma Migrations**: Sau khi kết nối thành công:
   ```bash
   npx prisma migrate dev
   ```

## Troubleshooting

### Lỗi "Access denied"
- Kiểm tra username/password đúng chưa
- Đảm bảo user có quyền truy cập database

### Lỗi "Unknown database"
- Tạo database trong dashboard hoặc qua SQL:
  ```sql
  CREATE DATABASE parthub;
  ```

### Lỗi "Connection timeout"
- Kiểm tra host và port đúng chưa
- Đảm bảo database cho phép connection từ IP của bạn (một số cloud service cần whitelist IP)


