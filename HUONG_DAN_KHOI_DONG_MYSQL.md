# Hướng dẫn khởi động MySQL cho PartHub

## Phát hiện: Bạn đang sử dụng XAMPP

## Cách 1: Khởi động qua XAMPP Control Panel (Khuyến nghị)

1. Mở **XAMPP Control Panel**
2. Tìm **MySQL** trong danh sách
3. Click nút **Start** bên cạnh MySQL
4. Đợi đến khi status chuyển sang **Running** (màu xanh)

## Cách 2: Khởi động qua Command Line

### Windows PowerShell (Run as Administrator):

```powershell
# Khởi động MySQL service
& "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone --console
```

Hoặc nếu đã cài đặt như Windows Service:

```powershell
net start mysql
```

## Kiểm tra MySQL đã chạy chưa

Sau khi khởi động, kiểm tra port 3306:

```powershell
netstat -ano | findstr :3306
```

Nếu thấy output, MySQL đã chạy thành công.

## Kiểm tra DATABASE_URL

Đảm bảo file `.env.local` có cấu hình đúng:

```env
DATABASE_URL="mysql://root:@localhost:3306/parthub"
```

**Lưu ý:**
- Nếu MySQL có password, thay `root:` thành `root:yourpassword`
- Nếu database `parthub` chưa tồn tại, tạo database:

```sql
CREATE DATABASE parthub;
```

## Tạo Database (nếu chưa có)

1. Mở XAMPP Control Panel
2. Click **Admin** bên cạnh MySQL (mở phpMyAdmin)
3. Tạo database mới tên `parthub`
4. Hoặc chạy lệnh:

```bash
mysql -u root -p -e "CREATE DATABASE parthub;"
```

## Chạy Prisma Migrations

Sau khi MySQL đã chạy và database đã tạo:

```bash
npx prisma migrate dev
```

Hoặc nếu đã có migrations:

```bash
npx prisma migrate deploy
```

## Restart Dev Server

Sau khi MySQL đã chạy:

```bash
npm run dev
```

## Troubleshooting

### Lỗi "Port 3306 already in use"
- Có thể có MySQL instance khác đang chạy
- Kiểm tra và dừng process cũ:

```powershell
# Tìm process đang dùng port 3306
netstat -ano | findstr :3306

# Kill process (thay PID bằng số process ID)
taskkill /PID <PID> /F
```

### Lỗi "Access denied"
- Kiểm tra username/password trong `DATABASE_URL`
- Mặc định XAMPP MySQL không có password (root user)

### Lỗi "Unknown database 'parthub'"
- Tạo database `parthub` như hướng dẫn ở trên


