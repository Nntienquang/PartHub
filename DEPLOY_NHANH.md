# 🚀 Deploy PartHub lên Vercel - Hướng dẫn nhanh

## Bước 1: Khởi tạo Git và Push lên GitHub

```bash
# 1. Khởi tạo git repository
git init

# 2. Thêm tất cả files
git add .

# 3. Commit
git commit -m "Initial commit - PartHub ready for deployment"

# 4. Tạo repository trên GitHub (vào https://github.com/new)
#    - Repository name: parthub
#    - Public hoặc Private
#    - KHÔNG check "Initialize with README"

# 5. Push lên GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/parthub.git
git branch -M main
git push -u origin main
```

## Bước 2: Deploy trên Vercel

### 2.1. Tạo tài khoản và Import Project

1. Vào https://vercel.com → Sign up với GitHub
2. Click **"Add New..."** → **"Project"**
3. Chọn repository `parthub`
4. Click **"Import"**

### 2.2. Thêm Environment Variables

Trong phần **"Environment Variables"**, thêm:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `mysql://root:password@host:port/database` | All |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (cập nhật sau) | All |
| `NEXTAUTH_SECRET` | `your-nextauth-secret-here` | All |
| `UPLOADTHING_SECRET` | `sk_live_your-uploadthing-secret` | All |
| `UPLOADTHING_APP_ID` | `your-uploadthing-app-id` | All |
| `UPLOADTHING_TOKEN` | `sk_live_your-uploadthing-secret` | All |
| `OPENAI_API_KEY` | `sk-your-key` (optional) | All |

### 2.3. Deploy

1. Click **"Deploy"**
2. Chờ build (2-5 phút)
3. Lấy URL: `https://your-app-name.vercel.app`

### 2.4. Cập nhật NEXTAUTH_URL

1. Vào Settings → Environment Variables
2. Tìm `NEXTAUTH_URL`
3. Cập nhật với URL thực tế
4. Redeploy

## Bước 3: Chạy Migrations

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

## Bước 4: Cấu hình UploadThing

1. Vào https://uploadthing.com/dashboard
2. Settings → Allowed Domains
3. Thêm: `your-app.vercel.app` và `*.vercel.app`

## Bước 5: Tạo Admin Account

```bash
# Chạy seed script (kết nối với production DB)
npm run seed:admin
```

## ✅ Xong!

Website của bạn sẽ accessible tại:
```
https://your-app-name.vercel.app
```

---

## 📝 Lưu ý quan trọng

1. **Database**: Đảm bảo Railway MySQL đang chạy
2. **Environment Variables**: Phải thêm đầy đủ trước khi deploy
3. **NEXTAUTH_URL**: Phải cập nhật sau khi có URL thực tế
4. **UploadThing**: Phải thêm domain vào allowed list

---

## 🆘 Nếu gặp lỗi

Xem file `HUONG_DAN_DEPLOY_VERCEL.md` để có hướng dẫn chi tiết và troubleshooting.

