
'use server';
/**
 * @fileOverview An AI-powered outfit suggestion tool.
 *
 * - suggestOutfit - A function that suggests an outfit based on user preferences.
 * - OutfitSuggestionInput - The input type for the suggestOutfit function.
 * - OutfitSuggestionOutput - The return type for the suggestOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutfitSuggestionInputSchema = z.object({
  gender: z.enum(['male', 'female']).describe('The gender of the user.'),
  category: z.enum(['work/office', 'casual', 'party/date', 'sport/active', 'basic', 'streetwear', 'elegant', 'sporty']).describe('The category or occasion for the outfit.'),
  colorPreference: z.string().describe('The preferred color scheme for the outfit.'),
  season: z.enum(['spring', 'summer', 'autumn', 'winter']).describe('The season for which the outfit is intended.'),
  mood: z.string().optional().describe('The mood the user wants to express with the outfit, e.g., confident, comfortable, elegant, creative.'),
});
export type OutfitSuggestionInput = z.infer<typeof OutfitSuggestionInputSchema>;

const OutfitSuggestionOutputSchema = z.object({
  outfitDescription: z.string().describe('A detailed description of the suggested outfit, including item descriptions, colors, and styling tips.'),
  keyItems: z.array(z.string()).describe('A list of the key items in the suggested outfit.'),
  colors: z.array(z.string()).describe('A list of the colors in the suggested outfit.'),
  stylingTips: z.string().describe('Styling tips for wearing the suggested outfit.'),
  imageUrl: z.string().optional().describe('An optional URL to an image of the suggested outfit.'),
});
export type OutfitSuggestionOutput = z.infer<typeof OutfitSuggestionOutputSchema>;

export async function suggestOutfit(input: OutfitSuggestionInput): Promise<OutfitSuggestionOutput> {
  return suggestOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'outfitSuggestionPrompt',
  input: {schema: OutfitSuggestionInputSchema},
  output: {schema: OutfitSuggestionOutputSchema},
  prompt: `You are a personal stylist helping users find stylish outfits.

  Suggest an outfit based on the following preferences:

  Gender: {{{gender}}}
  Category: {{{category}}}
  Color Preference: {{{colorPreference}}}
  Season: {{{season}}}
  {{#if mood}}
  Mood: {{{mood}}}
  {{/if}}

  Provide a detailed description of the outfit, including item descriptions, colors, and styling tips. Also, list the key items in the outfit and the colors used.
  Return the data in the format specified by the schema.`, // Ensure the prompt asks for structured output to match the schema
});

const suggestOutfitFlow = ai.defineFlow(
  {
    name: 'suggestOutfitFlow',
    inputSchema: OutfitSuggestionInputSchema,
    outputSchema: OutfitSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
