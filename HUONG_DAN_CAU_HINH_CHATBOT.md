# Hướng dẫn cấu hình Chatbot AI

## Vấn đề
Chatbot hiển thị: "Xin lỗi, chatbot chưa được cấu hình API key. Vui lòng liên hệ admin."

## Giải pháp

### Bước 1: Lấy OpenAI API Key

1. Truy cập https://platform.openai.com/
2. Đăng nhập hoặc tạo tài khoản
3. Vào **API Keys** (https://platform.openai.com/api-keys)
4. Click **"Create new secret key"**
5. Copy API key (bắt đầu bằng `sk-...`)

⚠️ **Lưu ý**: API key chỉ hiển thị một lần, hãy lưu lại ngay!

### Bước 2: Thêm vào `.env.local`

Mở file `.env.local` trong thư mục gốc project và thêm:

```env
OPENAI_API_KEY="sk-your-api-key-here"
```

**Ví dụ:**
```env
# Database - Railway MySQL
DATABASE_URL="mysql://root:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# UploadThing
UPLOADTHING_SECRET="sk_live_your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
UPLOADTHING_TOKEN="sk_live_your-uploadthing-secret"

# OpenAI (Chatbot)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Bước 3: Restart Dev Server

**QUAN TRỌNG**: Sau khi thêm API key, bạn **PHẢI** restart dev server:

```bash
# Dừng server hiện tại (Ctrl+C)
npm run dev
```

### Bước 4: Test Chatbot

1. Refresh trang web
2. Click vào bubble chatbot ở bottom-right
3. Gửi câu hỏi: "cho tôi hỏi các việc làm hiện có"
4. Chatbot sẽ trả lời với dữ liệu từ website!

## Chi phí OpenAI API

- **GPT-3.5-turbo**: ~$0.0015 per 1K tokens (rất rẻ)
- Mỗi câu hỏi thường tốn ~500-1000 tokens
- Có thể dùng free credits khi đăng ký mới

## Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra lại API key có đúng không
- Đảm bảo không có khoảng trắng thừa
- Restart dev server

### Lỗi "Insufficient quota"
- Kiểm tra balance trong OpenAI dashboard
- Nạp thêm credits nếu cần

### Chatbot không trả lời
- Kiểm tra console log (F12)
- Kiểm tra terminal log của dev server
- Đảm bảo `OPENAI_API_KEY` đã được load

## Lưu ý quan trọng

⚠️ **KHÔNG commit file `.env.local` lên GitHub!**

File `.env.local` đã được thêm vào `.gitignore` để bảo mật.

⚠️ **Bảo mật API Key:**
- Không chia sẻ API key với ai
- Nếu key bị lộ, hãy regenerate ngay trong OpenAI dashboard
- Khi deploy lên Vercel, thêm `OPENAI_API_KEY` vào Environment Variables

## Deploy lên Vercel

Khi deploy, thêm `OPENAI_API_KEY` vào Vercel Dashboard:
1. Vào Project Settings → Environment Variables
2. Thêm: `OPENAI_API_KEY` = `sk-your-key-here`
3. Redeploy

