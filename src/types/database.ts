export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          user_role: 'user' | 'admin'
          bio: string | null
          website: string | null
          location: string | null
          date_of_birth: string | null
          phone: string | null
          is_verified: boolean
          subscription_status: string
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          user_role?: 'user' | 'admin'
          bio?: string | null
          website?: string | null
          location?: string | null
          date_of_birth?: string | null
          phone?: string | null
          is_verified?: boolean
          subscription_status?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          user_role?: 'user' | 'admin'
          bio?: string | null
          website?: string | null
          location?: string | null
          date_of_birth?: string | null
          phone?: string | null
          is_verified?: boolean
          subscription_status?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          label: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          description?: string | null
          created_at?: string
        }
      }
      seasons: {
        Row: {
          id: string
          name: string
          label: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          description?: string | null
          created_at?: string
        }
      }
      colors: {
        Row: {
          id: string
          name: string
          label: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          description?: string | null
          created_at?: string
        }
      }
      outfits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          season_id: string | null
          color_id: string | null
          gender: string
          image_url: string | null
          ai_hint: string | null
          is_ai_generated: boolean
          is_public: boolean
          saved_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          season_id?: string | null
          color_id?: string | null
          gender: string
          image_url?: string | null
          ai_hint?: string | null
          is_ai_generated?: boolean
          is_public?: boolean
          saved_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          season_id?: string | null
          color_id?: string | null
          gender?: string
          image_url?: string | null
          ai_hint?: string | null
          is_ai_generated?: boolean
          is_public?: boolean
          saved_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      outfit_categories: {
        Row: {
          id: string
          outfit_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          outfit_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          outfit_id?: string
          category_id?: string
          created_at?: string
        }
      }
      outfit_items: {
        Row: {
          id: string
          outfit_id: string
          name: string
          type: string
          image_url: string | null
          affiliate_links: any
          created_at: string
        }
        Insert: {
          id?: string
          outfit_id: string
          name: string
          type: string
          image_url?: string | null
          affiliate_links?: any
          created_at?: string
        }
        Update: {
          id?: string
          outfit_id?: string
          name?: string
          type?: string
          image_url?: string | null
          affiliate_links?: any
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string | null
          image_url: string | null
          tags: string[]
          level: string
          cta: string | null
          link: string | null
          published: boolean
          is_featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          content?: string | null
          image_url?: string | null
          tags?: string[]
          level?: string
          cta?: string | null
          link?: string | null
          published?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          content?: string | null
          image_url?: string | null
          tags?: string[]
          level?: string
          cta?: string | null
          link?: string | null
          published?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          target_type: string
          target_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: string
          target_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: string
          target_id?: string
          created_at?: string
        }
      }
      user_saved_outfits: {
        Row: {
          id: string
          user_id: string
          outfit_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          outfit_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          outfit_id?: string
          created_at?: string
        }
      }
      ai_suggestions: {
        Row: {
          id: string
          user_id: string
          gender: 'male' | 'female'
          category_id: string
          season_id: string
          color_id: string | null
          mood: string | null
          user_image_url: string | null
          ai_generated_image_url: string
          image_description: string | null
          status: 'completed' | 'failed' | 'processing'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gender: 'male' | 'female'
          category_id: string
          season_id: string
          color_id?: string | null
          mood?: string | null
          user_image_url?: string | null
          ai_generated_image_url: string
          image_description?: string | null
          status?: 'completed' | 'failed' | 'processing'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gender?: 'male' | 'female'
          category_id?: string
          season_id?: string
          color_id?: string | null
          mood?: string | null
          user_image_url?: string | null
          ai_generated_image_url?: string
          image_description?: string | null
          status?: 'completed' | 'failed' | 'processing'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
      gender_enum: 'male' | 'female'
      season_enum: 'spring' | 'summer' | 'autumn' | 'winter'
      suggestion_status: 'completed' | 'failed' | 'processing'
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific table types
export type Profile = Tables<'profiles'>
export type Category = Tables<'categories'>
export type Season = Tables<'seasons'>
export type Color = Tables<'colors'>
export type Outfit = Tables<'outfits'>
export type OutfitCategory = Tables<'outfit_categories'>
export type OutfitItem = Tables<'outfit_items'>
export type Article = Tables<'articles'>
export type Like = Tables<'likes'>
export type UserSavedOutfit = Tables<'user_saved_outfits'>
export type AISuggestion = Tables<'ai_suggestions'>

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type SeasonInsert = Database['public']['Tables']['seasons']['Insert']
export type ColorInsert = Database['public']['Tables']['colors']['Insert']
export type OutfitInsert = Database['public']['Tables']['outfits']['Insert']
export type OutfitCategoryInsert = Database['public']['Tables']['outfit_categories']['Insert']
export type OutfitItemInsert = Database['public']['Tables']['outfit_items']['Insert']
export type ArticleInsert = Database['public']['Tables']['articles']['Insert']
export type LikeInsert = Database['public']['Tables']['likes']['Insert']
export type UserSavedOutfitInsert = Database['public']['Tables']['user_saved_outfits']['Insert']
export type AISuggestionInsert = Database['public']['Tables']['ai_suggestions']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type SeasonUpdate = Database['public']['Tables']['seasons']['Update']
export type ColorUpdate = Database['public']['Tables']['colors']['Update']
export type OutfitUpdate = Database['public']['Tables']['outfits']['Update']
export type OutfitCategoryUpdate = Database['public']['Tables']['outfit_categories']['Update']
export type OutfitItemUpdate = Database['public']['Tables']['outfit_items']['Update']
export type ArticleUpdate = Database['public']['Tables']['articles']['Update']
export type LikeUpdate = Database['public']['Tables']['likes']['Update']
export type UserSavedOutfitUpdate = Database['public']['Tables']['user_saved_outfits']['Update']
export type AISuggestionUpdate = Database['public']['Tables']['ai_suggestions']['Update']

// Extended types with relations
export type OutfitWithDetails = Outfit & {
  season?: Season
  color?: Color
  categories?: Category[]
  items?: OutfitItem[]
  user?: Profile
}

export type OutfitItemWithOutfit = OutfitItem & {
  outfit?: Outfit
}

export type ArticleWithAuthor = Article & {
  user?: Profile
}

// Affiliate link type
export interface AffiliateLink {
  store: string
  url: string
}