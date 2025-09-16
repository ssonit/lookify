# Hooks Usage Guide - Lookify

## Tổng quan

Thay vì sử dụng class-based services, chúng ta sử dụng React hooks kết hợp với SWR để quản lý data fetching và caching. Điều này giúp:

- **Tự động caching** - SWR cache data và revalidate khi cần
- **Real-time updates** - Tự động cập nhật UI khi data thay đổi
- **Error handling** - Xử lý lỗi một cách nhất quán
- **Loading states** - Quản lý trạng thái loading tự động
- **Optimistic updates** - Cập nhật UI ngay lập tức

## Cấu trúc Hooks

### 1. Data Hooks (SWR)
- `useOutfits()` - Lấy danh sách outfits
- `useOutfit(id)` - Lấy outfit theo ID
- `useCategories()` - Lấy danh mục
- `useSeasons()` - Lấy mùa
- `useColors()` - Lấy màu sắc
- `useUserSavedOutfits(userId)` - Lấy outfits đã save
- `useIsOutfitSaved(outfitId, userId)` - Kiểm tra outfit đã save chưa

### 2. Mutation Hooks
- `useOutfitMutations()` - Mutations cho outfits
- `useArticleMutations()` - Mutations cho articles
- `useProfileMutations()` - Mutations cho profiles

## Usage Examples

### Basic Data Fetching

```typescript
import { useOutfits, useCategories } from '@/hooks'

function OutfitList() {
  const { data: outfits, isLoading, error } = useOutfits({
    category: 'work-office',
    gender: 'male',
    limit: 10
  })

  const { data: categories } = useCategories()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {outfits?.map(outfit => (
        <div key={outfit.id}>
          <h3>{outfit.title}</h3>
          <p>{outfit.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### Mutations với Cache Management

```typescript
import { useOutfitMutations, useOutfits } from '@/hooks'

function CreateOutfitForm() {
  const { createOutfit } = useOutfitMutations()
  const { mutate } = useSWRConfig()

  const handleSubmit = async (formData) => {
    try {
      await createOutfit({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        // ... other fields
      })
      
      // SWR sẽ tự động revalidate cache
      toast.success('Outfit created successfully!')
    } catch (error) {
      toast.error('Failed to create outfit')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### Save/Unsave Outfit

```typescript
import { useIsOutfitSaved, useOutfitMutations } from '@/hooks'

function OutfitCard({ outfit, userId }) {
  const { data: isSaved, isLoading: savedLoading } = useIsOutfitSaved(
    outfit.id, 
    userId
  )
  const { toggleSaveOutfit } = useOutfitMutations()

  const handleSave = async () => {
    try {
      await toggleSaveOutfit(outfit.id, userId)
    } catch (error) {
      console.error('Error saving outfit:', error)
    }
  }

  return (
    <div>
      <h3>{outfit.title}</h3>
      <button 
        onClick={handleSave}
        disabled={savedLoading}
        className={isSaved ? 'saved' : 'not-saved'}
      >
        {isSaved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}
```

### Conditional Data Fetching

```typescript
import { useUserSavedOutfits } from '@/hooks'

function SavedOutfitsList({ userId }) {
  // Chỉ fetch khi có userId
  const { data: savedOutfits, isLoading } = useUserSavedOutfits(
    userId, // null/undefined sẽ không fetch
    10,     // limit
    0       // offset
  )

  if (!userId) {
    return <div>Please login to view saved outfits</div>
  }

  if (isLoading) return <div>Loading saved outfits...</div>

  return (
    <div>
      {savedOutfits?.map(outfit => (
        <div key={outfit.id}>{outfit.title}</div>
      ))}
    </div>
  )
}
```

### Error Handling

```typescript
import { useOutfits } from '@/hooks'

function OutfitGallery() {
  const { data: outfits, error, isLoading } = useOutfits()

  if (error) {
    return (
      <div className="error">
        <h3>Failed to load outfits</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading outfits...</div>
  }

  return (
    <div>
      {outfits?.map(outfit => (
        <div key={outfit.id}>{outfit.title}</div>
      ))}
    </div>
  )
}
```

## SWR Configuration

### Global Configuration

```typescript
// src/providers/swr-provider.tsx
import { SWRConfig } from 'swr'

export function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        onError: (error) => {
          console.error('SWR Error:', error)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

### Custom Fetcher

```typescript
// src/utils/swr/fetcher.ts
export const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}
```

## Best Practices

### 1. Conditional Fetching
```typescript
// ✅ Good - Chỉ fetch khi có điều kiện
const { data } = useOutfit(userId ? outfitId : null)

// ❌ Bad - Luôn fetch
const { data } = useOutfit(outfitId)
```

### 2. Error Boundaries
```typescript
// Wrap components với error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <OutfitList />
</ErrorBoundary>
```

### 3. Loading States
```typescript
// ✅ Good - Hiển thị loading state
if (isLoading) return <Skeleton />

// ❌ Bad - Không xử lý loading
return <div>{data?.title}</div>
```

### 4. Optimistic Updates
```typescript
const { toggleSaveOutfit } = useOutfitMutations()

const handleSave = async () => {
  // Optimistic update
  setIsSaved(!isSaved)
  
  try {
    await toggleSaveOutfit(outfitId, userId)
  } catch (error) {
    // Revert on error
    setIsSaved(isSaved)
    toast.error('Failed to save outfit')
  }
}
```

## Migration từ Class-based Services

### Before (Class-based)
```typescript
// ❌ Old way
const outfits = await OutfitService.getOutfits({ category: 'work' })
```

### After (Hooks)
```typescript
// ✅ New way
const { data: outfits, isLoading, error } = useOutfits({ 
  category: 'work' 
})
```

## Performance Tips

1. **Use SWR keys properly** - Đảm bảo keys unique và consistent
2. **Implement pagination** - Sử dụng limit/offset cho large datasets
3. **Cache invalidation** - Sử dụng mutate() để invalidate cache khi cần
4. **Preloading** - Sử dụng SWR's preload() cho critical data
5. **Deduplication** - SWR tự động dedupe requests với cùng key

## Troubleshooting

### Common Issues

1. **Infinite re-renders**
   ```typescript
   // ❌ Bad - Object/array trong dependency
   const filters = { category: 'work' }
   const { data } = useOutfits(filters)
   
   // ✅ Good - Stable reference
   const filters = useMemo(() => ({ category: 'work' }), [])
   const { data } = useOutfits(filters)
   ```

2. **Stale data**
   ```typescript
   // Force revalidation
   const { mutate } = useSWRConfig()
   mutate(['outfits'])
   ```

3. **Memory leaks**
   ```typescript
   // SWR tự động cleanup, nhưng có thể manual cleanup
   useEffect(() => {
     return () => {
       // cleanup logic
     }
   }, [])
   ```
