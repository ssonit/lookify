// Outfit related types
export interface OutfitItem {
  id: string;
  outfit_id: string;
  name: string;
  type: string;
  image_url: string | null;
  affiliate_links: AffiliateLink[] | null;
  created_at: string;
}

export interface AffiliateLink {
  store: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  description: string | null;
  created_at: string;
}

export interface Season {
  id: string;
  name: string;
  label: string;
  description: string | null;
  created_at: string;
}

export interface Color {
  id: string;
  name: string;
  label: string;
  description: string | null;
  hex: string;
  created_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  season_id: string | null;
  color_id: string | null;
  gender: string;
  image_url: string | null;
  ai_hint: string | null;
  is_ai_generated: boolean;
  is_public: boolean;
  saved_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  season?: Season | string;
  color?: Color | string;
  categories?: Category[] | string[];
  items?: OutfitItem[];
  // Raw relations from Supabase
  outfit_categories?: Array<{
    id: string;
    categories: { id: string; name: string; label: string };
  }>;
  seasons?: { id: string; name: string; label: string };
  colors?: { id: string; name: string; label: string; hex: string };
}

// Extended outfit with all relations
export interface OutfitWithDetails extends Outfit {
  season: Season;
  color: Color;
  categories: Category[];
  items: OutfitItem[];
}

// For outfit cards (simplified)
export interface OutfitCardData {
  id: string;
  title: string;
  image_url: string | null;
  categories: string[];
  season: string;
  color: string;
  gender: string;
  ai_hint: string | null;
  saved_count: number;
}

// For outfit sections
export interface OutfitSection {
  title: string;
  outfits: Outfit[];
  viewAllLink: string;
}
