# 🧪 TEST PROMPT 4 - BACKEND CRUD APIs

## 📋 CHUẨN BỊ

1. **Đảm bảo server đang chạy:**
   ```bash
   npm run dev
   ```

2. **Cần có ít nhất:**
   - 1 tài khoản USER (đã đăng ký)
   - 1 tài khoản EMPLOYER (đã đăng ký)
   - 1 tài khoản ADMIN (có thể tạo thủ công trong DB hoặc dùng tài khoản có role ADMIN)

3. **Công cụ test:**
   - Postman, Insomnia, hoặc
   - Browser DevTools (Network tab)
   - Hoặc dùng `curl` trong terminal

---

## ✅ TEST 1: AREAS API (Public)

### GET /api/areas

**Mục đích:** Lấy danh sách tất cả khu vực

**Cách test:**
1. Mở browser hoặc Postman
2. GET request: `http://localhost:3000/api/areas`
3. Không cần đăng nhập

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "TP Vinh",
      "createdAt": "...",
      "_count": { "jobs": 0 }
    },
    ...
  ]
}
```

**✅ PASS nếu:** Trả về danh sách areas (có thể rỗng nếu chưa có data)

---

## ✅ TEST 2: JOBS API

### 2.1 GET /api/jobs (List Jobs)

**Mục đích:** Lấy danh sách việc làm với filters

**Cách test:**
1. GET: `http://localhost:3000/api/jobs`
2. Test với filters:
   - `?jobType=PART_TIME`
   - `?areaId=xxx`
   - `?keyword=phục vụ`
   - `?area=TP Vinh`

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "salary": "20k/h",
      "jobType": "PART_TIME",
      "location": "...",
      "shift": "FLEXIBLE",
      "employer": { ... },
      "area": { ... },
      "_count": { "applications": 0 }
    }
  ]
}
```

**✅ PASS nếu:** Trả về danh sách jobs (có thể rỗng)

---

### 2.2 POST /api/jobs (Create Job) - EMPLOYER ONLY

**Mục đích:** Tạo việc làm mới (chỉ EMPLOYER)

**Cách test:**
1. **Đăng nhập với tài khoản EMPLOYER** (lấy session cookie)
2. POST: `http://localhost:3000/api/jobs`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "title": "Nhân viên phục vụ part-time",
  "description": "Tìm nhân viên phục vụ làm ca sáng/chiều",
  "salary": "25k/h",
  "jobType": "PART_TIME",
  "location": "TP Vinh, Nghệ An",
  "shift": "FLEXIBLE",
  "areaId": null,
  "isPremium": false,
  "premiumType": "NONE"
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Nhân viên phục vụ part-time",
    "employerId": "...",
    ...
  }
}
```

**✅ PASS nếu:** 
- Tạo job thành công
- `employerId` = ID của employer đang đăng nhập
- Status code: 201

**❌ FAIL nếu:**
- Không đăng nhập → 403 Forbidden
- Đăng nhập với USER → 403 Forbidden
- Thiếu fields bắt buộc → 400 Bad Request

---

### 2.3 GET /api/jobs/[id] (Job Details)

**Mục đích:** Lấy chi tiết một job

**Cách test:**
1. Lấy `jobId` từ test 2.2 (hoặc từ database)
2. GET: `http://localhost:3000/api/jobs/{jobId}`
3. Không cần đăng nhập (public)

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "employer": {
      "id": "...",
      "companyName": "...",
      "logoUrl": "..."
    },
    "area": { ... },
    "_count": { "applications": 0 }
  }
}
```

**✅ PASS nếu:** Trả về đầy đủ thông tin job

---

### 2.4 PUT /api/jobs/[id] (Update Job) - OWNER or ADMIN

**Mục đích:** Cập nhật job (chỉ owner hoặc ADMIN)

**Cách test:**
1. **Đăng nhập với EMPLOYER** (chủ job)
2. PUT: `http://localhost:3000/api/jobs/{jobId}`
3. Body:
```json
{
  "title": "Nhân viên phục vụ part-time (Updated)",
  "salary": "30k/h",
  "isActive": true
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Nhân viên phục vụ part-time (Updated)",
    "salary": "30k/h",
    ...
  }
}
```

**✅ PASS nếu:**
- Update thành công
- Status code: 200

**❌ FAIL nếu:**
- EMPLOYER khác cố update → 403 Forbidden
- USER cố update → 403 Forbidden

---

### 2.5 DELETE /api/jobs/[id] - OWNER or ADMIN

**Mục đích:** Xóa job (chỉ owner hoặc ADMIN)

**Cách test:**
1. **Đăng nhập với EMPLOYER** (chủ job)
2. DELETE: `http://localhost:3000/api/jobs/{jobId}`

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Đã xóa việc làm thành công"
}
```

**✅ PASS nếu:**
- Xóa thành công
- Status code: 200

**❌ FAIL nếu:**
- EMPLOYER khác cố xóa → 403 Forbidden

---

## ✅ TEST 3: APPLICATIONS API

### 3.1 POST /api/applications (Apply Job) - USER ONLY

**Mục đích:** User apply cho một job

**Cách test:**
1. **Đăng nhập với tài khoản USER**
2. POST: `http://localhost:3000/api/applications`
3. Body:
```json
{
  "jobId": "{jobId từ test 2.2}"
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "PENDING",
    "userId": "...",
    "jobId": "...",
    "job": { ... }
  },
  "message": "Ứng tuyển thành công"
}
```

**✅ PASS nếu:**
- Tạo application thành công
- Status = PENDING
- Status code: 201

**❌ FAIL nếu:**
- Không đăng nhập → 403 Forbidden
- Đăng nhập với EMPLOYER → 403 Forbidden
- Apply lại job đã apply → 400 Bad Request
- Job không tồn tại → 404 Not Found
- Job đã đóng (isActive = false) → 400 Bad Request

---

### 3.2 GET /api/applications (List Applications)

**Mục đích:** Lấy danh sách applications

**Test 3.2.1: USER xem applications của mình**
1. **Đăng nhập với USER**
2. GET: `http://localhost:3000/api/applications`
3. Kết quả: Chỉ thấy applications của user đó

**Test 3.2.2: EMPLOYER xem applications của jobs**
1. **Đăng nhập với EMPLOYER**
2. GET: `http://localhost:3000/api/applications`
3. Kết quả: Thấy applications của tất cả jobs của employer

**Test 3.2.3: Filter by jobId**
1. GET: `http://localhost:3000/api/applications?jobId={jobId}`
2. Kết quả: Chỉ thấy applications của job đó

**Test 3.2.4: Filter by status**
1. GET: `http://localhost:3000/api/applications?status=PENDING`
2. Kết quả: Chỉ thấy applications có status PENDING

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "status": "PENDING",
      "user": { ... },  // Nếu EMPLOYER xem
      "job": { ... }     // Nếu USER xem
    }
  ]
}
```

**✅ PASS nếu:**
- USER chỉ thấy applications của mình
- EMPLOYER chỉ thấy applications của jobs của mình
- Filters hoạt động đúng

---

### 3.3 PUT /api/applications/[id] (Update Status) - EMPLOYER

**Mục đích:** Employer duyệt/từ chối ứng viên

**Cách test:**
1. **Đăng nhập với EMPLOYER** (chủ job)
2. PUT: `http://localhost:3000/api/applications/{applicationId}`
3. Body:
```json
{
  "status": "APPROVED"  // hoặc "REJECTED"
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "APPROVED",
    "user": { ... },
    "job": { ... }
  },
  "message": "Đã duyệt đơn ứng tuyển"
}
```

**✅ PASS nếu:**
- Update status thành công
- Status code: 200

**❌ FAIL nếu:**
- EMPLOYER khác cố update → 403 Forbidden
- Status không hợp lệ → 400 Bad Request

---

### 3.4 DELETE /api/applications/[id] - EMPLOYER or ADMIN

**Mục đích:** Xóa application

**Cách test:**
1. **Đăng nhập với EMPLOYER** (chủ job)
2. DELETE: `http://localhost:3000/api/applications/{applicationId}`

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Đã xóa đơn ứng tuyển thành công"
}
```

**✅ PASS nếu:** Xóa thành công

---

## ✅ TEST 4: USER API

### 4.1 GET /api/user (Get Profile) - USER ONLY

**Mục đích:** Lấy thông tin user đang đăng nhập

**Cách test:**
1. **Đăng nhập với USER**
2. GET: `http://localhost:3000/api/user`

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "phone": "...",
    "avatar": "...",
    "cvUrl": "...",
    "role": "USER",
    "_count": {
      "applications": 1,
      "savedJobs": 0
    }
  }
}
```

**✅ PASS nếu:** Trả về đầy đủ thông tin user

**❌ FAIL nếu:**
- Không đăng nhập → 403 Forbidden
- Đăng nhập với EMPLOYER → 403 Forbidden

---

### 4.2 PUT /api/user (Update Profile) - USER ONLY

**Mục đích:** Cập nhật thông tin user

**Cách test:**
1. **Đăng nhập với USER**
2. PUT: `http://localhost:3000/api/user`
3. Body:
```json
{
  "name": "Nguyễn Văn A (Updated)",
  "phone": "0123456789",
  "avatar": "https://example.com/avatar.jpg",
  "cvUrl": "https://example.com/cv.pdf"
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Nguyễn Văn A (Updated)",
    "phone": "0123456789",
    ...
  },
  "message": "Cập nhật thông tin thành công"
}
```

**✅ PASS nếu:**
- Update thành công
- Chỉ update các fields được gửi

**❌ FAIL nếu:**
- `name` rỗng → 400 Bad Request
- EMPLOYER cố update → 403 Forbidden

---

## ✅ TEST 5: EMPLOYER API

### 5.1 GET /api/employer (Get Profile) - EMPLOYER ONLY

**Mục đích:** Lấy thông tin employer đang đăng nhập

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. GET: `http://localhost:3000/api/employer`

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "companyName": "...",
    "email": "...",
    "phone": "...",
    "address": "...",
    "logoUrl": "...",
    "description": "...",
    "role": "EMPLOYER",
    "_count": {
      "jobs": 1,
      "revenues": 0
    }
  }
}
```

**✅ PASS nếu:** Trả về đầy đủ thông tin employer

---

### 5.2 PUT /api/employer (Update Profile) - EMPLOYER ONLY

**Mục đích:** Cập nhật thông tin employer

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. PUT: `http://localhost:3000/api/employer`
3. Body:
```json
{
  "companyName": "Công ty ABC (Updated)",
  "phone": "0987654321",
  "address": "123 Đường XYZ, TP Vinh",
  "logoUrl": "https://example.com/logo.png",
  "description": "Mô tả công ty..."
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "companyName": "Công ty ABC (Updated)",
    ...
  },
  "message": "Cập nhật thông tin thành công"
}
```

**✅ PASS nếu:** Update thành công

---

## ✅ TEST 6: REVENUE API

### 6.1 GET /api/revenue (List Revenue)

**Test 6.1.1: EMPLOYER xem revenue của mình**
1. **Đăng nhập với EMPLOYER**
2. GET: `http://localhost:3000/api/revenue`
3. Kết quả: Chỉ thấy revenues của employer đó

**Test 6.1.2: ADMIN xem tất cả revenues**
1. **Đăng nhập với ADMIN**
2. GET: `http://localhost:3000/api/revenue`
3. Kết quả: Thấy tất cả revenues của tất cả employers

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "amount": 100000,
      "description": "Mua gói Premium",
      "createdAt": "...",
      "employer": { ... }
    }
  ]
}
```

**✅ PASS nếu:**
- EMPLOYER chỉ thấy revenues của mình
- ADMIN thấy tất cả revenues

---

### 6.2 POST /api/revenue (Create Revenue) - EMPLOYER ONLY

**Mục đích:** Tạo bản ghi doanh thu (khi mua premium)

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. POST: `http://localhost:3000/api/revenue`
3. Body:
```json
{
  "amount": 100000,
  "description": "Mua gói Premium BASIC"
}
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "amount": 100000,
    "description": "Mua gói Premium BASIC",
    "employerId": "...",
    "employer": { ... }
  },
  "message": "Tạo bản ghi doanh thu thành công"
}
```

**✅ PASS nếu:**
- Tạo revenue thành công
- `employerId` = ID của employer đang đăng nhập
- Status code: 201

**❌ FAIL nếu:**
- `amount` <= 0 → 400 Bad Request
- `amount` không phải số → 400 Bad Request
- USER cố tạo → 403 Forbidden

---

## 📊 TỔNG KẾT TEST

### Checklist nhanh:

- [ ] **Areas API:** GET /api/areas → OK
- [ ] **Jobs API:**
  - [ ] GET /api/jobs → OK
  - [ ] POST /api/jobs (EMPLOYER) → OK
  - [ ] GET /api/jobs/[id] → OK
  - [ ] PUT /api/jobs/[id] (OWNER) → OK
  - [ ] DELETE /api/jobs/[id] (OWNER) → OK
- [ ] **Applications API:**
  - [ ] POST /api/applications (USER) → OK
  - [ ] GET /api/applications (USER) → OK
  - [ ] GET /api/applications (EMPLOYER) → OK
  - [ ] PUT /api/applications/[id] (EMPLOYER) → OK
  - [ ] DELETE /api/applications/[id] (EMPLOYER) → OK
- [ ] **User API:**
  - [ ] GET /api/user (USER) → OK
  - [ ] PUT /api/user (USER) → OK
- [ ] **Employer API:**
  - [ ] GET /api/employer (EMPLOYER) → OK
  - [ ] PUT /api/employer (EMPLOYER) → OK
- [ ] **Revenue API:**
  - [ ] GET /api/revenue (EMPLOYER) → OK
  - [ ] GET /api/revenue (ADMIN) → OK
  - [ ] POST /api/revenue (EMPLOYER) → OK

---

## 🎯 TEST QUAN TRỌNG NHẤT

1. **Tạo job part-time** (EMPLOYER) → ✅
2. **User apply job** → ✅ Status = PENDING
3. **Employer duyệt ứng viên** → ✅ Status = APPROVED
4. **User update profile** → ✅
5. **Employer update profile** → ✅
6. **Tạo revenue record** → ✅
7. **Lấy danh sách areas** → ✅

---

## 🚨 LƯU Ý KHI TEST

1. **Session/Cookie:** Đảm bảo đăng nhập đúng role trước khi test
2. **IDs:** Lưu lại các IDs (jobId, applicationId) để test các API liên quan
3. **Error Messages:** Kiểm tra error messages có rõ ràng không
4. **Status Codes:** Kiểm tra status codes đúng (200, 201, 400, 403, 404, 500)

---

**Chúc bạn test thành công! 🎉**

