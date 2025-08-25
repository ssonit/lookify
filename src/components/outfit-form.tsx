
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from './ui/textarea';
import { PlusCircle, Trash2, UploadCloud, X } from 'lucide-react';
import { COLOR_OPTIONS, GENDER_OPTIONS, SEASON_OPTIONS, CATEGORY_OPTIONS } from '@/lib/constants';

const shoppingLinkSchema = z.object({
  store: z.string().min(1, { message: 'Tên cửa hàng không được để trống.' }),
  url: z.string().url({ message: 'Vui lòng nhập URL hợp lệ.' }),
});

const itemSchema = z.object({
  name: z.string().min(3, { message: 'Tên item cần ít nhất 3 ký tự.' }),
  type: z.string().min(1, { message: 'Loại item không được để trống.' }),
  imageUrl: z.any(),
  shoppingLinks: z.array(shoppingLinkSchema),
});

const outfitFormSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề cần ít nhất 10 ký tự.' }),
  description: z.string().min(20, { message: 'Mô tả chi tiết cần ít nhất 20 ký tự.' }),
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  category: z.enum(['work/office', 'casual', 'party/date', 'sport/active', 'tet', 'game-anime', 'basic', 'streetwear', 'elegant', 'sporty', 'beach'], { required_error: 'Vui lòng chọn danh mục.' }),
  season: z.enum(['spring', 'summer', 'autumn', 'winter'], { required_error: 'Vui lòng chọn mùa.' }),
  color: z.enum(['black', 'white', 'pastel', 'earth-tone', 'vibrant'], { required_error: 'Vui lòng chọn màu chủ đạo.' }),
  mainImage: z.any().refine((file) => file, 'Vui lòng tải ảnh chính.'),
  items: z.array(itemSchema).min(1, { message: 'Cần có ít nhất một item trong outfit.' }),
});

export type OutfitFormValues = z.infer<typeof outfitFormSchema>;

interface OutfitFormProps {
  onSave: (data: OutfitFormValues) => void;
  initialData?: Partial<OutfitFormValues>;
}

function ImageUploadField({ form, name, description }: { form: any; name: string; description: string }) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileRef = form.watch(name);

  React.useEffect(() => {
    if (fileRef instanceof File) {
      const objectUrl = URL.createObjectURL(fileRef);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof fileRef === 'string') { // Handle initial data (if it's a URL)
        setPreview(fileRef);
    }
  }, [fileRef]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue(name, file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setPreview(null);
    form.setValue(name, null, { shouldValidate: true });
  };


  return (
    <FormItem>
      <FormLabel>{description}</FormLabel>
      <FormControl>
        <div>
          {preview ? (
            <div className="relative group w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed">
              <Image src={preview} alt="Xem trước ảnh" layout="fill" objectFit="cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Button type="button" variant="destructive" size="icon" onClick={removeImage} className="absolute top-2 right-2">
                  <X />
                </Button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted transition-colors">
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">Tải ảnh lên</p>
              </div>
              <Input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function ItemFields({ control, itemIndex, remove, form }: { control: any; itemIndex: number; remove: (index: number) => void; form: any }) {
  const { fields, append, remove: removeLink } = useFieldArray({
    control,
    name: `items.${itemIndex}.shoppingLinks`,
  });

  return (
    <Card className="p-4 border-dashed">
       <div className="flex justify-end">
         <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(itemIndex)}
          >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
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
            render={() => (
                <ImageUploadField form={form} name={`items.${itemIndex}.imageUrl`} description="Ảnh Item" />
            )}
        />
      </div>
      

      <div className="mt-4 space-y-3">
        <FormLabel className="mr-2">Link mua sắm</FormLabel>
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
          <PlusCircle className="mr-1 h-4 w-4" />
          Thêm link
        </Button>
      </div>
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
      category: 'casual',
      season: 'summer',
      color: 'white',
      mainImage: null,
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
  
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

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
                render={() => (
                   <ImageUploadField form={form} name="mainImage" description="Ảnh chính" />
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
                      {GENDER_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
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
                      {SEASON_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
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
                      {COLOR_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
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
                    <ItemFields key={field.id} control={form.control} itemIndex={index} remove={remove} form={form} />
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => append({ name: '', type: '', imageUrl: null, shoppingLinks: [] })}
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
