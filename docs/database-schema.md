# Database Schema - Lookify

## Tổng quan

Database schema mới được thiết kế để hỗ trợ đầy đủ các tính năng của website Lookify với cấu trúc đơn giản và hiệu quả.

## Cấu trúc Database

### 1. Bảng `profiles`
Quản lý thông tin người dùng và authentication.

```sql
- id: UUID (Primary Key, Foreign Key to auth.users)
- email: TEXT
- full_name: TEXT
- avatar_url: TEXT
- role: user_role ('user' | 'admin')
- bio: TEXT
- website: TEXT
- location: TEXT
- date_of_birth: DATE
- phone: TEXT
- is_verified: BOOLEAN
- subscription_status: TEXT
- subscription_expires_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 2. Bảng `articles`
Quản lý bài viết và nội dung blog.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to profiles)
- title: TEXT
- content: TEXT
- excerpt: TEXT
- image_url: TEXT
- published: BOOLEAN
- is_featured: BOOLEAN
- views_count: INTEGER
- likes_count: INTEGER
- tags: TEXT[]
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 3. Bảng `outfits`
Quản lý outfit chính.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to profiles)
- title: TEXT
- description: TEXT
- image_url: TEXT
- tags: TEXT[]
- is_public: BOOLEAN
- views_count: INTEGER
- saved_count: INTEGER
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- category_id: UUID (Foreign Key to categories)
- season_id: UUID (Foreign Key to seasons)
- color_id: UUID (Foreign Key to colors)
- gender: TEXT ('male' | 'female' | 'unisex')
- difficulty_level: TEXT ('beginner' | 'intermediate' | 'advanced')
- price_range: TEXT ('budget' | 'mid-range' | 'luxury')
- ai_hint: TEXT
- is_ai_generated: BOOLEAN
```

### 4. Bảng `outfit_items`
Quản lý chi tiết từng item trong outfit.

```sql
- id: UUID (Primary Key)
- outfit_id: UUID (Foreign Key to outfits)
- name: TEXT
- type: TEXT ('top' | 'bottom' | 'dress' | 'shoes' | 'accessory' | 'outerwear')
- image_url: TEXT
- description: TEXT
- affiliate_links: JSONB (Array of affiliate links)
- position: INTEGER
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 5. Bảng `user_saved_outfits`
Quản lý outfits được user lưu lại.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to profiles)
- outfit_id: UUID (Foreign Key to outfits)
- created_at: TIMESTAMPTZ
```

### 6. Bảng `categories`
Quản lý danh mục outfit.

```sql
- id: UUID (Primary Key)
- name: TEXT (Unique)
- slug: TEXT (Unique)
- description: TEXT
- icon: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 7. Bảng `seasons`
Quản lý mùa trong năm.

```sql
- id: UUID (Primary Key)
- name: TEXT (Unique)
- slug: TEXT (Unique)
- description: TEXT
- created_at: TIMESTAMPTZ
```

### 8. Bảng `colors`
Quản lý màu sắc.

```sql
- id: UUID (Primary Key)
- name: TEXT (Unique)
- slug: TEXT (Unique)
- hex_code: TEXT
- created_at: TIMESTAMPTZ
```

## Affiliate Links Structure

Affiliate links được lưu trong cột `affiliate_links` của bảng `outfit_items` dưới dạng JSONB:

```json
[
  {
    "store": "Zara",
    "url": "https://www.zara.com/product/123"
  },
  {
    "store": "H&M",
    "url": "https://www.hm.com/product/456"
  }
]
```

## Helper Functions

### Views và Saves
- `increment_views(outfit_id)` - Tăng view count
- `increment_saved_count(outfit_id)` - Tăng saved count
- `decrement_saved_count(outfit_id)` - Giảm saved count
- `increment_article_views(article_id)` - Tăng article view count
- `increment_article_likes(article_id)` - Tăng article like count
- `decrement_article_likes(article_id)` - Giảm article like count

## Row Level Security (RLS)

### Public Access
- `categories`, `seasons`, `colors` - Tất cả user có thể đọc
- `outfit_items` - Tất cả user có thể đọc
- `outfits` - Chỉ outfit public mới hiển thị

### User Access
- `profiles` - User chỉ có thể xem/sửa profile của mình
- `user_saved_outfits` - User chỉ có thể quản lý saved outfits của mình

### Admin Access
- Admin có thể quản lý tất cả bảng
- Admin có thể xem tất cả outfits (kể cả private)

## Migration Files

1. `20241201000000_create_profiles_table.sql` - Tạo bảng profiles và auth setup
2. `20241201000001_update_user_role.sql` - Update user role
3. `20241201000002_enhance_outfit_system.sql` - Tạo hệ thống outfit mới
4. `20241201000003_migrate_outfit_data.sql` - Migrate dữ liệu mẫu
5. `20241201000004_add_helper_functions.sql` - Thêm helper functions

## Usage Examples

### Lấy outfits với filters
```typescript
import { OutfitService } from '@/lib/outfits-db'

// Lấy outfits theo category
const officeOutfits = await OutfitService.getOutfits({
  category: 'work-office',
  gender: 'male',
  limit: 10
})

// Lấy outfit chi tiết
const outfit = await OutfitService.getOutfitById('outfit-id')

// Lấy saved outfits của user
const savedOutfits = await OutfitService.getUserSavedOutfits('user-id', 10, 0)

// Toggle save outfit
const isSaved = await OutfitService.toggleSaveOutfit('outfit-id', 'user-id')

// Kiểm tra outfit đã được save chưa
const isSaved = await OutfitService.isSavedByUser('outfit-id', 'user-id')
```

### Tạo outfit mới
```typescript
const newOutfit = await OutfitService.createOutfit({
  user_id: 'user-id',
  title: 'Outfit mới',
  description: 'Mô tả outfit',
  category_id: 'category-id',
  season_id: 'season-id',
  color_id: 'color-id',
  gender: 'male',
  difficulty_level: 'beginner',
  price_range: 'mid-range',
  is_public: true
})
```

### Thêm item vào outfit
```typescript
await OutfitService.addOutfitItem({
  outfit_id: 'outfit-id',
  name: 'Áo sơ mi trắng',
  type: 'top',
  image_url: 'https://example.com/image.jpg',
  description: 'Áo sơ mi trắng cơ bản',
  affiliate_links: [
    { store: 'Zara', url: 'https://zara.com/product/123' },
    { store: 'H&M', url: 'https://hm.com/product/456' }
  ],
  position: 1
})
```

## Lưu ý

1. **Affiliate Links**: Chỉ lưu trong `outfit_items`, không cần bảng riêng
2. **Save System**: Thay thế like system bằng save system đơn giản hơn
3. **User Preferences**: Tạm thời không cần, có thể thêm sau
4. **AI Interactions**: Tạm thời không cần, có thể thêm sau
5. **User Activity**: Tạm thời không cần, có thể thêm sau

Database schema này đã đáp ứng đầy đủ các yêu cầu hiện tại của website với hệ thống save outfit thay vì like, và có thể mở rộng dễ dàng trong tương lai.
