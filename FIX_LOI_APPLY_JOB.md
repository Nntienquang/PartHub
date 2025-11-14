# 🔧 SỬA LỖI 404 KHI APPLY JOB

## ❌ Vấn đề:
1. Bạn đang dùng `"PASTE_JOB_ID_HERE"` thay vì **ID thật** của job
2. Job có thể đã bị **xóa** ở bước DELETE trước đó

---

## ✅ GIẢI PHÁP:

### Bước 1: Tạo lại Job (nếu đã xóa)

**Đăng nhập với EMPLOYER**, sau đó chạy:

```javascript
fetch('http://localhost:3000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: "Nhân viên phục vụ part-time",
    description: "Tìm nhân viên phục vụ làm ca sáng/chiều",
    salary: "25k/h",
    jobType: "PART_TIME",
    location: "TP Vinh, Nghệ An",
    shift: "FLEXIBLE",
    isPremium: false,
    premiumType: "NONE"
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    const jobId = data.data.id;
    console.log('✅ Job ID:', jobId);
    console.log('📋 Copy ID này để apply:', jobId);
    // Lưu jobId này để dùng ở bước 2
  } else {
    console.error('❌ Lỗi:', data.error);
  }
});
```

---

### Bước 2: Lấy Job ID từ danh sách (nếu đã có job)

```javascript
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      const jobId = data.data[0].id;
      console.log('✅ Job ID:', jobId);
      console.log('📋 Copy ID này để apply:', jobId);
    } else {
      console.log('❌ Không có job nào. Hãy tạo job trước!');
    }
  });
```

---

### Bước 3: Apply Job với ID thật

**Đăng nhập với USER**, sau đó:

```javascript
// Thay "PASTE_JOB_ID_HERE" bằng ID thật từ bước 1 hoặc 2
const jobId = "cmhyrceka0001x6bpokoz6vaw"; // ← ID thật

fetch('http://localhost:3000/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ jobId })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✅ Apply thành công:', data);
  } else {
    console.error('❌ Lỗi:', data.error);
  }
})
.catch(err => console.error('❌ Lỗi:', err));
```

---

## 🎯 Script hoàn chỉnh (tự động lấy ID và apply):

```javascript
// 1. Lấy danh sách jobs
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      const jobId = data.data[0].id;
      console.log('📋 Job ID:', jobId);
      
      // 2. Apply job
      return fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobId })
      });
    } else {
      console.log('❌ Không có job nào. Hãy tạo job trước!');
      console.log('💡 Chạy script tạo job với EMPLOYER trước');
    }
  })
  .then(res => res ? res.json() : null)
  .then(data => {
    if (data) {
      if (data.success) {
        console.log('✅ Apply thành công:', data);
      } else {
        console.error('❌ Lỗi:', data.error);
      }
    }
  })
  .catch(err => console.error('❌ Lỗi:', err));
```

---

## ✅ Kết quả mong đợi:

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

---

## 🚨 Lưu ý:

1. **Phải đăng nhập với USER** trước khi apply
2. **Dùng ID thật**, không dùng `"PASTE_JOB_ID_HERE"`
3. **Job phải tồn tại** (chưa bị xóa)
4. **Job phải active** (`isActive: true`)
5. **Chưa apply job đó trước đó** (nếu apply lại sẽ báo lỗi)

---

## 🔍 Kiểm tra:

```javascript
// Kiểm tra job có tồn tại không
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    console.log('Số lượng jobs:', data.data.length);
    if (data.data.length > 0) {
      console.log('Job đầu tiên:', data.data[0].id);
    }
  });
```

---

**Bây giờ hãy:**
1. **Tạo lại job** (nếu đã xóa)
2. **Lấy ID thật** của job
3. **Apply với ID thật** (đăng nhập với USER)

🚀

