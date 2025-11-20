'use server';
/**
 * @fileOverview Personalized activity recommendations flow for hotel guests.
 *
 * - getActivityRecommendations - A function that returns personalized activity recommendations based on guest preferences.
 * - ActivityRecommendationsInput - The input type for the getActivityRecommendations function.
 * - ActivityRecommendationsOutput - The return type for the getActivityRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivityRecommendationsInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'A description of the guest\u2019s preferences and interests, including desired activity types, location preferences, and budget.'
    ),
  stayDuration: z.string().describe('The duration of the guest\u2019s stay in days.'),
});
export type ActivityRecommendationsInput = z.infer<typeof ActivityRecommendationsInputSchema>;

const ActivityRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized activity recommendations tailored to the guest\u2019s preferences and stay duration.'
    ),
});
export type ActivityRecommendationsOutput = z.infer<typeof ActivityRecommendationsOutputSchema>;

export async function getActivityRecommendations(
  input: ActivityRecommendationsInput
): Promise<ActivityRecommendationsOutput> {
  return activityRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'activityRecommendationsPrompt',
  input: {schema: ActivityRecommendationsInputSchema},
  output: {schema: ActivityRecommendationsOutputSchema},
  prompt: `You are an AI travel assistant specializing in curating personalized activity recommendations for hotel guests.

  Based on the guest's preferences, interests, and stay duration, provide a list of tailored activity recommendations. Consider a variety of options, including local attractions, dining experiences, and recreational activities, ensuring they align with the guest's stated preferences and the length of their stay.

  Preferences: {{{preferences}}}
  Stay Duration: {{{stayDuration}}} days
  Hotel: Hotel Karibuni

  Recommendations:
`,
});

const activityRecommendationsFlow = ai.defineFlow(
  {
    name: 'activityRecommendationsFlow',
    inputSchema: ActivityRecommendationsInputSchema,
    outputSchema: ActivityRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
