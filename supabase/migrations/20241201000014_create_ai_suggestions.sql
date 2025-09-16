-- Tạo enum type cho gender
CREATE TYPE gender_enum AS ENUM ('male', 'female');

-- Tạo enum type cho status
CREATE TYPE suggestion_status AS ENUM ('completed', 'failed', 'processing');

-- Tạo bảng ai_suggestions với foreign keys
CREATE TABLE ai_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Input fields với foreign keys
    gender gender_enum NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
    color_id UUID REFERENCES colors(id) ON DELETE RESTRICT,
    mood TEXT,

    -- User uploaded image
    user_image_url TEXT,

    -- AI generated output
    ai_generated_image_url TEXT NOT NULL,
    image_description TEXT,

    -- Metadata
    status suggestion_status NOT NULL DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes cho performance
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at ON ai_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_gender ON ai_suggestions(gender);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_category_id ON ai_suggestions(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_season_id ON ai_suggestions(season_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_color_id ON ai_suggestions(color_id);

-- Tạo RLS policies
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Users chỉ có thể xem gợi ý của chính họ
CREATE POLICY "Users can view their own AI suggestions" ON ai_suggestions
  FOR SELECT USING (auth.uid() = user_id);

-- Users chỉ có thể tạo gợi ý cho chính họ
CREATE POLICY "Users can insert their own AI suggestions" ON ai_suggestions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users chỉ có thể cập nhật gợi ý của chính họ
CREATE POLICY "Users can update their own AI suggestions" ON ai_suggestions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users chỉ có thể xóa gợi ý của chính họ
CREATE POLICY "Users can delete their own AI suggestions" ON ai_suggestions
  FOR DELETE USING (auth.uid() = user_id);

-- Tạo trigger cho updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_suggestions_updated_at
  BEFORE UPDATE ON ai_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
