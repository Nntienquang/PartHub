# Fix Lỗi Chatbot - Insufficient Quota

## Vấn đề
Chatbot hiển thị lỗi: "You exceeded your current quota, please check your plan and billing details."

## Nguyên nhân
Tài khoản OpenAI đã hết quota hoặc chưa setup billing.

## Giải pháp

### Cách 1: Nạp credits vào OpenAI (Khuyến nghị)

1. **Truy cập OpenAI Dashboard**:
   - Vào https://platform.openai.com/account/billing
   - Đăng nhập tài khoản

2. **Setup Billing**:
   - Click "Add payment method"
   - Thêm thẻ tín dụng/thanh toán
   - Set spending limit (tùy chọn)

3. **Nạp Credits**:
   - Click "Add credits" hoặc "Set up billing"
   - Chọn số tiền muốn nạp (tối thiểu $5)
   - Hoàn tất thanh toán

4. **Kiểm tra Quota**:
   - Vào https://platform.openai.com/account/usage
   - Xem usage và remaining credits

### Cách 2: Sử dụng API Key khác

Nếu có nhiều tài khoản OpenAI:
1. Tạo API key từ tài khoản khác
2. Cập nhật `OPENAI_API_KEY` trong `.env.local`
3. Restart dev server

### Cách 3: Sử dụng Model miễn phí (Tùy chọn)

Có thể thay đổi sang model khác hoặc sử dụng service miễn phí khác, nhưng GPT-3.5-turbo là tốt nhất cho chatbot.

## Chi phí ước tính

- **GPT-3.5-turbo**: ~$0.0015 per 1K tokens
- **Mỗi câu hỏi**: ~500-1000 tokens
- **1000 câu hỏi**: ~$0.75 - $1.50
- **Rất rẻ!** Nạp $5 có thể dùng hàng nghìn câu hỏi

## Sau khi nạp credits

1. **Restart dev server**:
   ```bash
   # Dừng server (Ctrl+C)
   npm run dev
   ```

2. **Test lại chatbot**:
   - Refresh trang
   - Gửi câu hỏi: "cho tôi hỏi các việc làm hiện có"
   - Chatbot sẽ hoạt động bình thường!

## Lưu ý

⚠️ **Spending Limits**: 
- Có thể set spending limit trong OpenAI dashboard để tránh chi phí quá cao
- Recommended: $10-20/month cho development

⚠️ **Free Tier**:
- OpenAI không còn free tier cho API
- Phải nạp credits để sử dụng

## Alternative Solutions (Nếu không muốn dùng OpenAI)

1. **Google Gemini API** (có free tier)
2. **Anthropic Claude API**
3. **Local LLM** (Ollama, LM Studio) - phức tạp hơn

Nhưng GPT-3.5-turbo vẫn là lựa chọn tốt nhất về giá và chất lượng.

