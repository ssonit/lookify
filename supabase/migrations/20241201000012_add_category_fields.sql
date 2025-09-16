-- Add missing fields to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS label TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing records to have proper values
UPDATE categories 
SET 
  label = COALESCE(label, name),
  updated_at = COALESCE(updated_at, created_at)
WHERE label IS NULL OR updated_at IS NULL;

-- Add constraints
ALTER TABLE categories 
ALTER COLUMN label SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_label ON categories(label);
