# Hướng dẫn Deploy PartHub lên Vercel

## Bước 1: Chuẩn bị môi trường

### 1.1. Tạo tài khoản UploadThing
1. Truy cập https://uploadthing.com
2. Đăng ký tài khoản
3. Tạo app mới
4. Copy `UPLOADTHING_SECRET` và `UPLOADTHING_APP_ID`

### 1.2. Chuẩn bị Database
- Sử dụng MySQL từ Vercel Postgres hoặc PlanetScale
- Hoặc sử dụng MySQL server riêng

## Bước 2: Cấu hình Environment Variables trên Vercel

Thêm các biến môi trường sau trong Vercel Dashboard:

```
DATABASE_URL=mysql://user:password@host:port/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here (generate bằng: openssl rand -base64 32)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

## Bước 3: Deploy từ GitHub

1. Push code lên GitHub repository
2. Vào Vercel Dashboard → Import Project
3. Chọn repository
4. Cấu hình:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Thêm Environment Variables
6. Deploy

## Bước 4: Chạy Prisma Migrations

Sau khi deploy, chạy migrations:

```bash
npx prisma migrate deploy
```

Hoặc trong Vercel, thêm Build Command:
```bash
npm run db:generate && npm run build
```

## Bước 5: Tạo Admin Account

Sau khi deploy, SSH vào server hoặc chạy script seed:

```bash
npm run seed:admin
```

Hoặc tạo admin qua Prisma Studio:
```bash
npx prisma studio
```

## Bước 6: Kiểm tra

1. ✅ Homepage load được
2. ✅ Auth (login/register) hoạt động
3. ✅ Jobs list hiển thị
4. ✅ Apply job thành công
5. ✅ Employer dashboard hoạt động
6. ✅ Admin dashboard hoạt động
7. ✅ Upload avatar/logo/CV hoạt động
8. ✅ Sitemap: `/sitemap.xml`
9. ✅ Robots: `/robots.txt`

## Lưu ý quan trọng

- Đảm bảo `NEXTAUTH_URL` đúng với domain production
- `NEXTAUTH_SECRET` phải là chuỗi ngẫu nhiên mạnh
- Database phải accessible từ Vercel
- UploadThing cần được cấu hình đúng domain

## Troubleshooting

### Lỗi Database Connection
- Kiểm tra `DATABASE_URL` format
- Đảm bảo database cho phép connection từ Vercel IPs

### Lỗi UploadThing
- Kiểm tra `UPLOADTHING_SECRET` và `UPLOADTHING_APP_ID`
- Kiểm tra domain trong UploadThing dashboard

### Lỗi NextAuth
- Kiểm tra `NEXTAUTH_URL` và `NEXTAUTH_SECRET`
- Clear cookies và thử lại

