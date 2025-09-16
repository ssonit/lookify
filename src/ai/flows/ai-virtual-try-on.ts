
'use server';
/**
 * @fileOverview An AI-powered virtual try-on tool.
 *
 * - virtualTryOn - A function that applies a selected outfit to a user's photo.
 * - VirtualTryOnInput - The input type for the virtualTryOn function.
 * - VirtualTryOnOutput - The return type for the virtualTryOn function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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
type VirtualTryOnInput = z.infer<typeof VirtualTryOnInputSchema>;

const VirtualTryOnOutputSchema = z.object({
  resultImage: z.string().describe("The data URI of the resulting image with the outfit applied."),
});
type VirtualTryOnOutput = z.infer<typeof VirtualTryOnOutputSchema>;


export async function virtualTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnOutput> {
  return virtualTryOnFlow(input);
}

const promptText = "Take the outfit from the second image and realistically apply it to the person in the first image. Maintain the original background and the person's pose. The result should be a photorealistic image of the person wearing the new outfit."

const virtualTryOnFlow = ai.defineFlow(
  {
    name: 'virtualTryOnFlow',
    inputSchema: VirtualTryOnInputSchema,
    outputSchema: VirtualTryOnOutputSchema,
  },
  async ({ userImage, outfitImage }) => {
    try {
      console.log('Starting AI generation with Gemini 2.5 Flash Image Preview...');
      console.log('User image length:', userImage.length);
      console.log('Outfit image length:', outfitImage.length);
      
      const { media } = await ai.generate({
          model: 'googleai/gemini-2.5-flash-image-preview',
          prompt: [
              { media: { url: userImage } },
              { media: { url: outfitImage } },
              { text: promptText },
          ],
          config: {
              responseModalities: ['IMAGE'],
          },
      });

      console.log('AI generation completed, media:', media);

      if (!media?.url) {
          console.error('No media URL returned from AI generation');
          throw new Error('Image generation failed to produce an output.');
      }

      console.log('AI generation successful, result URL:', media.url);
      return { resultImage: media.url };
    } catch (error) {
      console.error('Error in AI generation:', error);
      throw error;
    }
  }
);
