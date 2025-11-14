# 🧪 TEST PROMPT 5 - USER-FACING UI

## 📋 CHUẨN BỊ

1. **Đảm bảo server đang chạy:**
   ```bash
   npm run dev
   ```

2. **Cần có:**
   - 1 tài khoản USER (đã đăng ký)
   - 1 tài khoản EMPLOYER (đã đăng ký)
   - Ít nhất 1 job đã được tạo (từ EMPLOYER)

3. **Mở browser:** `http://localhost:3000`

---

## ✅ TEST 1: HOMEPAGE (/)

### 1.1. Hero Section

**Mục đích:** Kiểm tra hero section với search form

**Cách test:**
1. Mở `http://localhost:3000`
2. Kiểm tra:
   - [ ] Title hiển thị: "Việc làm Part-time tại Nghệ An cho sinh viên & người đi làm thêm"
   - [ ] Subtitle mô tả các loại việc làm
   - [ ] Search form có 3 fields: keyword, khu vực, ca làm
   - [ ] Nút "Tìm việc ngay" hoạt động

**✅ PASS nếu:**
- Hero section hiển thị đầy đủ
- Search form có thể nhập liệu
- Click "Tìm việc ngay" → redirect đến `/jobs` với query params

---

### 1.2. Featured Jobs Section

**Mục đích:** Kiểm tra danh sách việc làm nổi bật

**Cách test:**
1. Scroll xuống section "Việc làm part-time nổi bật"
2. Kiểm tra:
   - [ ] Hiển thị tối đa 6 jobs
   - [ ] Mỗi job card có: title, company, salary, area, shift
   - [ ] Premium badge hiển thị nếu `isPremium = true`
   - [ ] Click vào job card → redirect đến `/jobs/[id]`

**✅ PASS nếu:**
- Jobs được fetch từ API `/api/jobs?jobType=PART_TIME`
- Job cards hiển thị đầy đủ thông tin
- Click vào card → vào trang chi tiết job

**❌ FAIL nếu:**
- Không có jobs nào hiển thị (có thể chưa có data)
- Click không hoạt động

---

### 1.3. Areas Section

**Mục đích:** Kiểm tra section khu vực

**Cách test:**
1. Scroll xuống section "Việc theo khu vực Nghệ An"
2. Kiểm tra:
   - [ ] Hiển thị danh sách areas từ API `/api/areas`
   - [ ] Mỗi area card có tên và số lượng jobs (nếu có)
   - [ ] Click "Xem việc" → redirect đến `/jobs?areaId=...`

**✅ PASS nếu:**
- Areas được fetch từ API
- Click area card → filter jobs theo area

---

### 1.4. Blog Section

**Mục đích:** Kiểm tra section blog

**Cách test:**
1. Scroll xuống section "Kinh nghiệm làm thêm"
2. Kiểm tra:
   - [ ] Hiển thị 3 blog posts
   - [ ] Mỗi post có title, excerpt
   - [ ] Click vào post → redirect đến `/blog/[slug]`

**✅ PASS nếu:**
- Blog posts hiển thị
- Click vào post → vào trang chi tiết blog

---

## ✅ TEST 2: JOBS LIST PAGE (/jobs)

### 2.1. Filters Bar

**Mục đích:** Kiểm tra bộ lọc việc làm

**Cách test:**
1. Vào `http://localhost:3000/jobs`
2. Kiểm tra filters:
   - [ ] Input keyword
   - [ ] Select khu vực (từ API `/api/areas`)
   - [ ] Select ca làm (Sáng/Chiều/Tối/Linh hoạt)
   - [ ] Select mức lương
   - [ ] Nút "Áp dụng" và "Xóa bộ lọc"

**Test filters:**
- Nhập keyword "phục vụ" → Click "Áp dụng" → URL có `?keyword=phục vụ`
- Chọn khu vực → Click "Áp dụng" → URL có `?areaId=...`
- Chọn ca làm → Click "Áp dụng" → URL có `?shift=...`
- Click "Xóa bộ lọc" → URL về `/jobs` (không có params)

**✅ PASS nếu:**
- Filters hoạt động đúng
- URL params được cập nhật
- Jobs được filter theo params

---

### 2.2. Job List

**Mục đích:** Kiểm tra danh sách việc làm

**Cách test:**
1. Vào `/jobs`
2. Kiểm tra:
   - [ ] Jobs được fetch từ API với query params
   - [ ] Hiển thị số lượng jobs tìm thấy
   - [ ] Mỗi job card có đầy đủ thông tin
   - [ ] Click job card → redirect đến `/jobs/[id]`

**✅ PASS nếu:**
- Jobs hiển thị đúng
- Click vào job → vào trang chi tiết

---

### 2.3. Empty State

**Mục đích:** Kiểm tra trạng thái không có jobs

**Cách test:**
1. Vào `/jobs?keyword=khongtontai12345`
2. Kiểm tra:
   - [ ] Hiển thị message "Chưa có việc phù hợp, hãy thử từ khóa khác."

**✅ PASS nếu:**
- Empty state hiển thị khi không có jobs

---

## ✅ TEST 3: JOB DETAIL PAGE (/jobs/[id])

### 3.1. Job Information

**Mục đích:** Kiểm tra thông tin chi tiết job

**Cách test:**
1. Vào một job detail page (VD: `/jobs/[jobId]`)
2. Kiểm tra hiển thị:
   - [ ] Title
   - [ ] Company name (clickable → `/companies/[id]`)
   - [ ] Premium badge (nếu có)
   - [ ] Mức lương
   - [ ] Khu vực
   - [ ] Địa điểm cụ thể
   - [ ] Ca làm
   - [ ] Loại việc (Part-time)
   - [ ] Mô tả chi tiết
   - [ ] Ngày đăng

**✅ PASS nếu:**
- Tất cả thông tin hiển thị đầy đủ
- Click company name → vào trang company

---

### 3.2. Apply Button (Not Logged In)

**Mục đích:** Kiểm tra apply khi chưa đăng nhập

**Cách test:**
1. **Đăng xuất** (nếu đang đăng nhập)
2. Vào `/jobs/[id]`
3. Click "Ứng tuyển ngay"
4. Kiểm tra:
   - [ ] Redirect đến `/auth/login?callbackUrl=/jobs/[id]`

**✅ PASS nếu:**
- Redirect đến login page với callbackUrl

---

### 3.3. Apply Button (Logged In as USER)

**Mục đích:** Kiểm tra apply khi đã đăng nhập (USER)

**Cách test:**
1. **Đăng nhập với USER**
2. Vào `/jobs/[id]` (job chưa apply)
3. Click "Ứng tuyển ngay"
4. Kiểm tra:
   - [ ] Hiển thị message "Ứng tuyển thành công!"
   - [ ] Button disabled hoặc text thay đổi

**Test apply lại:**
1. Click "Ứng tuyển ngay" lần 2
2. Kiểm tra:
   - [ ] Hiển thị error "Bạn đã ứng tuyển việc làm này rồi"

**✅ PASS nếu:**
- Apply thành công lần đầu
- Apply lại → hiển thị error

---

### 3.4. Apply Button (Logged In as EMPLOYER)

**Mục đích:** Kiểm tra apply khi đăng nhập với EMPLOYER

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. Vào `/jobs/[id]`
3. Click "Ứng tuyển ngay"
4. Kiểm tra:
   - [ ] Hiển thị message "Chỉ tài khoản tìm việc mới có thể ứng tuyển."

**✅ PASS nếu:**
- EMPLOYER không thể apply

---

## ✅ TEST 4: PROFILE PAGE (/profile)

### 4.1. Access Control

**Mục đích:** Kiểm tra quyền truy cập

**Cách test:**
1. **Chưa đăng nhập** → Vào `/profile`
   - [ ] Redirect đến `/auth/login?callbackUrl=/profile`

2. **Đăng nhập với EMPLOYER** → Vào `/profile`
   - [ ] Redirect về `/`

3. **Đăng nhập với USER** → Vào `/profile`
   - [ ] Vào được trang profile

**✅ PASS nếu:**
- Chỉ USER mới vào được

---

### 4.2. Display User Info

**Mục đích:** Kiểm tra hiển thị thông tin user

**Cách test:**
1. **Đăng nhập với USER**
2. Vào `/profile`
3. Kiểm tra hiển thị:
   - [ ] Avatar (nếu có)
   - [ ] Name
   - [ ] Email (readonly)
   - [ ] Phone
   - [ ] CV URL (nếu có)

**✅ PASS nếu:**
- Thông tin user hiển thị đầy đủ

---

### 4.3. Update Profile

**Mục đích:** Kiểm tra cập nhật profile

**Cách test:**
1. **Đăng nhập với USER**
2. Vào `/profile`
3. Cập nhật:
   - Name: "Nguyễn Văn A (Updated)"
   - Phone: "0123456789"
   - Avatar URL: "https://example.com/avatar.jpg"
   - CV URL: "https://example.com/cv.pdf"
4. Click "Lưu thay đổi"
5. Kiểm tra:
   - [ ] Hiển thị message "Cập nhật thông tin thành công!"
   - [ ] Thông tin được cập nhật

**Test validation:**
- Xóa name → Click "Lưu" → Hiển thị error "Tên không được để trống"

**✅ PASS nếu:**
- Update thành công
- Validation hoạt động

---

## ✅ TEST 5: APPLICATIONS PAGE (/applications)

### 5.1. Access Control

**Mục đích:** Kiểm tra quyền truy cập

**Cách test:**
1. **Chưa đăng nhập** → Vào `/applications`
   - [ ] Redirect đến `/auth/login?callbackUrl=/applications`

2. **Đăng nhập với EMPLOYER** → Vào `/applications`
   - [ ] Redirect về `/`

3. **Đăng nhập với USER** → Vào `/applications`
   - [ ] Vào được trang applications

**✅ PASS nếu:**
- Chỉ USER mới vào được

---

### 5.2. Display Applications

**Mục đích:** Kiểm tra hiển thị danh sách applications

**Cách test:**
1. **Đăng nhập với USER**
2. Vào `/applications`
3. Kiểm tra:
   - [ ] Table hiển thị: Job title, Company, Ngày ứng tuyển, Status
   - [ ] Status badges có màu:
     - PENDING: vàng/xám
     - APPROVED: xanh lá
     - REJECTED: đỏ
   - [ ] Click job title → redirect đến `/jobs/[id]`

**✅ PASS nếu:**
- Applications được fetch từ API
- Hiển thị đầy đủ thông tin
- Status badges có màu đúng

---

### 5.3. Empty State

**Mục đích:** Kiểm tra trạng thái không có applications

**Cách test:**
1. **Đăng nhập với USER mới** (chưa apply job nào)
2. Vào `/applications`
3. Kiểm tra:
   - [ ] Hiển thị message "Bạn chưa có đơn ứng tuyển nào."
   - [ ] Có link "Tìm việc ngay" → `/jobs`

**✅ PASS nếu:**
- Empty state hiển thị đúng

---

## ✅ TEST 6: COMPANIES PAGES

### 6.1. Companies List (/companies)

**Mục đích:** Kiểm tra danh sách công ty

**Cách test:**
1. Vào `/companies`
2. Kiểm tra:
   - [ ] Hiển thị danh sách companies (placeholder data)
   - [ ] Mỗi company card có: name, location, số việc làm
   - [ ] Click company card → redirect đến `/companies/[id]`

**✅ PASS nếu:**
- Companies list hiển thị
- Click vào company → vào trang chi tiết

---

### 6.2. Company Detail (/companies/[id])

**Mục đích:** Kiểm tra chi tiết công ty

**Cách test:**
1. Vào `/companies/1`
2. Kiểm tra:
   - [ ] Company name
   - [ ] Location
   - [ ] Description
   - [ ] Danh sách jobs của company (nếu có)
   - [ ] Click job → redirect đến `/jobs/[id]`

**✅ PASS nếu:**
- Company detail hiển thị đầy đủ
- Jobs của company hiển thị (nếu có)

---

## ✅ TEST 7: BLOG PAGES

### 7.1. Blog List (/blog)

**Mục đích:** Kiểm tra danh sách blog posts

**Cách test:**
1. Vào `/blog`
2. Kiểm tra:
   - [ ] Hiển thị danh sách blog posts
   - [ ] Mỗi post có: title, excerpt, date
   - [ ] Click post → redirect đến `/blog/[slug]`

**✅ PASS nếu:**
- Blog posts hiển thị
- Click vào post → vào trang chi tiết

---

### 7.2. Blog Post Detail (/blog/[slug])

**Mục đích:** Kiểm tra chi tiết blog post

**Cách test:**
1. Vào `/blog/5-luu-y-khi-di-lam-part-time-ca-toi`
2. Kiểm tra:
   - [ ] Title
   - [ ] Date
   - [ ] Content (HTML formatted)
   - [ ] Link "Quay lại Blog" → `/blog`

**✅ PASS nếu:**
- Blog post hiển thị đầy đủ
- Content được format đúng

---

## ✅ TEST 8: NAVBAR

### 8.1. Navigation Links

**Mục đích:** Kiểm tra các links trong navbar

**Cách test:**
1. Kiểm tra các links luôn hiển thị:
   - [ ] "Việc làm" → `/jobs`
   - [ ] "Công ty" → `/companies`
   - [ ] "Blog" → `/blog`
   - [ ] "Liên hệ" → `/contact`

**✅ PASS nếu:**
- Tất cả links hoạt động

---

### 8.2. User Menu (Not Logged In)

**Mục đích:** Kiểm tra menu khi chưa đăng nhập

**Cách test:**
1. **Đăng xuất**
2. Kiểm tra navbar:
   - [ ] Hiển thị "Đăng nhập" → `/auth/login`
   - [ ] Hiển thị "Đăng ký" → `/auth/register`
   - [ ] Không hiển thị "Hồ sơ", "Đơn ứng tuyển"

**✅ PASS nếu:**
- Menu đúng với trạng thái chưa đăng nhập

---

### 8.3. User Menu (Logged In as USER)

**Mục đích:** Kiểm tra menu khi đăng nhập với USER

**Cách test:**
1. **Đăng nhập với USER**
2. Kiểm tra navbar:
   - [ ] Hiển thị tên user
   - [ ] Hiển thị "Ứng viên"
   - [ ] Hiển thị "Hồ sơ" → `/profile`
   - [ ] Hiển thị "Đơn ứng tuyển" → `/applications`
   - [ ] Hiển thị "Đăng xuất"

**✅ PASS nếu:**
- Menu đúng với role USER

---

### 8.4. User Menu (Logged In as EMPLOYER)

**Mục đích:** Kiểm tra menu khi đăng nhập với EMPLOYER

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. Kiểm tra navbar:
   - [ ] Hiển thị tên company
   - [ ] Hiển thị "Doanh nghiệp"
   - [ ] Hiển thị "Dashboard" → `/employer`
   - [ ] Không hiển thị "Hồ sơ", "Đơn ứng tuyển"
   - [ ] Hiển thị "Đăng xuất"

**✅ PASS nếu:**
- Menu đúng với role EMPLOYER

---

## ✅ TEST 9: RESPONSIVE DESIGN

### 9.1. Mobile View

**Mục đích:** Kiểm tra responsive trên mobile

**Cách test:**
1. Mở DevTools → Toggle device toolbar
2. Chọn device: iPhone 12 Pro (375x812)
3. Kiểm tra các trang:
   - [ ] Homepage: Hero section, job cards, areas
   - [ ] Jobs list: Filters, job cards
   - [ ] Job detail: Layout, apply button
   - [ ] Profile: Form fields
   - [ ] Navbar: Menu items

**✅ PASS nếu:**
- Tất cả trang hiển thị tốt trên mobile
- Không bị overflow, text không bị cắt

---

### 9.2. Tablet View

**Mục đích:** Kiểm tra responsive trên tablet

**Cách test:**
1. Chọn device: iPad (768x1024)
2. Kiểm tra layout:
   - [ ] Grid columns điều chỉnh phù hợp
   - [ ] Forms và buttons có kích thước hợp lý

**✅ PASS nếu:**
- Layout phù hợp với tablet

---

## ✅ TEST 10: INTEGRATION WITH APIs

### 10.1. Homepage API Calls

**Mục đích:** Kiểm tra API calls trên homepage

**Cách test:**
1. Mở DevTools → Network tab
2. Refresh homepage
3. Kiểm tra:
   - [ ] Call `/api/jobs?jobType=PART_TIME`
   - [ ] Call `/api/areas`
   - [ ] Responses trả về đúng format

**✅ PASS nếu:**
- APIs được gọi đúng
- Data được hiển thị

---

### 10.2. Jobs Page API Calls

**Mục đích:** Kiểm tra API calls trên jobs page

**Cách test:**
1. Vào `/jobs?keyword=phục vụ&areaId=xxx`
2. Mở Network tab
3. Kiểm tra:
   - [ ] Call `/api/jobs` với query params đúng
   - [ ] Call `/api/areas` cho filter

**✅ PASS nếu:**
- Query params được truyền đúng
- Jobs được filter đúng

---

### 10.3. Apply Job API Call

**Mục đích:** Kiểm tra API call khi apply job

**Cách test:**
1. **Đăng nhập với USER**
2. Vào `/jobs/[id]`
3. Mở Network tab
4. Click "Ứng tuyển ngay"
5. Kiểm tra:
   - [ ] POST `/api/applications` với body `{ jobId }`
   - [ ] Response success

**✅ PASS nếu:**
- API call đúng
- Apply thành công

---

## 📊 TỔNG KẾT CHECKLIST

### Core Pages:
- [ ] Homepage (/) - Hero, jobs, areas, blog
- [ ] Jobs List (/jobs) - Filters, job list
- [ ] Job Detail (/jobs/[id]) - Info, apply button
- [ ] Profile (/profile) - Display, update
- [ ] Applications (/applications) - List, status
- [ ] Companies (/companies) - List, detail
- [ ] Blog (/blog) - List, detail

### Navigation:
- [ ] Navbar links hoạt động
- [ ] Role-based menu items
- [ ] User menu (USER, EMPLOYER, ADMIN)

### Functionality:
- [ ] Search và filters
- [ ] Apply job (với auth check)
- [ ] Update profile
- [ ] View applications

### Responsive:
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view

### API Integration:
- [ ] Homepage APIs
- [ ] Jobs APIs
- [ ] Apply API
- [ ] Profile API
- [ ] Applications API

---

## 🎯 TEST QUAN TRỌNG NHẤT

1. **Homepage hiển thị jobs từ API** ✅
2. **Search và filters hoạt động** ✅
3. **Apply job với authentication** ✅
4. **Update profile thành công** ✅
5. **View applications với status badges** ✅
6. **Navbar hiển thị đúng theo role** ✅
7. **Responsive trên mobile** ✅

---

## 🚨 LƯU Ý KHI TEST

1. **Session:** Đảm bảo đăng nhập đúng role trước khi test
2. **Data:** Cần có ít nhất 1 job để test
3. **Network:** Kiểm tra Network tab để xem API calls
4. **Console:** Kiểm tra Console tab để xem errors

---

**Chúc bạn test thành công! 🎉**

