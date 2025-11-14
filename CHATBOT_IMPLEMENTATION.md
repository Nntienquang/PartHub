# ✅ AI Chatbot Widget - PROMPT 9

## Đã hoàn thành:

### 1. ✅ API Route - `/api/chatbot/route.ts`
- **Smart Intent Detection**: Phát hiện intent từ câu hỏi (jobs, areas, blog, applications)
- **Internal Data Fetching**: Fetch trực tiếp từ Prisma (jobs, areas, applications)
- **OpenAI Integration**: Gọi GPT-3.5-turbo với context từ dữ liệu nội bộ
- **System Prompt**: Được tối ưu cho PartHub, trả lời bằng tiếng Việt
- **Error Handling**: Xử lý lỗi đầy đủ

### 2. ✅ ChatWidget Component - `src/components/chat/ChatWidget.tsx`
- **Floating Bubble**: Button tròn 50px ở bottom-right, fixed position
- **Chat Window**: Panel 360-400px width, 500px height
- **Message History**: Scrollable với bot/user avatars
- **Typing Indicator**: "Đang gõ..." với animation
- **Auto-scroll**: Tự động scroll xuống tin nhắn mới
- **Enter to Send**: Hỗ trợ Enter để gửi tin nhắn
- **Modern UI**: TailwindCSS, responsive, animations

### 3. ✅ ChatWidgetWrapper - `src/components/chat/ChatWidgetWrapper.tsx`
- **Conditional Rendering**: Chỉ hiển thị trên user pages
- **Pathname Check**: Ẩn trên `/admin/*` và `/employer/*`

### 4. ✅ Layout Integration - `src/app/layout.tsx`
- **Added ChatWidgetWrapper**: Tích hợp vào root layout

## Tính năng:

✅ **Smart Context Detection**:
- Phát hiện khi cần dữ liệu jobs/areas/blog/applications
- Fetch dữ liệu từ database
- Gửi context cho LLM

✅ **UI/UX**:
- Floating bubble với notification badge
- Smooth animations
- Responsive design
- Loading states
- Error handling

✅ **Security**:
- Chỉ hiển thị trên user pages
- Session-based applications fetching
- API key protection

## Cấu hình cần thiết:

Thêm vào `.env.local`:
```env
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

## Cách sử dụng:

1. Chatbot bubble xuất hiện ở bottom-right trên user pages
2. Click để mở chat window
3. Nhập câu hỏi và nhấn Enter hoặc click Send
4. Bot sẽ:
   - Phát hiện intent
   - Fetch dữ liệu nội bộ nếu cần
   - Trả lời với context từ website

## Test Cases:

1. ✅ "Có việc làm part-time nào ở Vinh không?"
   → Fetch jobs + areas → Trả lời với danh sách việc làm

2. ✅ "Khu vực nào có nhiều việc làm?"
   → Fetch areas → Trả lời với danh sách khu vực

3. ✅ "Hồ sơ của tôi có bao nhiêu đơn ứng tuyển?"
   → Fetch applications (nếu đã login) → Trả lời với số lượng

4. ✅ "Thời tiết hôm nay thế nào?"
   → Không fetch internal data → Trả lời từ LLM knowledge + note

## Files Created:

1. `src/app/api/chatbot/route.ts` - API route
2. `src/components/chat/ChatWidget.tsx` - Main widget component
3. `src/components/chat/ChatWidgetWrapper.tsx` - Conditional wrapper
4. `src/app/layout.tsx` - Updated with ChatWidgetWrapper

## Sẵn sàng deploy! 🚀

Chatbot đã được tích hợp hoàn chỉnh và sẵn sàng sử dụng.

