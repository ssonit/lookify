-- Create virtual-try-on storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'virtual-try-on',
  'virtual-try-on',
  true,
  10485760, -- 10MB limit
  ARRAY['image/webp', 'image/jpeg', 'image/png']
);

-- Create RLS policies for virtual-try-on bucket
CREATE POLICY "Users can upload their own virtual try-on images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'virtual-try-on' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own virtual try-on images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'virtual-try-on' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own virtual try-on images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'virtual-try-on' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own virtual try-on images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'virtual-try-on' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all virtual try-on images
CREATE POLICY "Admins can view all virtual try-on images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'virtual-try-on' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

