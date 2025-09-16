
'use server';
/**
 * @fileOverview An AI-powered outfit suggestion tool that generates an image of the outfit.
 *
 * - suggestOutfit - A function that suggests an outfit based on user preferences and generates an image.
 * - OutfitSuggestionInput - The input type for the suggestOutfit function.
 * - OutfitSuggestionOutput - The return type for the suggestOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutfitSuggestionInputSchema = z.object({
  gender: z.enum(['male', 'female']).describe('The gender of the user.'),
  category: z.string().describe('The category or occasion for the outfit.'),
  colorPreference: z.string().describe('The preferred color scheme for the outfit.'),
  season: z.string().describe('The season for which the outfit is intended.'),
  mood: z.string().optional().describe('The mood the user wants to express with the outfit, e.g., confident, comfortable, elegant, creative.'),
  userImage: z.string().url().optional().describe("A URL of the user's uploaded photo."),
});
export type OutfitSuggestionInput = z.infer<typeof OutfitSuggestionInputSchema>;

const OutfitSuggestionOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the AI-generated image of the outfit.'),
  imageDescription: z.string().describe('A short, descriptive caption for the generated image.'),
});
export type OutfitSuggestionOutput = z.infer<typeof OutfitSuggestionOutputSchema>;

export async function suggestOutfit(input: OutfitSuggestionInput): Promise<OutfitSuggestionOutput> {
  return suggestOutfitFlow(input);
}

const promptGenerationPrompt = ai.definePrompt({
    name: 'outfitImagePromptGenerator',
    input: {schema: OutfitSuggestionInputSchema},
    output: {schema: z.string().describe("A detailed, descriptive prompt for an image generation model. The prompt should describe a full-body fashion photography shot of a person wearing the described outfit. Include details about the clothing, style, colors, and a suitable background. Example: 'Full body fashion photo of a woman wearing an elegant pastel pink summer dress, strappy sandals, and a straw hat, walking on a sunny beach'.")},
    prompt: `You are an expert fashion stylist who creates prompts for an AI image generator. 
    Based on the following user preferences, create a single, detailed prompt to generate an image of a person wearing the perfect outfit.
    {{#if userImage}}
    The person in the generated image should look similar to the person in the provided photo.
    User's Photo URL: {{userImage}}
    {{/if}}
    Gender: {{{gender}}}
    Category: {{{category}}}
    {{#if colorPreference}}
    Color Preference: {{{colorPreference}}}
    {{/if}}
    Season: {{{season}}}
    {{#if mood}}
    Mood: {{{mood}}}
    {{/if}}

    The prompt must describe a full-body fashion photo, including clothing items, colors, style, and a suitable background.
    `,
});


const suggestOutfitFlow = ai.defineFlow(
  {
    name: 'suggestOutfitFlow',
    inputSchema: OutfitSuggestionInputSchema,
    outputSchema: OutfitSuggestionOutputSchema,
  },
  async input => {

    const safeInput = {
      gender: input.gender || "female",
      category: input.category || "casual",
      season: input.season || "spring",
      colorPreference: input.colorPreference || "neutral colors",
      mood: input.mood || "classic",
      userImage: input.userImage,
    };
    // Step 1: Generate a prompt for the image model
    let imagePrompt: string | null = null;
    try {
      const promptResult = await promptGenerationPrompt(safeInput);
      imagePrompt = typeof promptResult?.output === 'string' ? promptResult.output : null;
    } catch (err) {
      // If the prompt generation fails schema validation, fall back to a deterministic prompt
      imagePrompt = null;
    }

    if (!imagePrompt) {
      const userImageHint = safeInput.userImage ? `Use the person's appearance from this photo URL: ${safeInput.userImage}.` : '';
      const moodHint = safeInput.mood ? `The mood should feel ${safeInput.mood}.` : '';
      imagePrompt = `Full body fashion photograph of a ${safeInput.gender} styled for ${safeInput.category} in ${safeInput.season}. Outfit uses ${safeInput.colorPreference}. ${moodHint} ${userImageHint} High-quality studio lighting, natural pose, clean background, editorial style.`.trim();
    }
    
    // Step 2: Generate the image using the prompt
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [{ text: imagePrompt }],
      config: {
        responseModalities: ['IMAGE'],
      }
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed.');
    }

    // Step 3: Return the generated image URL and a description
    return {
      imageUrl: media.url,
      imageDescription: imagePrompt, // We can use the detailed prompt as the description
    };
  }
);
