# Hệ thống Bảo vệ Route

## Tổng quan

Hệ thống bảo vệ route được thiết kế để kiểm soát quyền truy cập các trang trong ứng dụng Lookify.

## Các loại Route

### 1. Public Routes (Không cần đăng nhập)
- `/` - Trang chủ
- `/signin` - Trang đăng nhập
- `/featured` - Trang styling theo mood
- `/fit-guide` - Trang fit guide
- `/gallery` - Thư viện outfits
- `/suggester` - Trang gợi ý AI
- `/outfit/[id]` - Chi tiết outfit
- `/upgrade` - Trang nâng cấp

### 2. Protected Routes (Cần đăng nhập)
- `/profile` - Trang hồ sơ cá nhân
- `/profile/settings` - Cài đặt cá nhân

### 3. Admin Routes (Chỉ admin mới được truy cập)
- `/dashboard` - Dashboard tổng quan
- `/dashboard/users` - Quản lý người dùng
- `/dashboard/outfits` - Quản lý outfits
- `/dashboard/articles` - Quản lý bài viết
- `/dashboard/settings` - Cài đặt hệ thống

## Components Bảo vệ

### ProtectedRoute
```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      {/* Nội dung trang */}
    </ProtectedRoute>
  );
}
```

**Chức năng:**
- Kiểm tra user đã đăng nhập chưa
- Nếu chưa đăng nhập → redirect to `/signin`
- Hiển thị loading state trong khi kiểm tra
- Fallback UI tùy chỉnh (optional)

### AdminRoute
```tsx
import { AdminRoute } from "@/components/auth/admin-route";

export default function DashboardPage() {
  return (
    <AdminRoute>
      {/* Nội dung trang */}
    </AdminRoute>
  );
}
```

**Chức năng:**
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra role có phải admin không
- Nếu chưa đăng nhập → redirect to `/signin`
- Nếu không phải admin → redirect to `/` với thông báo lỗi
- Hiển thị loading state trong khi kiểm tra

## Middleware Protection

### Cấu hình trong `src/utils/supabase/middleware.ts`

```typescript
// Public routes - không cần authentication
const publicRoutes = [
  '/',
  '/signin',
  '/auth',
  '/error',
  '/featured',
  '/fit-guide', 
  '/gallery',
  '/suggester',
  '/outfit',
  '/upgrade'
];

// Dashboard routes - chỉ admin mới được truy cập
if (request.nextUrl.pathname.startsWith('/dashboard')) {
  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Kiểm tra role admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role;
  if (userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Profile routes - cần đăng nhập
if (request.nextUrl.pathname.startsWith('/profile')) {
  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}
```

## Cách hoạt động

### 1. Middleware Level (Server-side)
- Chặn request trước khi đến component
- Kiểm tra authentication và authorization
- Redirect ngay lập tức nếu không có quyền

### 2. Component Level (Client-side)
- Double-check authentication state
- Hiển thị loading và error states
- Smooth user experience với fallback UI

## Cấu hình User Role

### Trong Supabase
```sql
-- Cập nhật user metadata khi đăng ký
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"admin"'
) 
WHERE id = 'user_id_here';
```

### Trong Google OAuth
```typescript
// Cập nhật role trong user metadata
const { error } = await supabase.auth.updateUser({
  data: { role: 'admin' }
});
```

## Troubleshooting

### Lỗi thường gặp:

1. **"Access Denied" khi truy cập dashboard**
   - Kiểm tra user có role 'admin' không
   - Kiểm tra user_metadata.role hoặc app_metadata.role

2. **Redirect loop**
   - Kiểm tra middleware configuration
   - Đảm bảo public routes được định nghĩa đúng

3. **Component không render**
   - Kiểm tra ProtectedRoute/AdminRoute wrapper
   - Kiểm tra auth context state

### Debug Tips:
```typescript
// Log user role để debug
console.log('User role:', currentUser?.user_metadata?.role);
console.log('App metadata:', currentUser?.app_metadata);
```

## Best Practices

1. **Luôn sử dụng cả middleware và component protection**
2. **Kiểm tra role ở cả client và server side**
3. **Sử dụng fallback UI để UX tốt hơn**
4. **Log authentication events để debug**
5. **Test với các user role khác nhau**
