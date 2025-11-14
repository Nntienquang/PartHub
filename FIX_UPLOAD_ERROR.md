# Hướng dẫn khắc phục lỗi Upload Avatar/Logo/CV

## Vấn đề
Lỗi "Lỗi khi upload ảnh. Vui lòng thử lại." khi upload avatar trên trang profile.

## Các bước khắc phục

### 1. Kiểm tra Environment Variables

Đảm bảo file `.env.local` có đầy đủ các biến sau:

```env
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
NEXTAUTH_SECRET="0DUAL6ZJfqFWR+R2T2OGU6owteC7zvyyfyQncspxh6g="
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Restart Dev Server

Sau khi cập nhật `.env.local`, **BẮT BUỘC** phải restart dev server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

### 3. Kiểm tra UploadThing Dashboard

1. Vào https://uploadthing.com/dashboard
2. Chọn app của bạn
3. Vào **Settings** → **Allowed Domains**
4. Đảm bảo có domain: `localhost:3000`

### 4. Kiểm tra Console Logs

Mở Browser Console (F12) và Terminal để xem lỗi chi tiết:

- **Browser Console**: Xem lỗi từ client-side
- **Terminal**: Xem lỗi từ server-side

### 5. Kiểm tra Session

Đảm bảo bạn đã đăng nhập trước khi upload. UploadThing cần session để xác định userId.

### 6. Test lại

1. Đăng nhập với tài khoản USER
2. Vào `/profile`
3. Click "Tải lên ảnh đại diện"
4. Chọn file ảnh (PNG, JPG, JPEG, max 4MB)
5. Xem console log để debug

## Các lỗi thường gặp

### Lỗi "Invalid API Key"
- Kiểm tra lại `UPLOADTHING_SECRET` và `UPLOADTHING_APP_ID`
- Đảm bảo không có khoảng trắng thừa
- Restart dev server

### Lỗi "Domain not allowed"
- Thêm `localhost:3000` vào UploadThing Dashboard → Settings → Allowed Domains

### Lỗi "Unauthorized"
- Đảm bảo đã đăng nhập
- Kiểm tra session trong NextAuth

### File không upload được
- Kiểm tra file size (avatar/logo: max 4MB, CV: max 10MB)
- Kiểm tra file type (avatar/logo: PNG, JPG, JPEG; CV: PDF)

## Đã cập nhật

✅ Đã cập nhật `src/app/api/uploadthing/core.ts` với middleware để lấy session từ NextAuth
✅ Đã cập nhật `src/components/upload/AvatarUploader.tsx` với error handling tốt hơn

## Bước tiếp theo

1. **Restart dev server** (quan trọng!)
2. Test upload lại
3. Nếu vẫn lỗi, kiểm tra console logs và báo lại lỗi cụ thể

