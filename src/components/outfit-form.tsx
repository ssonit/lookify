
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
import { GENDER_OPTIONS } from '@/lib/constants';
import { useCategories } from '@/hooks/use-categories';
import { useSeasons } from '@/hooks/use-seasons';
import { useColors } from '@/hooks/use-colors';
import { useOutfitCreate } from '@/hooks/use-outfit-create';
import { useOutfitUpdate } from '@/hooks/use-outfit-update';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

// Utility function để tạo stable keys
const createStableKey = (prefix: string, id?: string, index?: number) => {
  if (id) return `${prefix}-${id}`;
  if (typeof index === 'number') return `${prefix}-${index}`;
  return `${prefix}-${crypto.randomUUID()}`;
};

const shoppingLinkSchema = z.object({
  id: z.string().optional(),
  store: z.string().min(1, { message: 'Tên cửa hàng không được để trống.' }),
  url: z.string().url({ message: 'Vui lòng nhập URL hợp lệ.' }),
});

const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: 'Tên item cần ít nhất 3 ký tự.' }),
  type: z.string().min(1, { message: 'Loại item không được để trống.' }),
  imageUrl: z.any(),
  affiliate_links: z.array(shoppingLinkSchema),
});

const outfitFormSchema = z.object({
  title: z.string().min(10, { message: 'Tiêu đề cần ít nhất 10 ký tự.' }),
  description: z.string().min(20, { message: 'Mô tả chi tiết cần ít nhất 20 ký tự.' }),
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  categories: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Bạn phải chọn ít nhất một danh mục.',
  }),
  season: z.string().min(1, { message: 'Vui lòng chọn mùa.' }),
  color: z.string().min(1, { message: 'Vui lòng chọn màu chủ đạo.' }),
  mainImage: z.any().refine((file) => file, 'Vui lòng tải ảnh chính.'),
  ai_hint: z.string().optional(),
  items: z.array(itemSchema).min(1, { message: 'Cần có ít nhất một item trong outfit.' }),
});

export type OutfitFormValues = z.infer<typeof outfitFormSchema>;

interface OutfitFormProps {
  onSave: (data: OutfitFormValues) => void;
  initialData?: Partial<OutfitFormValues>;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  outfitId?: string;
}

function ImageUploadField({ form, name, description }: { form: any; name: string; description: string }) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileRef = form.watch(name);

  React.useEffect(() => {
    if (fileRef instanceof File) {
      const objectUrl = URL.createObjectURL(fileRef);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof fileRef === 'string') {
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
                accept="image/png, image/jpeg, image/webp, image/jpg, image/gif, image/svg"
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

function ItemFields({ control, itemIndex, remove, form, itemId }: { control: any; itemIndex: number; remove: (index: number) => void; form: any; itemId: string }) {
  const { fields, append, remove: removeLink } = useFieldArray({
    control,
    name: `items.${itemIndex}.affiliate_links`,
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
              key={createStableKey('name', itemId, itemIndex)}
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
              key={createStableKey('type', itemId, itemIndex)}
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
            key={createStableKey('image', itemId, itemIndex)}
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
          <div key={createStableKey('link', field.id, linkIndex)} className="flex items-end gap-2">
            <FormField
              key={createStableKey('store', field.id, linkIndex)}
              control={control}
              name={`items.${itemIndex}.affiliate_links.${linkIndex}.store`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl><Input placeholder="Tên cửa hàng (ví dụ: Shopee)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              key={createStableKey('url', field.id, linkIndex)}
              control={control}
              name={`items.${itemIndex}.affiliate_links.${linkIndex}.url`}
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
          onClick={() => append({ 
            store: '', 
            url: '' 
          })}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Thêm link
        </Button>
      </div>
    </Card>
  );
}


export function OutfitForm({ onSave, initialData, isLoading = false, mode = 'create', outfitId }: OutfitFormProps) {
  const { categories } = useCategories();
  const { seasons } = useSeasons();
  const { colors } = useColors();
  const { createOutfit, isLoading: isCreating } = useOutfitCreate();
  const { updateOutfit, isLoading: isUpdating } = useOutfitUpdate();
  
  const form = useForm<OutfitFormValues>({
    resolver: zodResolver(outfitFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      categories: initialData.categories || [],
    } : {
      title: '',
      description: '',
      gender: 'female',
      categories: [],
      season: seasons.length > 0 ? seasons[0].id : '',
      color: colors.length > 0 ? colors[0].id : '',
      mainImage: null,
      ai_hint: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Reset form when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData && mode === 'edit') {
      form.reset({
        ...initialData,
        categories: initialData.categories || [],
        items: initialData.items || []
      });
    }
  }, [initialData, mode, form]);

  async function onSubmit(data: OutfitFormValues) {
    try {
      // Prepare file data
      const mainImageFile = data.mainImage instanceof File ? data.mainImage : undefined;

      if (mode === 'create') {
        // Create outfit data
        const outfitData = {
          title: data.title,
          description: data.description,
          gender: data.gender,
          season: data.season || null,
          color: data.color || null,
          image_url: typeof data.mainImage === 'string' ? data.mainImage : null,
          ai_hint: data.ai_hint || null,
          is_ai_generated: false,
          is_public: true,
          categories: data.categories,
          items: data.items.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            image_url: typeof item.imageUrl === 'string' ? item.imageUrl : null,
            imageFile: item.imageUrl instanceof File ? item.imageUrl : null,
            affiliate_links: item.affiliate_links
          })),
          mainImageFile
        };

        const outfit = await createOutfit(outfitData);
      } else if (mode === 'edit' && outfitId) {
        // Update outfit data
        const outfitData = {
          id: outfitId,
          title: data.title,
          description: data.description,
          gender: data.gender,
          season: data.season || null,
          color: data.color || null,
          image_url: typeof data.mainImage === 'string' ? data.mainImage : null,
          ai_hint: data.ai_hint || null,
          is_ai_generated: false,
          is_public: true,
          categories: data.categories,
          items: data.items.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            image_url: typeof item.imageUrl === 'string' ? item.imageUrl : null,
            imageFile: item.imageUrl instanceof File ? item.imageUrl : null,
            affiliate_links: item.affiliate_links
          })),
          mainImageFile
        };

        const outfit = await updateOutfit(outfitData);
      }

      onSave(data);
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} outfit:`, error);
      // Handle error (show toast, etc.)
    }
  }
  
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        categories: initialData.categories || [],
        items: initialData.items?.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          affiliate_links: item.affiliate_links?.map(link => ({
            id: link.id || crypto.randomUUID(),
            store: link.store,
            url: link.url
          })) || []
        })) || [],
      });
    }
  }, [initialData, form]);

  const watchedCategories = form.watch('categories');

  const handleCategorySelect = (categoryValue: string) => {
    const currentCategories = form.getValues('categories') || [];
    if (!currentCategories.includes(categoryValue)) {
      form.setValue('categories', [...currentCategories, categoryValue], { shouldValidate: true });
    }
  };

  const handleCategoryRemove = (categoryValue: string) => {
    const currentCategories = form.getValues('categories') || [];
    form.setValue(
      'categories',
      currentCategories.filter(c => c !== categoryValue),
      { shouldValidate: true }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={isLoading || isCreating || isUpdating} className="space-y-8">
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
                name="ai_hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gợi ý AI</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập gợi ý cho AI về outfit này (tùy chọn)..."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Gợi ý để AI hiểu rõ hơn về phong cách và mục đích sử dụng của outfit.
                    </FormDescription>
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
                        {GENDER_OPTIONS.map((option, index) => <SelectItem key={createStableKey('gender', option.value, index)} value={option.value}>{option.label}</SelectItem>)}
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
                        {seasons.map((season, index) => <SelectItem key={createStableKey('season', season.id, index)} value={season.id}>{season.label}</SelectItem>)}
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
                        {colors.map((color, index) => <SelectItem key={createStableKey('color', color.id, index)} value={color.id}>{color.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                     <Select onValueChange={handleCategorySelect}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục để thêm" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map((category, index) => (
                            <SelectItem key={createStableKey('category', category.id, index)} value={category.id} disabled={watchedCategories.includes(category.id)}>
                                {category.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {watchedCategories.map((categoryId, index) => {
                            const category = categories.find(c => c.id === categoryId);
                            return (
                                <Badge key={createStableKey('badge', categoryId, index)} variant="secondary">
                                {category ? category.label : categoryId}
                                <button
                                    type="button"
                                    className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/20"
                                    onClick={() => handleCategoryRemove(categoryId)}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                </Badge>
                            );
                        })}
                    </div>
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
                    <div key={createStableKey('item', field.id, index)}>
                      <ItemFields control={form.control} itemIndex={index} remove={remove} form={form} itemId={createStableKey('item', field.id, index)} />
                    </div>
                  ))}
                   <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => append({ 
                        id: crypto.randomUUID(), 
                        name: '', 
                        type: '', 
                        imageUrl: null, 
                        affiliate_links: [] 
                      })}
                      >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Thêm Item mới
                  </Button>
              </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating ? 'Đang tạo outfit...' : isUpdating ? 'Đang cập nhật outfit...' : 'Lưu lại'}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
