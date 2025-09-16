
'use server';

import { suggestOutfit, type OutfitSuggestionInput } from '@/ai/flows/ai-outfit-suggester';
import { virtualTryOn } from '@/ai/flows/ai-virtual-try-on';
import { z } from 'zod';


// Schemas and types moved from virtual-try-on-flow.ts to avoid "use server" export errors.
const VirtualTryOnInputSchema = z.object({
  userImage: z
    .string()
    .describe(
      "A data URI of the user's photo, including a MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  outfitImage: z
    .string()
    .describe(
      "A data URI of the outfit's photo, including a MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VirtualTryOnInput = z.infer<typeof VirtualTryOnInputSchema>;

export async function getOutfitSuggestion(input: OutfitSuggestionInput) {
  try {
    const result = await suggestOutfit(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { success: false, error: 'Failed to get outfit suggestion. Please try again later.' };
  }
}

export async function tryOnOutfit(input: VirtualTryOnInput) {
    try {
        const result = await virtualTryOn(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI try-on error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Không thể thử trang phục. Lỗi: ${errorMessage}` };
    }
}
