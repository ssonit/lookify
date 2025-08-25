
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from './ui/textarea';

const outfitFormSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề cần ít nhất 10 ký tự.' }),
  description: z.string().min(20, { message: 'Mô tả chi tiết cần ít nhất 20 ký tự.' }),
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  context: z.enum(['work/office', 'casual', 'party/date', 'sport/active', 'tet', 'game-anime'], { required_error: 'Vui lòng chọn bối cảnh.' }),
  style: z.enum(['basic', 'streetwear', 'elegant', 'sporty'], { required_error: 'Vui lòng chọn phong cách.' }),
  season: z.enum(['spring', 'summer', 'autumn', 'winter'], { required_error: 'Vui lòng chọn mùa.' }),
  color: z.enum(['black', 'white', 'pastel', 'earth-tone', 'vibrant'], { required_error: 'Vui lòng chọn màu chủ đạo.' }),
  mainImage: z.string().url({ message: 'Vui lòng nhập URL hình ảnh hợp lệ.' }),
});

type OutfitFormValues = z.infer<typeof outfitFormSchema>;

interface OutfitFormProps {
  onSave: (data: OutfitFormValues) => void;
  initialData?: Partial<OutfitFormValues>; // For editing later
}

export function OutfitForm({ onSave, initialData }: OutfitFormProps) {
  const form = useForm<OutfitFormValues>({
    resolver: zodResolver(outfitFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      gender: 'female',
      context: 'casual',
      style: 'basic',
      season: 'summer',
      color: 'white',
      mainImage: '',
    },
  });

  function onSubmit(data: OutfitFormValues) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="ví dụ: Bộ suit nam thanh lịch..." {...field} />
                  </FormControl>
                  <FormDescription>Đây là tiêu đề chính của outfit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về outfit, các item, và gợi ý phối đồ..."
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
              name="mainImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL hình ảnh chính</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân loại</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bối cảnh</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn bối cảnh" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="work/office">Công sở</SelectItem>
                      <SelectItem value="casual">Thường ngày</SelectItem>
                      <SelectItem value="party/date">Tiệc / Hẹn hò</SelectItem>
                      <SelectItem value="sport/active">Thể thao</SelectItem>
                       <SelectItem value="tet">Tết</SelectItem>
                      <SelectItem value="game-anime">Game/Anime</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phong cách</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn phong cách" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Cơ bản</SelectItem>
                      <SelectItem value="streetwear">Dạo phố</SelectItem>
                      <SelectItem value="elegant">Thanh lịch</SelectItem>
                      <SelectItem value="sporty">Năng động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mùa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn mùa" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="spring">Xuân</SelectItem>
                      <SelectItem value="summer">Hè</SelectItem>
                      <SelectItem value="autumn">Thu</SelectItem>
                      <SelectItem value="winter">Đông</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu chủ đạo</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn màu chủ đạo" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black">Đen</SelectItem>
                      <SelectItem value="white">Trắng</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="earth-tone">Tone đất</SelectItem>
                      <SelectItem value="vibrant">Rực rỡ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Lưu lại</Button>
        </div>
      </form>
    </Form>
  );
}

    