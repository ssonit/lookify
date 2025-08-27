
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from './ui/separator';

const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự.'),
  email: z.string().email('Email không hợp lệ.'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
  outfitSuggestions: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
  promotionalEmails: z.boolean().default(false),
}).refine(data => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Vui lòng nhập mật khẩu hiện tại.",
    path: ["currentPassword"],
})
.refine(data => {
    if (data.newPassword && (data.newPassword.length < 8)) {
        return false;
    }
    return true;
}, {
    message: "Mật khẩu mới phải có ít nhất 8 ký tự.",
    path: ["newPassword"],
})
.refine(data => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới không khớp.",
  path: ["confirmPassword"],
});


type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;

// Mock data, in a real app this would come from an API
const defaultValues: Partial<ProfileSettingsValues> = {
  name: 'An Trần',
  email: 'an.tran@example.com',
  outfitSuggestions: true,
  weeklyDigest: false,
  promotionalEmails: false,
};

export function ProfileSettingsForm() {
  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileSettingsValues) {
    console.log('Form data submitted:', data);
    // Here you would call an API to update the user's settings
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật tên và địa chỉ email của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tên hiển thị</FormLabel>
                        <FormControl>
                            <Input placeholder="Tên của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>Thay đổi mật khẩu của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>Quản lý cách chúng tôi liên lạc với bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="outfitSuggestions"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Gợi ý trang phục</FormLabel>
                            <FormDescription>
                                Nhận thông báo khi có gợi ý trang phục mới phù hợp với bạn.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weeklyDigest"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Bản tin hàng tuần</FormLabel>
                             <FormDescription>
                                Nhận email tổng hợp các trang phục nổi bật mỗi tuần.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="promotionalEmails"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Email khuyến mãi</FormLabel>
                             <FormDescription>
                                Nhận thông báo về các ưu đãi và khuyến mãi đặc biệt.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Tài khoản</CardTitle>
                <CardDescription>Các hành động không thể hoàn tác.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive">Xóa tài khoản</Button>
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </Form>
  );
}
