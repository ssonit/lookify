
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, Trash2 } from 'lucide-react';

const shoppingLinkSchema = z.object({
  store: z.string().min(1, { message: 'Tên cửa hàng không được để trống.' }),
  url: z.string().url({ message: 'Vui lòng nhập URL hợp lệ.' }),
});

const itemSchema = z.object({
  name: z.string().min(3, { message: 'Tên item cần ít nhất 3 ký tự.' }),
  type: z.string().min(1, { message: 'Loại item không được để trống.' }),
  imageUrl: z.string().url({ message: 'Vui lòng nhập URL hình ảnh hợp lệ.' }),
  shoppingLinks: z.array(shoppingLinkSchema),
});

const outfitFormSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề cần ít nhất 10 ký tự.' }),
  description: z.string().min(20, { message: 'Mô tả chi tiết cần ít nhất 20 ký tự.' }),
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  context: z.enum(['work/office', 'casual', 'party/date', 'sport/active', 'tet', 'game-anime'], { required_error: 'Vui lòng chọn bối cảnh.' }),
  style: z.enum(['basic', 'streetwear', 'elegant', 'sporty'], { required_error: 'Vui lòng chọn phong cách.' }),
  season: z.enum(['spring', 'summer', 'autumn', 'winter'], { required_error: 'Vui lòng chọn mùa.' }),
  color: z.enum(['black', 'white', 'pastel', 'earth-tone', 'vibrant'], { required_error: 'Vui lòng chọn màu chủ đạo.' }),
  mainImage: z.string().url({ message: 'Vui lòng nhập URL hình ảnh hợp lệ.' }),
  items: z.array(itemSchema).min(1, { message: 'Cần có ít nhất một item trong outfit.' }),
});

type OutfitFormValues = z.infer<typeof outfitFormSchema>;

interface OutfitFormProps {
  onSave: (data: OutfitFormValues) => void;
  initialData?: Partial<OutfitFormValues>;
}

function ItemFields({ control, itemIndex, remove }: { control: any; itemIndex: number; remove: (index: number) => void; }) {
  const { fields, append, remove: removeLink } = useFieldArray({
    control,
    name: `items.${itemIndex}.shoppingLinks`,
  });

  return (
    <Card className="p-4 border-dashed">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`items.${itemIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên item</FormLabel>
              <FormControl><Input placeholder="Áo thun oversize..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`items.${itemIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại item</FormLabel>
              <FormControl><Input placeholder="Top, Bottom, Shoes..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`items.${itemIndex}.imageUrl`}
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>URL hình ảnh item</FormLabel>
            <FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-4 space-y-3">
        <FormLabel>Link mua sắm</FormLabel>
        {fields.map((field, linkIndex) => (
          <div key={field.id} className="flex items-end gap-2">
            <FormField
              control={control}
              name={`items.${itemIndex}.shoppingLinks.${linkIndex}.store`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl><Input placeholder="Tên cửa hàng (ví dụ: Shopee)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`items.${itemIndex}.shoppingLinks.${linkIndex}.url`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl><Input placeholder="URL sản phẩm" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(linkIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ store: '', url: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm link
        </Button>
      </div>
      <Button
        type="button"
        variant="destructive"
        className="mt-4"
        onClick={() => remove(itemIndex)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa Item
      </Button>
    </Card>
  );
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
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
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
        
        <Card>
            <CardHeader>
                <CardTitle>Các item trong outfit</CardTitle>
                <FormDescription>Thêm các sản phẩm cụ thể tạo nên bộ trang phục này.</FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <ItemFields key={field.id} control={form.control} itemIndex={index} remove={remove} />
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => append({ name: '', type: '', imageUrl: '', shoppingLinks: [] })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm Item mới
                </Button>
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
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
