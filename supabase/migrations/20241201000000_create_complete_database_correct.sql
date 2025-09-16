-- Complete Database Schema for Lookify (Corrected Version)
-- This migration creates all tables with correct structure matching the existing code

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_role user_role DEFAULT 'user',
  bio TEXT,
  website TEXT,
  location TEXT,
  date_of_birth DATE,
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create colors table
CREATE TABLE IF NOT EXISTS colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create outfits table (CORRECTED - using foreign keys)
CREATE TABLE IF NOT EXISTS outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  season_id UUID REFERENCES seasons(id),
  color_id UUID REFERENCES colors(id),
  gender TEXT NOT NULL, -- 'male', 'female'
  image_url TEXT,
  ai_hint TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  saved_count INTEGER DEFAULT 0, -- Count of how many users saved this outfit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create outfit_categories junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS outfit_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(outfit_id, category_id)
);

-- Create outfit_items table
CREATE TABLE IF NOT EXISTS outfit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT,
  affiliate_links JSONB DEFAULT '[]'::jsonb, -- Array of {store: string, url: string}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  tags TEXT[],
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  cta TEXT,
  link TEXT,
  published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create likes table (for articles)
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL, -- 'article'
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- Create user_saved_outfits table
CREATE TABLE IF NOT EXISTS user_saved_outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, outfit_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_season_id ON outfits(season_id);
CREATE INDEX IF NOT EXISTS idx_outfits_color_id ON outfits(color_id);
CREATE INDEX IF NOT EXISTS idx_outfits_gender ON outfits(gender);
CREATE INDEX IF NOT EXISTS idx_outfits_is_public ON outfits(is_public);
CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON outfits(created_at);
CREATE INDEX IF NOT EXISTS idx_outfit_categories_outfit_id ON outfit_categories(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_categories_category_id ON outfit_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_outfits_user_id ON user_saved_outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_outfits_outfit_id ON user_saved_outfits(outfit_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON outfits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration (FIXED VERSION)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration (FIXED VERSION)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create helper functions
CREATE OR REPLACE FUNCTION increment_article_likes(article_id UUID)
RETURNS void AS $$
BEGIN
  -- This function is kept for potential future use with likes table
  -- Currently not used since we removed likes_count from articles
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_article_likes(article_id UUID)
RETURNS void AS $$
BEGIN
  -- This function is kept for potential future use with likes table
  -- Currently not used since we removed likes_count from articles
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_saved_count(outfit_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE outfits 
  SET saved_count = saved_count + 1 
  WHERE id = outfit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_saved_count(outfit_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE outfits 
  SET saved_count = GREATEST(saved_count - 1, 0) 
  WHERE id = outfit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_outfits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for categories, seasons, colors (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Seasons are viewable by everyone" ON seasons
  FOR SELECT USING (true);

CREATE POLICY "Colors are viewable by everyone" ON colors
  FOR SELECT USING (true);

-- Create RLS policies for outfits
CREATE POLICY "Public outfits are viewable by everyone" ON outfits
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own outfits" ON outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfits" ON outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" ON outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" ON outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outfit_categories
CREATE POLICY "Outfit categories are viewable by everyone" ON outfit_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_categories.outfit_id 
      AND (outfits.is_public = true OR outfits.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert categories to their own outfits" ON outfit_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_categories.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete categories from their own outfits" ON outfit_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_categories.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

-- Create RLS policies for outfit_items
CREATE POLICY "Outfit items are viewable by everyone" ON outfit_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND (outfits.is_public = true OR outfits.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert items to their own outfits" ON outfit_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their own outfits" ON outfit_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their own outfits" ON outfit_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

-- Create RLS policies for articles
CREATE POLICY "Published articles are viewable by everyone" ON articles
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own articles" ON articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" ON articles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON articles
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for likes
CREATE POLICY "Users can view their own likes" ON likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_saved_outfits
CREATE POLICY "Users can view their own saved outfits" ON user_saved_outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved outfits" ON user_saved_outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved outfits" ON user_saved_outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert default data
INSERT INTO categories (name, description) VALUES
  ('work/office', 'Professional and business attire'),
  ('casual', 'Relaxed everyday wear'),
  ('party/date', 'Special occasions and dating'),
  ('sport/active', 'Athletic and workout clothing'),
  ('tet', 'Traditional Vietnamese clothing'),
  ('game/anime', 'Gaming and anime-inspired outfits'),
  ('basic', 'Essential wardrobe pieces'),
  ('streetwear', 'Urban and street fashion'),
  ('elegant', 'Sophisticated and formal wear'),
  ('sporty', 'Casual athletic style'),
  ('beach', 'Beach and vacation wear')
ON CONFLICT (name) DO NOTHING;

INSERT INTO seasons (name, description) VALUES
  ('spring', 'Spring season clothing'),
  ('summer', 'Summer season clothing'),
  ('autumn', 'Autumn season clothing'),
  ('winter', 'Winter season clothing')
ON CONFLICT (name) DO NOTHING;

INSERT INTO colors (name, description) VALUES
  ('black', 'Black color scheme'),
  ('white', 'White color scheme'),
  ('pastel', 'Pastel color scheme'),
  ('earth-tone', 'Earth tone color scheme'),
  ('vibrant', 'Vibrant color scheme')
ON CONFLICT (name) DO NOTHING;

-- Grant execute permission on the trigger function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;


ALTER TABLE public.categories
ADD COLUMN label TEXT;


UPDATE categories SET label = 'Công sở' WHERE name = 'work/office';
UPDATE categories SET label = 'Thường ngày' WHERE name = 'casual';
UPDATE categories SET label = 'Tiệc / Hẹn hò' WHERE name = 'party/date';
UPDATE categories SET label = 'Thể thao' WHERE name = 'sport/active';
UPDATE categories SET label = 'Tết' WHERE name = 'tet';
UPDATE categories SET label = 'Game/Anime' WHERE name = 'game/anime';
UPDATE categories SET label = 'Cơ bản' WHERE name = 'basic';
UPDATE categories SET label = 'Dạo phố' WHERE name = 'streetwear';
UPDATE categories SET label = 'Thanh lịch' WHERE name = 'elegant';
UPDATE categories SET label = 'Năng động' WHERE name = 'sporty';
UPDATE categories SET label = 'Đi biển' WHERE name = 'beach';


ALTER TABLE colors ADD COLUMN IF NOT EXISTS label text;

UPDATE colors SET label = 'Đen' WHERE name = 'black';
UPDATE colors SET label = 'Trắng' WHERE name = 'white';
UPDATE colors SET label = 'Pastel' WHERE name = 'pastel';
UPDATE colors SET label = 'Tone đất' WHERE name = 'earth-tone';
UPDATE colors SET label = 'Rực rỡ' WHERE name = 'vibrant';

UPDATE colors
SET hex = CASE name
    WHEN 'black' THEN '#0f1117'
    WHEN 'white' THEN '#e5e7eb'
    WHEN 'pastel' THEN '#f3d6e4'
    WHEN 'earth-tone' THEN '#b9a18e'
    WHEN 'vibrant' THEN '#ff4d4d'
END
WHERE name IN ('black', 'white', 'pastel', 'earth-tone', 'vibrant');

