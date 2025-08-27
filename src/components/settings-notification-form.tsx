
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
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';


const settingsNotificationSchema = z.object({
  outfitSuggestions: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
  promotionalEmails: z.boolean().default(false),
});


type SettingsNotificationValues = z.infer<typeof settingsNotificationSchema>;

const defaultValues: Partial<SettingsNotificationValues> = {
  outfitSuggestions: true,
  weeklyDigest: false,
  promotionalEmails: false,
};

export function SettingsNotificationForm() {
  const form = useForm<SettingsNotificationValues>({
    resolver: zodResolver(settingsNotificationSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsNotificationValues) {
    console.log('Form data submitted:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Cập nhật</Button>
        </div>
      </form>
    </Form>
  );
}
