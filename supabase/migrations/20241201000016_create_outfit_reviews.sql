-- Create outfit_reviews table
CREATE TABLE outfit_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(outfit_id, user_id) -- One review per user per outfit
);

-- Create index for better performance
CREATE INDEX idx_outfit_reviews_outfit_id ON outfit_reviews(outfit_id);
CREATE INDEX idx_outfit_reviews_user_id ON outfit_reviews(user_id);
CREATE INDEX idx_outfit_reviews_created_at ON outfit_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE outfit_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view outfit reviews" ON outfit_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON outfit_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON outfit_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON outfit_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data (only if profiles exist)
INSERT INTO outfit_reviews (outfit_id, user_id, rating, comment) 
SELECT 
  o.id as outfit_id,
  p.id as user_id,
  5 as rating,
  'Outfit này phối đỉnh thật sự, mặc lên auto sang chảnh. Chất vải của áo khoác rất xịn.' as comment
FROM outfits o
CROSS JOIN profiles p
WHERE p.role = 'user' 
  AND p.full_name IS NOT NULL 
  AND p.full_name != ''
LIMIT 1;

INSERT INTO outfit_reviews (outfit_id, user_id, rating, comment) 
SELECT 
  o.id as outfit_id,
  p.id as user_id,
  4 as rating,
  'Khá ổn, nhưng quần hơi dài so với mình (m7). Bù lại áo thun chất mát, thấm hút mồ hôi tốt. Sẽ ủng hộ tiếp.' as comment
FROM outfits o
CROSS JOIN profiles p
WHERE p.role = 'user' 
  AND p.full_name IS NOT NULL 
  AND p.full_name != ''
  AND p.id != (SELECT user_id FROM outfit_reviews LIMIT 1)
LIMIT 1;
