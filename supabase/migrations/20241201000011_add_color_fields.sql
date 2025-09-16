-- Add new fields to colors table
ALTER TABLE colors 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS label TEXT;

-- Update existing records to have proper values
-- Set name and label to the same value for existing records
UPDATE colors 
SET 
  name = COALESCE(name, 'Unknown Color'),
  label = COALESCE(label, 'Unknown Color'),
  description = COALESCE(description, 'Color description')
WHERE name IS NULL OR label IS NULL;

-- Add constraints
ALTER TABLE colors 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN label SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_colors_name ON colors(name);
CREATE INDEX IF NOT EXISTS idx_colors_label ON colors(label);
