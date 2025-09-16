# Hướng dẫn cấu hình Google OAuth cho Supabase

## 1. Cấu hình Google Cloud Console

### Bước 1: Tạo OAuth 2.0 Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn hoặc tạo project mới
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Đặt tên cho OAuth client
7. Thêm **Authorized redirect URIs**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy **Client ID** và **Client Secret**

### Bước 2: Enable Google+ API (nếu cần)

1. Vào **APIs & Services** > **Library**
2. Tìm "Google+ API" hoặc "People API"
3. Click **Enable**

## 2. Cấu hình Supabase

### Bước 1: Thêm Google Provider

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Authentication** > **Providers**
4. Tìm **Google** và click **Enable**
5. Nhập **Client ID** và **Client Secret** từ Google Cloud Console
6. Click **Save**

### Bước 2: Cấu hình Redirect URLs

1. Vào **Authentication** > **URL Configuration**
2. Thêm các URL sau vào **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

## 3. Cấu hình Environment Variables

Cập nhật file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. Test Authentication

1. Khởi động development server: `npm run dev`
2. Truy cập `/signin`
3. Click "Đăng nhập với Google"
4. Hoàn thành quá trình xác thực
5. Kiểm tra redirect về `/dashboard`

## 5. Troubleshooting

### Lỗi thường gặp:

1. **"redirect_uri_mismatch"**
   - Kiểm tra Authorized redirect URIs trong Google Cloud Console
   - Đảm bảo URL chính xác: `https://your-project-id.supabase.co/auth/v1/callback`

2. **"Access blocked"**
   - Kiểm tra OAuth consent screen đã được cấu hình
   - Thêm email test users nếu app đang ở chế độ testing

3. **"Invalid client"**
   - Kiểm tra Client ID và Client Secret trong Supabase
   - Đảm bảo Google+ API đã được enable

4. **Redirect không hoạt động**
   - Kiểm tra callback route: `/auth/callback/route.ts`
   - Kiểm tra middleware configuration

## 6. Production Setup

Khi deploy production:

1. Cập nhật Authorized redirect URIs với domain production
2. Cập nhật Redirect URLs trong Supabase với domain production
3. Cấu hình OAuth consent screen cho production use
4. Test toàn bộ flow trên production environment
