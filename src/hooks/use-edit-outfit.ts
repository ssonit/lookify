import { useState } from 'react'
import { useOutfit } from './use-outfits'
import { useOutfitMutations } from './use-outfit-mutations'
import { useToast } from './use-toast'

export interface EditOutfitData {
  title?: string
  description?: string
  gender?: 'male' | 'female'
  season?: string
  color?: string
  image_url?: string
  ai_hint?: string
  categories?: string[]
  items?: Array<{
    id?: string
    name: string
    type: string
    image_url?: string
    affiliate_links: Array<{ store: string; url: string }>
  }>
}

export function useEditOutfit(outfitId: string) {
  const { toast } = useToast()
  const { outfit, isLoading: isLoadingOutfit, error: outfitError, mutate } = useOutfit(outfitId)
  const { updateOutfit } = useOutfitMutations()
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<Error | null>(null)

  const updateOutfitData = async (updates: EditOutfitData) => {
    if (!outfitId) {
      throw new Error('Outfit ID is required')
    }

    setIsUpdating(true)
    setUpdateError(null)

    try {
      const result = await updateOutfit(outfitId, updates)
      
      toast({
        title: "Thành công",
        description: "Outfit đã được cập nhật thành công!",
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật outfit'
      
      setUpdateError(error as Error)
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const resetError = () => {
    setUpdateError(null)
  }

  return {
    // Data
    outfit,
    
    // Loading states
    isLoading: isLoadingOutfit,
    isUpdating,
    
    // Error states
    error: outfitError,
    updateError,
    
    // Actions
    updateOutfit: updateOutfitData,
    resetError,
    mutate,
  }
}
