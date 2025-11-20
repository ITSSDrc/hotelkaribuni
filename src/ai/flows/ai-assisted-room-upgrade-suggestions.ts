'use server';
/**
 * @fileOverview Provides AI-assisted room upgrade suggestions based on guest profile and booking details.
 *
 * - aiAssistedRoomUpgradeSuggestions - A function that suggests room upgrades.
 * - RoomUpgradeSuggestionsInput - The input type for the aiAssistedRoomUpgradeSuggestions function.
 * - RoomUpgradeSuggestionsOutput - The return type for the aiAssistedRoomUpgradeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoomUpgradeSuggestionsInputSchema = z.object({
  guestProfile: z
    .object({
      age: z.number().describe('The age of the guest.'),
      interests: z.array(z.string()).describe('The interests of the guest.'),
      previousStays: z
        .number()
        .describe('The number of previous stays at the hotel.'),
      spendingHabits: z
        .string()
        .describe('The spending habits of the guest.'),
    })
    .describe('The profile of the guest.'),
  bookingDetails: z
    .object({
      roomType: z.string().describe('The type of room currently booked.'),
      numberOfNights: z
        .number()
        .describe('The number of nights the guest is staying.'),
      purposeOfStay: z.string().describe('The purpose of the stay (e.g., business, leisure).'),
      budget: z.string().describe('The budget of the guest.'),
    })
    .describe('The booking details of the guest.'),
});
export type RoomUpgradeSuggestionsInput = z.infer<
  typeof RoomUpgradeSuggestionsInputSchema
>;

const RoomUpgradeSuggestionsOutputSchema = z.object({
  upgradeSuggestions: z
    .array(z.string())
    .describe('An array of suggested room upgrades.'),
  reasoning: z.string().describe('The reasoning behind the upgrade suggestions.'),
});
export type RoomUpgradeSuggestionsOutput = z.infer<
  typeof RoomUpgradeSuggestionsOutputSchema
>;

export async function aiAssistedRoomUpgradeSuggestions(
  input: RoomUpgradeSuggestionsInput
): Promise<RoomUpgradeSuggestionsOutput> {
  return roomUpgradeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roomUpgradeSuggestionsPrompt',
  input: {schema: RoomUpgradeSuggestionsInputSchema},
  output: {schema: RoomUpgradeSuggestionsOutputSchema},
  prompt: `You are an AI assistant that suggests room upgrades for hotel guests.

  Based on the guest's profile and booking details, suggest relevant room upgrades.

  Guest Profile:
  Age: {{{guestProfile.age}}}
  Interests: {{#each guestProfile.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Previous Stays: {{{guestProfile.previousStays}}}
  Spending Habits: {{{guestProfile.spendingHabits}}}

  Booking Details:
  Room Type: {{{bookingDetails.roomType}}}
  Number of Nights: {{{bookingDetails.numberOfNights}}}
  Purpose of Stay: {{{bookingDetails.purposeOfStay}}}
  Budget: {{{bookingDetails.budget}}}

  Consider the guest's interests, spending habits, and the purpose of their stay when suggesting upgrades.
  Provide a brief reasoning for each suggestion.

  Output format:
  {
    "upgradeSuggestions": ["Room Upgrade 1", "Room Upgrade 2"],
    "reasoning": "Reasoning for the suggestions."
  }`,
});

const roomUpgradeSuggestionsFlow = ai.defineFlow(
  {
    name: 'roomUpgradeSuggestionsFlow',
    inputSchema: RoomUpgradeSuggestionsInputSchema,
    outputSchema: RoomUpgradeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
