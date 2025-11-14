# 🚀 HƯỚNG DẪN TẠO JOB ĐỂ TEST

## ✅ Bước 1: Đăng nhập với tài khoản EMPLOYER

1. Mở: `http://localhost:3000/auth/login`
2. Đăng nhập với tài khoản **EMPLOYER** (đã đăng ký trước đó)
3. Sau khi đăng nhập, bạn sẽ có session cookie

---

## ✅ Bước 2: Tạo Job qua API

### Cách 1: Dùng Browser DevTools

1. Mở **Developer Tools** (F12)
2. Vào tab **Console**
3. Chạy lệnh sau:

```javascript
fetch('http://localhost:3000/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Quan trọng: gửi cookie session
  body: JSON.stringify({
    title: "Nhân viên phục vụ part-time",
    description: "Tìm nhân viên phục vụ làm ca sáng/chiều tại quán cà phê. Yêu cầu: giao tiếp tốt, nhiệt tình.",
    salary: "25k/h",
    jobType: "PART_TIME",
    location: "TP Vinh, Nghệ An",
    shift: "FLEXIBLE",
    isPremium: false,
    premiumType: "NONE"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

### Cách 2: Dùng Postman/Insomnia

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/jobs`
3. **Headers:**
   - `Content-Type: application/json`
   - Đảm bảo có session cookie (nếu dùng Postman, enable "Send cookies")
4. **Body (JSON):**
```json
{
  "title": "Nhân viên phục vụ part-time",
  "description": "Tìm nhân viên phục vụ làm ca sáng/chiều tại quán cà phê. Yêu cầu: giao tiếp tốt, nhiệt tình.",
  "salary": "25k/h",
  "jobType": "PART_TIME",
  "location": "TP Vinh, Nghệ An",
  "shift": "FLEXIBLE",
  "isPremium": false,
  "premiumType": "NONE"
}
```

---

### Cách 3: Tạo nhiều Jobs mẫu

Chạy script này trong Browser Console (sau khi đã đăng nhập với EMPLOYER):

```javascript
const jobs = [
  {
    title: "Nhân viên phục vụ part-time",
    description: "Tìm nhân viên phục vụ làm ca sáng/chiều tại quán cà phê.",
    salary: "25k/h",
    jobType: "PART_TIME",
    location: "TP Vinh, Nghệ An",
    shift: "FLEXIBLE"
  },
  {
    title: "Nhân viên bán hàng part-time",
    description: "Tìm nhân viên bán hàng làm ca tối tại cửa hàng thời trang.",
    salary: "30k/h",
    jobType: "PART_TIME",
    location: "Cửa Lò, Nghệ An",
    shift: "EVENING"
  },
  {
    title: "Nhân viên giao hàng part-time",
    description: "Tìm shipper giao hàng part-time, linh hoạt giờ làm việc.",
    salary: "150k/ca",
    jobType: "PART_TIME",
    location: "Diễn Châu, Nghệ An",
    shift: "FLEXIBLE"
  }
];

async function createJobs() {
  for (const job of jobs) {
    try {
      const res = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...job,
          isPremium: false,
          premiumType: "NONE"
        })
      });
      const data = await res.json();
      console.log('✅ Created:', data.data?.title || data.error);
    } catch (err) {
      console.error('❌ Error:', err);
    }
  }
}

createJobs();
```

---

## ✅ Bước 3: Kiểm tra lại

Sau khi tạo job, refresh lại:
```
GET http://localhost:3000/api/jobs
```

Bây giờ bạn sẽ thấy:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Nhân viên phục vụ part-time",
      ...
    }
  ]
}
```

---

## 🎯 Lưu ý

1. **Phải đăng nhập với EMPLOYER** trước khi tạo job
2. **Session cookie** phải được gửi kèm request
3. Nếu gặp lỗi 403 Forbidden → Kiểm tra lại đã đăng nhập chưa
4. Nếu gặp lỗi 400 Bad Request → Kiểm tra lại các fields bắt buộc (title, description, salary, location)

---

**Sau khi tạo job thành công, bạn có thể tiếp tục test các API khác! 🚀**

