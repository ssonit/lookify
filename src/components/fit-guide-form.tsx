
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React from 'react';

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
import { Ruler, UploadCloud, X } from 'lucide-react';
import { BODY_SHAPE_OPTIONS } from '@/lib/constants';
import Image from 'next/image';

export const FitGuideFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  bodyShape: z.string().min(1, { message: 'Vui lòng chọn dáng người.' }),
  height: z.coerce.number().positive('Chiều cao phải là số dương.'),
  weight: z.coerce.number().positive('Cân nặng phải là số dương.'),
  userImage: z.any().optional(),
});

export type FitGuideFormValues = z.infer<typeof FitGuideFormSchema>;

interface FitGuideFormProps {
  onSubmit: (values: FitGuideFormValues) => void;
  isLoading: boolean;
}

export function FitGuideForm({ onSubmit, isLoading }: FitGuideFormProps) {
  const form = useForm<FitGuideFormValues>({
    resolver: zodResolver(FitGuideFormSchema),
    defaultValues: {
      gender: 'female',
      bodyShape: '',
      height: undefined,
      weight: undefined,
    },
  });
  
  const watchedGender = form.watch('gender');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const userImageFile = form.watch('userImage');

  React.useEffect(() => {
    if (userImageFile && userImageFile instanceof File) {
      const objectUrl = URL.createObjectURL(userImageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [userImageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('userImage', file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('userImage', null, { shouldValidate: true });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
         <FormField
          control={form.control}
          name="userImage"
          render={() => (
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
          )}
        />
        
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
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="male">Nam</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyShape"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dáng người</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} key={watchedGender}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn dáng người của bạn" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BODY_SHAPE_OPTIONS[watchedGender].map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chiều cao (cm)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="ví dụ: 165" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cân nặng (kg)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="ví dụ: 55" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full !mt-6">
          {isLoading ? (
            'Đang tính toán...'
          ) : (
            <>
              <Ruler className="mr-2 h-4 w-4" /> Tìm size phù hợp
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
