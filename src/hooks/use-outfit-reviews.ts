import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'

export interface OutfitReview {
  id: string
  outfit_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export interface ReviewsResponse {
  reviews: OutfitReview[]
  averageRating: number
  totalCount: number
}

export function useOutfitReviews(outfitId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    outfitId ? `outfit-reviews-${outfitId}` : null,
    async () => {
      if (!outfitId) return null
      
      const supabase = createClient()
      
      // Get reviews with user info
      const { data: reviews, error: reviewsError } = await supabase
        .from('outfit_reviews')
        .select(`
          id,
          outfit_id,
          user_id,
          rating,
          comment,
          created_at,
          updated_at,
          profiles!outfit_reviews_user_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: false })

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw reviewsError;
      }

      console.log('Raw reviews data:', reviews);

      // Calculate average rating
      const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0

      const processedReviews = (reviews || []).map(review => {
        console.log('Processing review:', review);
        console.log('Review profiles:', review.profiles);
        
        // Handle case where profiles might be an array or object
        const profile = Array.isArray(review.profiles) 
          ? review.profiles[0] 
          : review.profiles;
        
        return {
          ...review,
          profiles: profile || { id: '', full_name: 'Unknown', avatar_url: null }
        };
      });

      console.log('Processed reviews:', processedReviews);

      return {
        reviews: processedReviews,
        averageRating: Number(averageRating.toFixed(1)),
        totalCount: reviews?.length || 0
      } as ReviewsResponse
    }
  )

  return {
    reviews: data?.reviews || [],
    averageRating: data?.averageRating || 0,
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    mutate
  }
}

export function useCreateOutfitReview() {
  const supabase = createClient()

  const createReview = async (outfitId: string, rating: number, comment: string) => {
    try {
      console.log('Creating review with:', { outfitId, rating, comment });
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Failed to get user: ' + userError.message);
      }
      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('User ID:', user.id);

      const { data, error } = await supabase
        .from('outfit_reviews')
        .insert({
          outfit_id: outfitId,
          user_id: user.id,
          rating,
          comment
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating review:', error);
        throw new Error('Failed to create review: ' + error.message);
      }

      console.log('Review created successfully:', data);
      return data
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  return { createReview }
}
