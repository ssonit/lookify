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
import { WandSparkles } from 'lucide-react';

export const OutfitSuggestionFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'Please select a gender.' }),
  context: z.enum(['work/office', 'casual', 'party/date', 'sport/active'], { required_error: 'Please select a context.' }),
  colorPreference: z.string().min(2, { message: 'Please enter a color preference.' }),
  stylePreference: z.enum(['basic', 'streetwear', 'elegant', 'sporty'], { required_error: 'Please select a style.' }),
  season: z.enum(['spring', 'summer', 'autumn', 'winter'], { required_error: 'Please select a season.' }),
});

interface OutfitSuggesterFormProps {
  onSubmit: (values: z.infer<typeof OutfitSuggestionFormSchema>) => void;
  isLoading: boolean;
}

export function OutfitSuggesterForm({ onSubmit, isLoading }: OutfitSuggesterFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
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
              <FormLabel>Context / Occasion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a context" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="work/office">Work / Office</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="party/date">Party / Date</SelectItem>
                  <SelectItem value="sport/active">Sport / Active</SelectItem>
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
              <FormLabel>Style Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="streetwear">Streetwear</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="sporty">Sporty</SelectItem>
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
              <FormLabel>Season</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a season" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
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
              <FormLabel>Color Preference</FormLabel>
              <FormControl>
                <Input placeholder="e.g., neutral tones, pastels, vibrant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full !mt-6">
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" /> Suggest Outfit
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
