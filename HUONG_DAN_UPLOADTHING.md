# Hướng dẫn cấu hình UploadThing cho PartHub

## Bước 1: Lấy API Keys từ UploadThing Dashboard

1. Vào https://uploadthing.com/dashboard
2. Chọn app của bạn
3. Vào **API Keys**
4. Copy các giá trị:
   - **UPLOADTHING_SECRET** (Secret Key - bắt đầu bằng `sk_live_...`)
   - **UPLOADTHING_APP_ID** (App ID)

## Bước 2: Cấu hình trong Project

### 2.1. Tạo file `.env.local`

Tạo file `.env.local` trong thư mục gốc của project với nội dung:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/parthub"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# UploadThing
UPLOADTHING_SECRET="sk_live_your-secret-key-here"
UPLOADTHING_APP_ID="your-app-id-here"
```

### 2.2. Thay thế giá trị

- Thay `sk_live_your-secret-key-here` bằng **UPLOADTHING_SECRET** bạn đã copy
- Thay `your-app-id-here` bằng **UPLOADTHING_APP_ID** bạn đã copy

**Ví dụ:**
```env
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 2.3. Generate NEXTAUTH_SECRET (nếu chưa có)

Chạy lệnh sau để generate secret:

```bash
openssl rand -base64 32
```

Hoặc sử dụng online tool: https://generate-secret.vercel.app/32

## Bước 3: Cấu hình Domain trong UploadThing (cho Production)

Khi deploy lên Vercel, bạn cần:

1. Vào UploadThing Dashboard → App Settings
2. Thêm domain production vào **Allowed Domains**:
   - `your-app.vercel.app`
   - `your-custom-domain.com` (nếu có)

## Bước 4: Test Upload

1. Restart dev server:
   ```bash
   npm run dev
   ```

2. Test upload:
   - Vào `/profile` (đăng nhập với tài khoản USER) → Upload avatar
   - Vào `/employer/company` (đăng nhập với tài khoản EMPLOYER) → Upload logo
   - Vào `/profile` → Upload CV

## Troubleshooting

### Lỗi "Invalid API Key"
- Kiểm tra lại `UPLOADTHING_SECRET` và `UPLOADTHING_APP_ID` trong `.env.local`
- Đảm bảo không có khoảng trắng thừa
- Đảm bảo `UPLOADTHING_SECRET` bắt đầu bằng `sk_live_` hoặc `sk_test_`
- Restart dev server sau khi thay đổi `.env.local`

### Lỗi "Domain not allowed"
- Thêm domain vào UploadThing Dashboard → App Settings → Allowed Domains
- Cho development: `localhost:3000` (thường được allow mặc định)
- Cho production: thêm domain Vercel của bạn

### File không upload được
- Kiểm tra file size (avatar/logo: max 4MB, CV: max 10MB)
- Kiểm tra file type (avatar/logo: PNG, JPG, JPEG; CV: PDF)
- Kiểm tra console log để xem lỗi chi tiết

### Lỗi "Missing UPLOADTHING_SECRET or UPLOADTHING_APP_ID"
- Đảm bảo file `.env.local` nằm trong thư mục gốc của project
- Đảm bảo đã restart dev server sau khi thêm env variables
- Kiểm tra tên biến có đúng chính tả không

## Lưu ý quan trọng

⚠️ **KHÔNG commit file `.env.local` lên GitHub!**

File `.env.local` đã được thêm vào `.gitignore` để bảo mật.

⚠️ **Bảo mật API Keys:**
- Không chia sẻ `UPLOADTHING_SECRET` với ai
- Nếu secret bị lộ, hãy regenerate ngay trong UploadThing Dashboard

## Kiểm tra cấu hình

Sau khi cấu hình xong, bạn có thể test bằng cách:

1. Mở `/profile` (đăng nhập với tài khoản USER)
2. Click "Tải lên ảnh đại diện"
3. Chọn file ảnh (PNG, JPG, JPEG, max 4MB)
4. Nếu upload thành công, ảnh sẽ hiển thị ngay

Nếu có lỗi, kiểm tra:
- Console log trong browser (F12 → Console)
- Terminal log của dev server
- UploadThing Dashboard → Logs
