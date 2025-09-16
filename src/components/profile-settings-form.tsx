
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
import { DateInput } from '@/components/ui/date-input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from './ui/textarea';
import { DialogClose } from './ui/dialog';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const profileSettingsSchema = z.object({
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự.'),
  email: z.string().email('Email không hợp lệ.'),
  bio: z.string().max(160, 'Tiểu sử không được vượt quá 160 ký tự.').optional(),
  website: z.string().url('Website phải là URL hợp lệ.').optional().or(z.literal('')),
  location: z.string().max(100, 'Địa chỉ không được vượt quá 100 ký tự.').optional(),
  phone: z.string().max(20, 'Số điện thoại không được vượt quá 20 ký tự.').optional(),
  date_of_birth: z.string().optional().transform((val) => val === '' ? null : val),
});

type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;

export function ProfileSettingsForm() {
  const { profile, updateProfile, isLoading, currentUser } = useUserProfile();
  const { toast } = useToast();

  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || currentUser?.email || '',
      bio: profile?.bio || '',
      website: profile?.website || '',
      location: profile?.location || '',
      phone: profile?.phone || '',
      date_of_birth: profile?.date_of_birth || '',
    },
  });

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        email: profile.email || currentUser?.email || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
  }, [profile, currentUser, form]);

  async function onSubmit(data: ProfileSettingsValues) {
    try {
      await updateProfile({
        full_name: data.full_name,
        bio: data.bio,
        website: data.website,
        location: data.location,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
      });
      
      toast({
        title: "Thành công",
        description: "Thông tin hồ sơ đã được cập nhật.",
      });

      form.reset();
     
    
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin hồ sơ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Thông tin công khai</CardTitle>
                <CardDescription>Cập nhật các thông tin sẽ hiển thị trên hồ sơ của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tên hiển thị</FormLabel>
                        <FormControl>
                            <Input placeholder="Tên của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Mô tả ngắn về bạn..." className="resize-y" {...field} />
                        </FormControl>
                        <FormDescription>Mô tả phong cách, câu quote, sở thích của bạn.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cung cấp thêm thông tin để nhận gợi ý tốt hơn. Thông tin này sẽ không công khai.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="email"
                    disabled
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="@lookify.io" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                            <Input placeholder="https://lookify.io" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                            <Input placeholder="Thành phố, Quốc gia" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                            <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                            <DateInput 
                                value={field.value || ''} 
                                onChange={field.onChange}
                                placeholder="dd/mm/yyyy"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-4">
            <DialogClose asChild>
                <Button type="button" variant="secondary">Hủy</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                    </>
                ) : (
                    'Cập nhật thông tin'
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
