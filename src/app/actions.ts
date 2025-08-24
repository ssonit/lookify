'use server';

import { suggestOutfit, type OutfitSuggestionInput } from '@/ai/flows/ai-outfit-suggester';

export async function getOutfitSuggestion(input: OutfitSuggestionInput) {
  try {
    const result = await suggestOutfit(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { success: false, error: 'Failed to get outfit suggestion. Please try again later.' };
  }
}
