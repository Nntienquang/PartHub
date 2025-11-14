# 🗑️ HƯỚNG DẪN TEST DELETE JOB (Bước 2.5)

## ❌ Vấn đề:
Bạn đang dùng `{jobId}` như một placeholder trong URL, cần thay bằng **ID thật** của job.

---

## ✅ CÁCH ĐÚNG:

### Bước 1: Lấy ID của job đã tạo

**Cách 1: Từ response khi tạo job**
```javascript
// Khi tạo job thành công, response có:
{
  "success": true,
  "data": {
    "id": "cmhyrceka0001x6bpokoz6vaw",  // ← Đây là ID cần dùng
    "title": "...",
    ...
  }
}
```

**Cách 2: Lấy từ danh sách jobs**
```javascript
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    const jobId = data.data[0].id; // Lấy ID job đầu tiên
    console.log('Job ID:', jobId);
  });
```

---

### Bước 2: Test DELETE với ID thật

**Đảm bảo đăng nhập với EMPLOYER** (chủ job), sau đó:

```javascript
// Thay {jobId} bằng ID thật
const jobId = "cmhyrceka0001x6bpokoz6vaw"; // ID từ bước 1

fetch(`http://localhost:3000/api/jobs/${jobId}`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 🎯 Script hoàn chỉnh để test:

```javascript
// 1. Lấy danh sách jobs
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      const jobId = data.data[0].id;
      console.log('📋 Job ID:', jobId);
      
      // 2. Xóa job
      return fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } else {
      console.log('❌ Không có job nào để xóa');
    }
  })
  .then(res => res ? res.json() : null)
  .then(data => {
    if (data) {
      console.log('✅ Kết quả:', data);
    }
  })
  .catch(err => console.error('❌ Lỗi:', err));
```

---

## ✅ Kết quả mong đợi:

```json
{
  "success": true,
  "message": "Đã xóa việc làm thành công"
}
```

---

## 🚨 Lưu ý:

1. **Phải đăng nhập với EMPLOYER** (chủ job)
2. **Dùng ID thật**, không dùng `{jobId}` như placeholder
3. **Kiểm tra lại:** Sau khi xóa, GET `/api/jobs` sẽ không còn job đó nữa

---

## 🔍 Test lại sau khi xóa:

```javascript
// Kiểm tra job đã bị xóa chưa
fetch('http://localhost:3000/api/jobs')
  .then(res => res.json())
  .then(data => {
    console.log('Số lượng jobs còn lại:', data.data.length);
  });
```

---

**Bây giờ hãy thử lại với ID thật! 🚀**

