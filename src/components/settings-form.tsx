
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
import { Textarea } from './ui/textarea';

const settingsFormSchema = z.object({
  siteName: z.string().min(1, 'Tên trang web không được để trống.'),
  siteDescription: z.string().optional(),
  logoUrl: z.string().url('URL logo không hợp lệ.').optional(),
  bannerUrl: z.string().url('URL banner không hợp lệ.').optional(),
  seoTitle: z.string().min(1, 'Meta title không được để trống.'),
  seoDescription: z.string().optional(),
  theme: z.object({
      background: z.string(),
      foreground: z.string(),
      primary: z.string(),
      accent: z.string(),
  })
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  onSave: (data: Partial<SettingsFormValues>) => void;
  initialData: Partial<SettingsFormValues>;
  section: 'general' | 'seo';
}

export function SettingsForm({ onSave, initialData, section }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialData,
  });

  function onSubmit(data: SettingsFormValues) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        {section === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý tên, mô tả, logo, và banner của trang web.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên trang web</FormLabel>
                    <FormControl>
                      <Input placeholder="Lookify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nâng cấp phong cách – Nâng cấp chính mình" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Banner (Hero Section)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://images.unsplash.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {section === 'seo' && (
            <>
            <Card>
                <CardHeader>
                <CardTitle>Cấu hình SEO</CardTitle>
                <CardDescription>Thiết lập các thẻ meta mặc định cho toàn bộ trang web để cải thiện thứ hạng tìm kiếm.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="seoTitle"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Title mặc định</FormLabel>
                            <FormControl>
                            <Input placeholder="Tiêu đề trang web..." {...field} />
                            </FormControl>
                             <FormDescription>Tiêu đề xuất hiện trên tab trình duyệt và kết quả tìm kiếm.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seoDescription"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description mặc định</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Mô tả trang web..." {...field} />
                            </FormControl>
                            <FormDescription>Đoạn mô tả ngắn gọn về trang web của bạn trên kết quả tìm kiếm.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Các giá trị màu HSL CSS được sử dụng trong `globals.css`. (Hiện tại ở chế độ chỉ đọc).</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="theme.background"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="theme.primary"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="theme.accent"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Accent Color</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            </>
        )}

        <div className="flex justify-end">
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </Form>
  );
}
