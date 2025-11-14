# 🧪 CHI TIẾT CÁC BƯỚC TEST CÒN LẠI

## ✅ ĐÃ HOÀN THÀNH:
- [x] Jobs API (GET, POST, PUT, DELETE)
- [x] Applications API (POST, GET, PUT)
- [x] User Profile (GET, PUT)
- [x] Employer Profile (GET, PUT)
- [x] Areas API (GET)

---

## 📋 CÁC BƯỚC TEST CÒN LẠI:

---

## ✅ TEST 6: REVENUE API

### 6.1. Tạo Revenue Record (EMPLOYER)

**Mục đích:** Tạo bản ghi doanh thu khi employer mua gói premium

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. Mở Browser Console (F12)
3. Chạy lệnh:

```javascript
fetch('http://localhost:3000/api/revenue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    amount: 100000,
    description: "Mua gói Premium BASIC"
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✅ Tạo revenue thành công:', data);
    console.log('📋 Revenue ID:', data.data.id);
  } else {
    console.error('❌ Lỗi:', data.error);
  }
})
.catch(err => console.error('❌ Lỗi:', err));
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
    "createdAt": "...",
    "employer": { ... }
  },
  "message": "Tạo bản ghi doanh thu thành công"
}
```

**✅ PASS nếu:**
- Status code: 201
- `amount` = 100000
- `employerId` = ID của employer đang đăng nhập

**❌ FAIL nếu:**
- `amount` <= 0 → 400 Bad Request
- Không đăng nhập → 403 Forbidden
- USER cố tạo → 403 Forbidden

---

### 6.2. Xem Revenue (EMPLOYER)

**Mục đích:** Employer xem danh sách revenue của mình

**Cách test:**
1. **Đăng nhập với EMPLOYER**
2. Chạy lệnh:

```javascript
fetch('http://localhost:3000/api/revenue')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('📋 Revenue của bạn:', data);
      console.log('📊 Tổng số revenue:', data.data.length);
      if (data.data.length > 0) {
        console.log('💰 Tổng tiền:', data.data.reduce((sum, r) => sum + r.amount, 0));
      }
    } else {
      console.error('❌ Lỗi:', data.error);
    }
  });
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "amount": 100000,
      "description": "Mua gói Premium BASIC",
      "createdAt": "...",
      "employer": {
        "id": "...",
        "companyName": "...",
        "email": "..."
      }
    }
  ]
}
```

**✅ PASS nếu:**
- Chỉ thấy revenues của employer đang đăng nhập
- Status code: 200

---

### 6.3. Xem Revenue (ADMIN) - Nếu có tài khoản ADMIN

**Mục đích:** ADMIN xem tất cả revenues của tất cả employers

**Cách test:**
1. **Đăng nhập với ADMIN**
2. Chạy lệnh:

```javascript
fetch('http://localhost:3000/api/revenue')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('📋 Tất cả revenues:', data);
      console.log('📊 Tổng số revenue:', data.data.length);
      console.log('💰 Tổng tiền:', data.data.reduce((sum, r) => sum + r.amount, 0));
    } else {
      console.error('❌ Lỗi:', data.error);
    }
  });
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "amount": 100000,
      "description": "...",
      "employer": { ... }
    },
    // ... revenues của tất cả employers
  ]
}
```

**✅ PASS nếu:**
- Thấy revenues của TẤT CẢ employers
- Status code: 200

---

## ✅ TEST 7: VALIDATION & ERROR HANDLING

### 7.1. Test Validation - Tạo Job thiếu fields

**Cách test:**
```javascript
// Thiếu title
fetch('http://localhost:3000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    description: "Mô tả",
    salary: "25k/h",
    location: "TP Vinh"
  })
})
.then(res => res.json())
.then(data => {
  console.log('Kết quả:', data);
  // Mong đợi: { error: "Vui lòng điền đầy đủ thông tin..." }
});
```

**✅ PASS nếu:** Trả về error 400 với message rõ ràng

---

### 7.2. Test Authorization - USER cố tạo Job

**Cách test:**
1. **Đăng nhập với USER**
2. Chạy:

```javascript
fetch('http://localhost:3000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: "Test Job",
    description: "Test",
    salary: "25k/h",
    location: "TP Vinh"
  })
})
.then(res => res.json())
.then(data => {
  console.log('Kết quả:', data);
  // Mong đợi: { error: "Bạn không có quyền tạo việc làm" }
});
```

**✅ PASS nếu:** Trả về error 403 Forbidden

---

### 7.3. Test Duplicate Application

**Cách test:**
1. **Đăng nhập với USER**
2. Apply job lần 1 (thành công)
3. Apply lại job đó lần 2:

```javascript
const jobId = "PASTE_JOB_ID_HERE";

fetch('http://localhost:3000/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ jobId })
})
.then(res => res.json())
.then(data => {
  console.log('Kết quả:', data);
  // Mong đợi: { error: "Bạn đã ứng tuyển việc làm này rồi" }
});
```

**✅ PASS nếu:** Trả về error 400 với message "Bạn đã ứng tuyển việc làm này rồi"

---

## ✅ TEST 8: FILTERS & QUERIES

### 8.1. Filter Jobs by jobType

**Cách test:**
```javascript
fetch('http://localhost:3000/api/jobs?jobType=PART_TIME')
  .then(res => res.json())
  .then(data => {
    console.log('Jobs PART_TIME:', data);
    // Kiểm tra tất cả jobs đều có jobType = PART_TIME
    const allPartTime = data.data.every(job => job.jobType === 'PART_TIME');
    console.log('Tất cả đều PART_TIME?', allPartTime);
  });
```

**✅ PASS nếu:** Tất cả jobs trả về đều có `jobType = PART_TIME`

---

### 8.2. Filter Jobs by keyword

**Cách test:**
```javascript
fetch('http://localhost:3000/api/jobs?keyword=phục vụ')
  .then(res => res.json())
  .then(data => {
    console.log('Jobs có từ "phục vụ":', data);
    // Kiểm tra title hoặc description chứa "phục vụ"
  });
```

**✅ PASS nếu:** Jobs trả về có title/description chứa keyword

---

### 8.3. Filter Applications by status

**Cách test:**
```javascript
// Xem applications PENDING
fetch('http://localhost:3000/api/applications?status=PENDING')
  .then(res => res.json())
  .then(data => {
    console.log('Applications PENDING:', data);
    const allPending = data.data.every(app => app.status === 'PENDING');
    console.log('Tất cả đều PENDING?', allPending);
  });

// Xem applications APPROVED
fetch('http://localhost:3000/api/applications?status=APPROVED')
  .then(res => res.json())
  .then(data => {
    console.log('Applications APPROVED:', data);
  });
```

**✅ PASS nếu:** Applications trả về đúng status filter

---

## ✅ TEST 9: EDGE CASES

### 9.1. Update Job với invalid areaId

**Cách test:**
```javascript
const jobId = "PASTE_JOB_ID_HERE";

fetch(`http://localhost:3000/api/jobs/${jobId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    areaId: "invalid-area-id-123"
  })
})
.then(res => res.json())
.then(data => {
  console.log('Kết quả:', data);
  // Mong đợi: { error: "Khu vực không tồn tại" }
});
```

**✅ PASS nếu:** Trả về error 400

---

### 9.2. Apply Job đã bị đóng (isActive = false)

**Cách test:**
1. Tạo job
2. Update job: `isActive: false`
3. Apply job đó:

```javascript
fetch('http://localhost:3000/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ jobId: "PASTE_JOB_ID_HERE" })
})
.then(res => res.json())
.then(data => {
  console.log('Kết quả:', data);
  // Mong đợi: { error: "Việc làm này đã bị đóng" }
});
```

**✅ PASS nếu:** Trả về error 400

---

## 📊 TỔNG KẾT CHECKLIST

### Core APIs:
- [x] GET /api/jobs
- [x] POST /api/jobs
- [x] GET /api/jobs/[id]
- [x] PUT /api/jobs/[id]
- [x] DELETE /api/jobs/[id]
- [x] POST /api/applications
- [x] GET /api/applications
- [x] PUT /api/applications/[id]
- [x] GET /api/user
- [x] PUT /api/user
- [x] GET /api/employer
- [x] PUT /api/employer
- [x] GET /api/areas

### Revenue APIs:
- [ ] POST /api/revenue (Tạo revenue)
- [ ] GET /api/revenue (EMPLOYER xem)
- [ ] GET /api/revenue (ADMIN xem - nếu có)

### Validation & Security:
- [ ] Test validation errors
- [ ] Test authorization errors
- [ ] Test duplicate application

### Filters & Queries:
- [ ] Filter jobs by jobType
- [ ] Filter jobs by keyword
- [ ] Filter applications by status

### Edge Cases:
- [ ] Invalid areaId
- [ ] Apply inactive job

---

## 🎯 TEST QUAN TRỌNG NHẤT CÒN LẠI:

1. **POST /api/revenue** - Tạo revenue record
2. **GET /api/revenue** - Xem revenue (EMPLOYER)
3. **GET /api/revenue** - Xem revenue (ADMIN) - nếu có

---

**Sau khi test xong tất cả, bạn đã hoàn thành PROMPT 4! 🎉**

