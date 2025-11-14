# 🚀 Hướng dẫn Deploy PartHub lên Vercel - Chi tiết từng bước

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn deploy PartHub lên Vercel để ai cũng có thể truy cập được.

---

## BƯỚC 1: Chuẩn bị Code

### 1.1. Kiểm tra .gitignore

Đảm bảo file `.gitignore` có các dòng sau (đã có sẵn):

```
.env.local
.env*.local
node_modules
.next
.vercel
```

### 1.2. Commit code lên Git

```bash
# Kiểm tra trạng thái
git status

# Thêm tất cả files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Kiểm tra xem đã có remote chưa
git remote -v
```

---

## BƯỚC 2: Push lên GitHub

### 2.1. Tạo Repository trên GitHub

1. Vào https://github.com/new
2. Tạo repository mới:
   - **Repository name**: `parthub` (hoặc tên bạn muốn)
   - **Visibility**: Public hoặc Private
   - **KHÔNG** check "Initialize with README"
3. Click "Create repository"

### 2.2. Push code lên GitHub

```bash
# Nếu chưa có remote
git remote add origin https://github.com/YOUR_USERNAME/parthub.git

# Push code
git branch -M main
git push -u origin main
```

**Lưu ý**: Thay `YOUR_USERNAME` bằng username GitHub của bạn.

---

## BƯỚC 3: Chuẩn bị Environment Variables

### 3.1. Lấy các giá trị cần thiết

Bạn cần chuẩn bị các giá trị sau từ file `.env.local`:

1. **DATABASE_URL**: Connection string từ Railway MySQL
   ```
   mysql://root:password@host:port/database
   ```

2. **NEXTAUTH_SECRET**: Generate mới hoặc lấy từ `.env.local`
   ```
   your-nextauth-secret-here
   ```

3. **UPLOADTHING_SECRET**: Lấy từ UploadThing Dashboard
   ```
   sk_live_your-uploadthing-secret
   ```

4. **UPLOADTHING_APP_ID**: Lấy từ UploadThing Dashboard
   ```
   your-uploadthing-app-id
   ```

5. **UPLOADTHING_TOKEN**: Dùng giá trị của UPLOADTHING_SECRET
   ```
   sk_live_your-uploadthing-secret
   ```

6. **OPENAI_API_KEY** (Optional - cho chatbot):
   ```
   sk-your-openai-api-key
   ```

### 3.2. Generate NEXTAUTH_SECRET mới (nếu cần)

```bash
# Trên Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))

# Hoặc dùng online tool
# https://generate-secret.vercel.app/32
```

---

## BƯỚC 4: Deploy trên Vercel

### 4.1. Tạo tài khoản Vercel

1. Truy cập https://vercel.com
2. Click "Sign Up"
3. Chọn "Continue with GitHub"
4. Authorize Vercel

### 4.2. Import Project

1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Chọn repository `parthub` của bạn
5. Click **"Import"**

### 4.3. Cấu hình Project

1. **Framework Preset**: Next.js (tự động detect)
2. **Root Directory**: `./` (để trống)
3. **Build Command**: `npm run build` (mặc định)
4. **Output Directory**: `.next` (mặc định)
5. **Install Command**: `npm install` (mặc định)

### 4.4. Thêm Environment Variables

Trong phần **"Environment Variables"**, thêm từng biến:

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `mysql://root:password@host:port/database`
   - Environment: Production, Preview, Development

2. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-app-name.vercel.app` (sẽ cập nhật sau khi deploy)
   - Environment: Production, Preview, Development

3. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: `0DUAL6ZJfqFWR+R2T2OGU6owteC7zvyyfyQncspxh6g=`
   - Environment: Production, Preview, Development

4. **UPLOADTHING_SECRET**
   - Key: `UPLOADTHING_SECRET`
   - Value: `sk_live_your-uploadthing-secret`
   - Environment: Production, Preview, Development

5. **UPLOADTHING_APP_ID**
   - Key: `UPLOADTHING_APP_ID`
   - Value: `your-uploadthing-app-id`
   - Environment: Production, Preview, Development

6. **UPLOADTHING_TOKEN**
   - Key: `UPLOADTHING_TOKEN`
   - Value: `sk_live_your-uploadthing-secret`
   - Environment: Production, Preview, Development

7. **OPENAI_API_KEY** (Optional)
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-openai-api-key`
   - Environment: Production, Preview, Development

### 4.5. Deploy

1. Click **"Deploy"**
2. Chờ build hoàn tất (2-5 phút)
3. Lấy URL: `https://your-app-name.vercel.app`

---

## BƯỚC 5: Cập nhật NEXTAUTH_URL

### 5.1. Lấy URL thực tế

Sau khi deploy xong, bạn sẽ có URL dạng:
```
https://parthub-abc123.vercel.app
```

### 5.2. Cập nhật Environment Variable

1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Tìm `NEXTAUTH_URL`
3. Click "Edit"
4. Cập nhật value với URL thực tế
5. Click "Save"
6. **Redeploy** project (Settings → Deployments → ... → Redeploy)

---

## BƯỚC 6: Chạy Prisma Migrations

### 6.1. Cách 1: Qua Vercel CLI (Khuyến nghị)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Chạy migrations
npx prisma migrate deploy
```

### 6.2. Cách 2: Qua Build Command

1. Vào Vercel Dashboard → Project → Settings → General
2. Tìm "Build & Development Settings"
3. Cập nhật **Build Command**:
   ```
   npm run db:generate && npm run build
   ```
4. Redeploy

### 6.3. Cách 3: Qua Railway MySQL (Nếu dùng Railway)

Nếu database đã có schema, có thể skip bước này.

---

## BƯỚC 7: Cấu hình UploadThing Domain

1. Vào https://uploadthing.com/dashboard
2. Chọn app của bạn
3. Vào **Settings** → **Allowed Domains**
4. Thêm domain Vercel:
   - `your-app-name.vercel.app`
   - `*.vercel.app` (cho preview deployments)

---

## BƯỚC 8: Tạo Admin Account

### 8.1. Cách 1: Qua Prisma Studio (Local)

```bash
# Chạy Prisma Studio local
npx prisma studio

# Kết nối với production database
# Tạo user mới với role = ADMIN
```

### 8.2. Cách 2: Qua Seed Script (Local)

```bash
# Chạy seed script local (kết nối với production DB)
npm run seed:admin
```

**Lưu ý**: Đảm bảo `DATABASE_URL` trong `.env.local` trỏ đến production database.

---

## BƯỚC 9: Kiểm tra

### 9.1. Test các tính năng

1. ✅ **Homepage**: `https://your-app.vercel.app`
2. ✅ **Jobs List**: `https://your-app.vercel.app/jobs`
3. ✅ **Register/Login**: `https://your-app.vercel.app/auth/register`
4. ✅ **Profile**: `https://your-app.vercel.app/profile`
5. ✅ **Employer Dashboard**: `https://your-app.vercel.app/employer`
6. ✅ **Admin Dashboard**: `https://your-app.vercel.app/admin`
7. ✅ **Upload**: Test upload avatar/logo/CV
8. ✅ **Chatbot**: Test chatbot (nếu có OPENAI_API_KEY)

### 9.2. Kiểm tra Logs

1. Vào Vercel Dashboard → Project → Deployments
2. Click vào deployment mới nhất
3. Xem **Logs** để kiểm tra lỗi

---

## BƯỚC 10: Custom Domain (Optional)

### 10.1. Thêm Custom Domain

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Nhập domain của bạn (ví dụ: `parthub.com`)
4. Follow instructions để cấu hình DNS

---

## Troubleshooting

### ❌ Lỗi Build Failed

**Nguyên nhân**: 
- Thiếu dependencies
- TypeScript errors
- Environment variables chưa được set

**Giải pháp**:
1. Kiểm tra logs trong Vercel Dashboard
2. Test build local: `npm run build`
3. Fix errors và push lại

### ❌ Lỗi Database Connection

**Nguyên nhân**:
- `DATABASE_URL` sai
- Database không cho phép connection từ Vercel IPs

**Giải pháp**:
1. Kiểm tra `DATABASE_URL` format
2. Railway MySQL: Đảm bảo database đang chạy
3. Kiểm tra firewall settings

### ❌ Lỗi NextAuth

**Nguyên nhân**:
- `NEXTAUTH_URL` sai
- `NEXTAUTH_SECRET` chưa được set

**Giải pháp**:
1. Cập nhật `NEXTAUTH_URL` với URL thực tế
2. Đảm bảo `NEXTAUTH_SECRET` đã được set
3. Redeploy

### ❌ Lỗi UploadThing

**Nguyên nhân**:
- Domain chưa được thêm vào UploadThing
- API keys sai

**Giải pháp**:
1. Thêm domain vào UploadThing Dashboard
2. Kiểm tra `UPLOADTHING_SECRET` và `UPLOADTHING_APP_ID`

---

## ✅ Checklist trước khi deploy

- [ ] Code đã được push lên GitHub
- [ ] `.env.local` không được commit
- [ ] Database đang chạy và accessible
- [ ] Đã chuẩn bị tất cả environment variables
- [ ] UploadThing domain đã được cấu hình
- [ ] Test build local thành công: `npm run build`

---

## 🎉 Hoàn thành!

Sau khi deploy thành công, website của bạn sẽ accessible tại:
```
https://your-app-name.vercel.app
```

**Chúc mừng! PartHub đã live! 🚀**

