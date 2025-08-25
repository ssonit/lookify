'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { WandSparkles, UploadCloud, X } from 'lucide-react';

export const OutfitSuggestionFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  context: z.enum(['work/office', 'casual', 'party/date', 'sport/active'], { required_error: 'Vui lòng chọn bối cảnh.' }),
  colorPreference: z.string().min(2, { message: 'Vui lòng nhập sở thích màu sắc.' }),
  stylePreference: z.enum(['basic', 'streetwear', 'elegant', 'sporty'], { required_error: 'Vui lòng chọn phong cách.' }),
  season: z.enum(['spring', 'summer', 'autumn', 'winter'], { required_error: 'Vui lòng chọn mùa.' }),
  userImage: z.any().optional(),
});

interface OutfitSuggesterFormProps {
  onSubmit: (values: z.infer<typeof OutfitSuggestionFormSchema>) => void;
  isLoading: boolean;
}

export function OutfitSuggesterForm({ onSubmit, isLoading }: OutfitSuggesterFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof OutfitSuggestionFormSchema>>({
    resolver: zodResolver(OutfitSuggestionFormSchema),
    defaultValues: {
      colorPreference: '',
      gender: 'female',
      context: 'casual',
      stylePreference: 'basic',
      season: 'spring',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('userImage', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('userImage', null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Image Upload */}
        <FormItem>
          <FormLabel>Tải ảnh của bạn (tùy chọn)</FormLabel>
          <FormControl>
            <div className="w-full">
              {imagePreview ? (
                <div className="relative group w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed">
                  <Image src={imagePreview} alt="Xem trước ảnh" layout="fill" objectFit="cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button type="button" variant="destructive" size="icon" onClick={removeImage}>
                        <X />
                        <span className="sr-only">Xóa ảnh</span>
                     </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (tối đa 5MB)</p>
                  </div>
                  <Input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>


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
              <FormLabel>Bối cảnh / Dịp</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn bối cảnh" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="work/office">Công sở</SelectItem>
                  <SelectItem value="casual">Thường ngày</SelectItem>
                  <SelectItem value="party/date">Tiệc / Hẹn hò</SelectItem>
                  <SelectItem value="sport/active">Thể thao / Năng động</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stylePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sở thích phong cách</FormLabel>
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
          name="colorPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sở thích màu sắc</FormLabel>
              <FormControl>
                <Input placeholder="ví dụ: tông màu trung tính, pastel, rực rỡ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full !mt-6">
          {isLoading ? (
            'Đang tạo...'
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" /> Gợi ý trang phục
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
