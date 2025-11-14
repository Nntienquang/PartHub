# PartHub - Việc làm Nghệ An - Project Structure

## 📁 Cấu trúc thư mục

```
PartHub/
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── tsconfig.json
│
├── public/
│   └── logo.png (placeholder - user will upload actual logo)
│
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx (Root layout với Navbar & Footer)
    │   ├── page.tsx (Home page)
    │   │
    │   ├── (admin)/              # Route group cho Admin
    │   │   └── admin/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── users/
    │   │       │   ├── page.tsx
    │   │       │   └── [id]/page.tsx
    │   │       ├── companies/page.tsx
    │   │       ├── jobs/page.tsx
    │   │       ├── applications/page.tsx
    │   │       ├── revenue/page.tsx
    │   │       ├── reports/page.tsx
    │   │       └── settings/page.tsx
    │   │
    │   ├── (employer)/           # Route group cho Employer
    │   │   └── employer/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── jobs/
    │   │       │   ├── page.tsx
    │   │       │   ├── create/page.tsx
    │   │       │   └── [id]/edit/page.tsx
    │   │       ├── applicants/page.tsx
    │   │       ├── company/page.tsx
    │   │       └── revenue/page.tsx
    │   │
    │   ├── auth/                 # Auth UI (chỉ UI, chưa có logic)
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   │
    │   ├── jobs/                 # Public: Danh sách việc làm
    │   │   ├── page.tsx
    │   │   └── [id]/page.tsx
    │   │
    │   ├── companies/            # Public: Danh sách công ty
    │   │   ├── page.tsx
    │   │   └── [id]/page.tsx
    │   │
    │   ├── blog/                 # Public: Blog
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   │
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── terms/page.tsx
    │   └── privacy/page.tsx
    │
    └── components/
        ├── ui/
        │   └── Button.tsx
        │
        ├── layout/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   └── PageHeader.tsx
        │
        ├── employer/
        │   └── EmployerSidebar.tsx
        │
        └── admin/
            └── AdminSidebar.tsx
```

## 🎨 Brand Colors

- Primary: `#004A99` (brand.primary)
- Secondary: `#F4A700` (brand.secondary)

## 📄 Routes Summary

### Public/User Area
- `/` - Home
- `/jobs` - Danh sách việc làm
- `/jobs/[id]` - Chi tiết việc làm
- `/companies` - Danh sách công ty
- `/companies/[id]` - Chi tiết công ty
- `/blog` - Danh sách bài viết
- `/blog/[slug]` - Chi tiết bài viết
- `/about` - Giới thiệu
- `/contact` - Liên hệ
- `/terms` - Điều khoản
- `/privacy` - Chính sách bảo mật

### Auth UI (chỉ UI)
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký

### Employer Dashboard
- `/employer` - Tổng quan
- `/employer/jobs` - Tin tuyển dụng
- `/employer/jobs/create` - Tạo tin mới
- `/employer/jobs/[id]/edit` - Chỉnh sửa tin
- `/employer/applicants` - Ứng viên
- `/employer/company` - Thông tin công ty
- `/employer/revenue` - Doanh thu

### Admin Dashboard
- `/admin` - Tổng quan
- `/admin/users` - Quản lý người dùng
- `/admin/users/[id]` - Chi tiết người dùng
- `/admin/companies` - Quản lý công ty
- `/admin/jobs` - Quản lý tin tuyển dụng
- `/admin/applications` - Quản lý ứng tuyển
- `/admin/revenue` - Quản lý doanh thu
- `/admin/reports` - Báo cáo
- `/admin/settings` - Cài đặt hệ thống

## ✅ Checklist

- ✅ Next.js 14 App Router với TypeScript
- ✅ Thư mục src/
- ✅ Tailwind CSS với brand colors
- ✅ Root layout với Navbar & Footer
- ✅ Tất cả public pages
- ✅ Auth UI pages (chỉ UI)
- ✅ Employer dashboard với layout
- ✅ Admin dashboard với layout
- ✅ Shared components (Button, PageHeader, Navbar, Footer)
- ✅ Không có lỗi TypeScript
- ✅ Không có lỗi linter
- ✅ Cấu trúc thư mục chuẩn

## 🚀 Next Steps

1. Upload logo thật vào `/public/logo.png`
2. Cài đặt dependencies: `npm install`
3. Chạy dev server: `npm run dev`
4. Build để test: `npm run build`

## 📝 Notes

- Tất cả pages là Server Components
- Chưa có database, auth logic, hoặc business logic
- Chỉ có UI, layout, routing, và cấu trúc thư mục
- Sẵn sàng cho PROMPT 2 (thêm database & auth)

