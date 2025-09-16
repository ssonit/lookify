"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldX } from "lucide-react";
import { useAdminRole } from "@/hooks/use-admin-role";

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { currentUser, isLoading, isInitialized } = useAuth();
  const { isAdmin, isLoading: isCheckingRole } = useAdminRole();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !currentUser) {
      router.push('/signin');
    }
  }, [currentUser, isLoading, isInitialized, router]);

  console.log({isAdmin, isLoading, isInitialized, isCheckingRole});


  // Loading state
  if (isLoading || !isInitialized || isCheckingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không có quyền truy cập</h2>
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để tiếp tục</p>
          <button 
            onClick={() => router.push('/signin')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Not admin - block access
  if (isAdmin === false) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không có quyền truy cập</h2>
          <p className="text-muted-foreground mb-4">
            Bạn cần quyền admin để truy cập trang này
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Admin user - render children
  return <>{children}</>;
}

