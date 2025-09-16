-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  level VARCHAR(50),
  cta VARCHAR(100),
  link TEXT,
  -- SEO fields
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for search
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_articles_description ON articles USING gin(to_tsvector('english', description));

-- Create index for level filtering
CREATE INDEX IF NOT EXISTS idx_articles_level ON articles(level);

-- Create index for created_at ordering
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Insert sample data
INSERT INTO articles (title, description, image_url, tags, level, cta, link, seo_title, seo_description) VALUES
(
  'Cách chọn trang phục theo dáng người',
  'Phân loại cơ bản (V, A, H) và công thức chọn áo/quần tôn dáng.',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
  ARRAY['Video', '12:30'],
  'Starter',
  'Xem trên Youtube',
  'https://www.youtube.com/',
  'Bí quyết chọn đồ theo dáng người',
  'Hướng dẫn chi tiết cách chọn trang phục phù hợp với từng dáng người để tôn lên vẻ đẹp tự nhiên của bạn.'
),
(
  'Phối màu cơ bản & nâng cao',
  'Bánh xe màu, 60-30-10, tương phản/đồng sắc, tông da.',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  ARRAY['Hướng dẫn video', 'Bài viết'],
  '~45 phút',
  'Xem trên Youtube',
  'https://www.youtube.com/',
  'Học cách phối màu quần áo',
  'Tìm hiểu về bánh xe màu, quy tắc phối màu 60-30-10 và cách kết hợp màu sắc trang phục một cách hài hòa.'
),
(
  'Chăm sóc da & tóc',
  'Routine tối giản theo loại da, mẹo chọn sản phẩm giá hợp lý.',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80',
  ARRAY['Bài viết', 'Routine 7 bước'],
  'Everyday',
  'Xem trên Tiktok',
  'https://www.tiktok.com/',
  'Chăm sóc da và tóc đúng cách',
  'Routine chăm sóc da và tóc tối giản nhưng hiệu quả, phù hợp cho mọi loại da.'
),
(
  'Kỹ năng giao tiếp & tự tin',
  'Ngôn ngữ cơ thể, giọng nói, mô hình trả lời & luyện tập.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  ARRAY['Hướng dẫn video'],
  'Beginner-Intermediate',
  'Xem trên Tiktok',
  'https://www.tiktok.com/',
  'Cải thiện kỹ năng giao tiếp và sự tự tin',
  'Học các kỹ năng về ngôn ngữ cơ thể, giọng nói để trở nên tự tin hơn trong giao tiếp hàng ngày.'
);
