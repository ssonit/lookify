-- Create virtual_try_on table
CREATE TABLE virtual_try_on (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    uploaded_image_url TEXT NOT NULL,
    selected_outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE,
    result_image_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_virtual_try_on_user_id ON virtual_try_on(user_id);
CREATE INDEX idx_virtual_try_on_outfit_id ON virtual_try_on(selected_outfit_id);
CREATE INDEX idx_virtual_try_on_status ON virtual_try_on(status);
CREATE INDEX idx_virtual_try_on_created_at ON virtual_try_on(created_at);

-- Enable RLS
ALTER TABLE virtual_try_on ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own virtual try-on records
CREATE POLICY "Users can view own virtual try-on records" ON virtual_try_on
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own virtual try-on records
CREATE POLICY "Users can insert own virtual try-on records" ON virtual_try_on
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own virtual try-on records
CREATE POLICY "Users can update own virtual try-on records" ON virtual_try_on
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own virtual try-on records
CREATE POLICY "Users can delete own virtual try-on records" ON virtual_try_on
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all virtual try-on records
CREATE POLICY "Admins can view all virtual try-on records" ON virtual_try_on
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_virtual_try_on_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_virtual_try_on_updated_at
    BEFORE UPDATE ON virtual_try_on
    FOR EACH ROW
    EXECUTE FUNCTION update_virtual_try_on_updated_at();

-- Insert sample data (optional)
INSERT INTO virtual_try_on (user_id, uploaded_image_url, selected_outfit_id, result_image_url, status)
SELECT 
    p.id as user_id,
    'https://example.com/uploaded-image.jpg' as uploaded_image_url,
    o.id as selected_outfit_id,
    'https://example.com/result-image.jpg' as result_image_url,
    'completed' as status
FROM profiles p
CROSS JOIN outfits o
WHERE p.role = 'user'
LIMIT 3;
