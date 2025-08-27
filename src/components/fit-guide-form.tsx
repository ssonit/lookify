
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Ruler } from 'lucide-react';
import { BODY_SHAPE_OPTIONS } from '@/lib/constants';

export const FitGuideFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  bodyShape: z.string().min(1, { message: 'Vui lòng chọn dáng người.' }),
  height: z.coerce.number().positive('Chiều cao phải là số dương.'),
  weight: z.coerce.number().positive('Cân nặng phải là số dương.'),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
