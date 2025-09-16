-- Add label field to categories table
ALTER TABLE categories ADD COLUMN label TEXT;

-- Update existing categories with Vietnamese labels
UPDATE categories SET label = 'Thường ngày' WHERE name = 'Casual';
UPDATE categories SET label = 'Công sở' WHERE name = 'Formal';
UPDATE categories SET label = 'Kinh doanh' WHERE name = 'Business';
UPDATE categories SET label = 'Tiệc tùng' WHERE name = 'Party';
UPDATE categories SET label = 'Cưới hỏi' WHERE name = 'Wedding';
UPDATE categories SET label = 'Hẹn hò' WHERE name = 'Date';
UPDATE categories SET label = 'Du lịch' WHERE name = 'Travel';
UPDATE categories SET label = 'Thể thao' WHERE name = 'Workout';
UPDATE categories SET label = 'Đường phố' WHERE name = 'Streetwear';
UPDATE categories SET label = 'Cổ điển' WHERE name = 'Vintage';
UPDATE categories SET label = 'Bohemian' WHERE name = 'Bohemian';
UPDATE categories SET label = 'Tối giản' WHERE name = 'Minimalist';

-- Make categories label NOT NULL after updating existing data
ALTER TABLE categories ALTER COLUMN label SET NOT NULL;

-- Add label field to colors table
ALTER TABLE colors ADD COLUMN label TEXT;

-- Update existing colors with Vietnamese labels
UPDATE colors SET label = 'Đỏ' WHERE name = 'Red';
UPDATE colors SET label = 'Xanh dương' WHERE name = 'Blue';
UPDATE colors SET label = 'Xanh lá' WHERE name = 'Green';
UPDATE colors SET label = 'Vàng' WHERE name = 'Yellow';
UPDATE colors SET label = 'Tím' WHERE name = 'Purple';
UPDATE colors SET label = 'Hồng' WHERE name = 'Pink';
UPDATE colors SET label = 'Đen' WHERE name = 'Black';
UPDATE colors SET label = 'Trắng' WHERE name = 'White';
UPDATE colors SET label = 'Xám' WHERE name = 'Gray';
UPDATE colors SET label = 'Nâu' WHERE name = 'Brown';
UPDATE colors SET label = 'Cam' WHERE name = 'Orange';
UPDATE colors SET label = 'Xanh navy' WHERE name = 'Navy';

-- Make colors label NOT NULL after updating existing data
ALTER TABLE colors ALTER COLUMN label SET NOT NULL;
