# 🚀 Hướng dẫn Push Code lên GitHub

## Bước 1: Cấu hình Git User

Chạy các lệnh sau (thay thông tin của bạn):

```bash
git config --global user.name "Nntienquang"
git config --global user.email "your-email@example.com"
```

**Hoặc chỉ cho repository này:**
```bash
git config user.name "Nntienquang"
git config user.email "your-email@example.com"
```

## Bước 2: Commit Code

```bash
# Kiểm tra files đã được staged
git status

# Commit
git commit -m "Initial commit - PartHub ready for deployment"
```

## Bước 3: Push lên GitHub

```bash
# Đảm bảo branch là main
git branch -M main

# Push code
git push -u origin main
```

## Nếu gặp lỗi authentication

Nếu GitHub yêu cầu authentication, bạn có thể:

### Cách 1: Dùng Personal Access Token

1. Vào https://github.com/settings/tokens
2. Generate new token (classic)
3. Chọn scopes: `repo`
4. Copy token
5. Khi push, dùng token thay vì password:
   ```
   Username: Nntienquang
   Password: [paste token here]
   ```

### Cách 2: Dùng GitHub CLI

```bash
# Install GitHub CLI
# Sau đó:
gh auth login
git push -u origin main
```

### Cách 3: Dùng SSH (Khuyến nghị)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Thêm vào GitHub: Settings → SSH and GPG keys → New SSH key

# Đổi remote URL sang SSH
git remote set-url origin git@github.com:Nntienquang/PartHub.git

# Push
git push -u origin main
```

## Sau khi push thành công

Code của bạn sẽ có trên GitHub tại:
**https://github.com/Nntienquang/PartHub**

## Tiếp theo: Deploy lên Vercel

Sau khi code đã trên GitHub, bạn có thể deploy lên Vercel:
1. Vào https://vercel.com
2. Import project từ GitHub
3. Chọn repository `PartHub`
4. Thêm Environment Variables
5. Deploy!

Xem file `DEPLOY_NHANH.md` để có hướng dẫn chi tiết.

