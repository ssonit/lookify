
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React from 'react';
import Image from 'next/image';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from './ui/textarea';
import { UploadCloud, X, Youtube } from 'lucide-react';
import { TiktokIcon } from './icons';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const articleFormSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề cần ít nhất 10 ký tự.' }),
  description: z.string().min(20, { message: 'Mô tả chi tiết cần ít nhất 20 ký tự.' }),
  imageUrl: z.string().url({ message: 'Vui lòng nhập URL ảnh hợp lệ.' }),
  tags: z.string().min(1, { message: "Nhập ít nhất một tag, cách nhau bằng dấu phẩy."}),
  level: z.string().min(3, { message: "Level không được để trống." }),
  cta: z.string().min(1, { message: "CTA không được để trống." }),
  link: z.string().url({ message: 'Vui lòng nhập URL hợp lệ.' }),
  platform: z.enum(['youtube', 'tiktok']),
  // SEO fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export type ArticleFormValues = Omit<z.infer<typeof articleFormSchema>, 'tags'> & { tags: string[] };

interface ArticleFormProps {
  onSave: (data: ArticleFormValues) => void;
  initialData?: Partial<ArticleFormValues>;
  isLoading?: boolean;
}

export function ArticleForm({ onSave, initialData, isLoading = false }: ArticleFormProps) {
  const form = useForm<z.infer<typeof articleFormSchema>>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      ...initialData,
      tags: initialData?.tags?.join(', ') || '',
      platform: initialData?.link?.includes('youtube') ? 'youtube' : 'tiktok'
    } || {
      title: '',
      description: '',
      imageUrl: '',
      tags: '',
      level: '',
      cta: 'Xem ngay',
      link: '',
      platform: 'youtube',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    },
  });


  function onSubmit(data: z.infer<typeof articleFormSchema>) {
    onSave({ ...data, tags: data.tags.split(',').map(tag => tag.trim())});
  }
  
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tags: initialData.tags?.join(', ') || '',
        platform: initialData?.link?.includes('youtube') ? 'youtube' : 'tiktok'
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={isLoading} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="ví dụ: Cách phối đồ theo dáng người..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn về nội dung bài viết..."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Ảnh thumbnail</FormLabel>
                    <FormControl>
                      <Input placeholder="https://images.unsplash.com/..." {...field} />
                    </FormControl>
                    {field.value && <Image src={field.value} alt="Xem trước" width={200} height={120} className="mt-2 rounded-md object-cover" />}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Video (Youtube/Tiktok)</FormLabel>
                    <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Video, Hướng dẫn,..." {...field} />
                    </FormControl>
                    <FormDescription>Các tag cách nhau bởi dấu phẩy.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level / Thời lượng</FormLabel>
                    <FormControl>
                      <Input placeholder="Starter, ~45 phút,..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call-to-action text</FormLabel>
                    <FormControl>
                      <Input placeholder="Xem trên Youtube" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Nền tảng</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="youtube" />
                              </FormControl>
                              <Label className="font-normal flex items-center gap-2"><Youtube className="text-red-600" /> Youtube</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="tiktok" />
                              </FormControl>
                              <Label className="font-normal flex items-center gap-2"><TiktokIcon className="h-5 w-5" /> Tiktok</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Tối ưu hóa SEO (Tùy chọn)</CardTitle>
                <FormDescription>Cung cấp các thông tin này để cải thiện thứ hạng trên các công cụ tìm kiếm.</FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                        <Input placeholder="Tiêu đề hiển thị trên Google..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                         <Textarea placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                        <Input placeholder="phối đồ, thời trang,..." {...field} />
                        </FormControl>
                        <FormDescription>Các từ khóa cách nhau bởi dấu phẩy.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">Lưu lại</Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
