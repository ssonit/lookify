# Hướng dẫn Fix Admin Role

## Vấn đề
Bạn đã thay đổi role trong bảng `profiles` thành 'admin' nhưng vẫn không vào được dashboard vì hệ thống đang kiểm tra role từ sai nguồn.

## Nguyên nhân
- Hệ thống cũ kiểm tra role từ `user.user_metadata?.role` hoặc `user.app_metadata?.role`
- Nhưng role thực tế nằm trong bảng `profiles` của database

## Giải pháp đã thực hiện

### 1. Cập nhật Middleware
File: `src/utils/supabase/middleware.ts`
```typescript
// Kiểm tra role admin từ bảng profiles
try {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (error || !profile || profile.role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
} catch (error) {
  console.error('Error checking user role:', error);
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
```

### 2. Tạo Hook useAdminRole
File: `src/hooks/use-admin-role.ts`
```typescript
export function useAdminRole() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        if (error || !profile) {
          setIsAdmin(false);
        } else {
          setIsAdmin(profile.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [currentUser]);

  return {
    isAdmin,
    isLoading,
    currentUser
  };
}
```

### 3. Cập nhật AdminRoute Component
File: `src/components/auth/admin-route.tsx`
```typescript
export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { currentUser, isLoading, isInitialized } = useAuth();
  const { isAdmin, isLoading: isCheckingRole } = useAdminRole();
  // ... rest of the component
}
```

### 4. Cập nhật Header Component
File: `src/components/header.tsx`
```typescript
function AdminDashboardLink() {
  const { isAdmin } = useAdminRole();
  
  if (!isAdmin) return null;
  
  return (
    <DropdownMenuItem asChild>
      <Link href="/dashboard">
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Dashboard</span>
      </Link>
    </DropdownMenuItem>
  );
}
```

## Các bước thực hiện

### Bước 1: Chạy Migration
1. Vào Supabase Dashboard > SQL Editor
2. Chạy file `supabase/migrations/20241201000000_create_profiles_table.sql`
3. Chạy file `supabase/migrations/20241201000001_update_user_role.sql` (thay email thực tế)

### Bước 2: Kiểm tra Database
```sql
-- Kiểm tra bảng profiles có tồn tại không
SELECT * FROM profiles;

-- Kiểm tra user có role admin không
SELECT id, email, full_name, role FROM profiles WHERE role = 'admin';
```

### Bước 3: Test
1. Đăng nhập với user có role admin
2. Truy cập `/dashboard`
3. Kiểm tra console log để debug

## Debug Tips

### 1. Kiểm tra Console Log
```typescript
// Trong useAdminRole hook
console.log('Profile data:', profile);
console.log('User role:', profile?.role);
console.log('Is admin:', profile?.role === 'admin');
```

### 2. Kiểm tra Network Tab
- Xem request đến bảng `profiles` có thành công không
- Kiểm tra response data

### 3. Kiểm tra Database
```sql
-- Kiểm tra RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Kiểm tra user permissions
SELECT * FROM information_schema.role_table_grants 
WHERE table_name = 'profiles';
```

## Troubleshooting

### Lỗi "relation 'profiles' does not exist"
- Chạy migration tạo bảng profiles trước

### Lỗi "permission denied"
- Kiểm tra RLS policies
- Đảm bảo user đã đăng nhập

### Lỗi "role does not exist"
- Kiểm tra enum `user_role` đã được tạo
- Đảm bảo giá trị 'admin' tồn tại trong enum

### Dashboard vẫn không hiển thị
- Kiểm tra component AdminRoute có được wrap đúng không
- Kiểm tra hook useAdminRole có return đúng giá trị không
- Kiểm tra console log để debug

## Kết quả mong đợi
Sau khi thực hiện đầy đủ các bước:
1. User có role 'admin' trong bảng `profiles` sẽ truy cập được dashboard
2. User thường sẽ bị redirect về trang chủ khi truy cập dashboard
3. Middleware và component protection hoạt động đúng
4. Header hiển thị link Dashboard cho admin users
