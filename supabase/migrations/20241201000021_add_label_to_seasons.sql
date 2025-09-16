-- Add label field to seasons table
ALTER TABLE seasons ADD COLUMN label TEXT;

-- Update existing seasons with Vietnamese labels
UPDATE seasons SET label = 'Xuân' WHERE name = 'Spring';
UPDATE seasons SET label = 'Hè' WHERE name = 'Summer';
UPDATE seasons SET label = 'Thu' WHERE name = 'Autumn';
UPDATE seasons SET label = 'Đông' WHERE name = 'Winter';

-- Make label NOT NULL after updating existing data
ALTER TABLE seasons ALTER COLUMN label SET NOT NULL;
