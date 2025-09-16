
"use client";

import { PageTitle } from "@/components/page-title";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Tổng quan" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số Outfits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">20</p>
            <p className="text-sm text-muted-foreground">
              Số lượng trang phục hiện có trong hệ thống.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lượt xem tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12,345</p>
            <p className="text-sm text-muted-foreground">
              Tổng lượt xem chi tiết các trang phục.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lượt lưu tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">
              Số lượt người dùng lưu trang phục yêu thích.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
