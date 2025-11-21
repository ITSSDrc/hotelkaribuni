'use server';
/**
 * @fileOverview A secure flow for adding new rooms.
 *
 * - addRoom - Adds a room to Firestore.
 * - AddRoomInput - The input type for the addRoom function.
 * - AddRoomOutput - The return type for the addRoom function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Define the input schema for the flow
export const AddRoomInputSchema = z.object({
  name: z.string(),
  type: z.enum(['Standard', 'Deluxe', 'Suite']),
  price: z.number(),
  description: z.string(),
  imageUrl: z.string().url(),
  status: z.enum(['Disponible', 'Occupée', 'En nettoyage']),
});
export type AddRoomInput = z.infer<typeof AddRoomInputSchema>;

// Define the output schema for the flow
export const AddRoomOutputSchema = z.object({
  roomId: z.string().optional(),
  error: z.string().optional(),
});
export type AddRoomOutput = z.infer<typeof AddRoomOutputSchema>;

// Initialize Firebase Admin SDK only if it hasn't been already.
if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (!serviceAccountJson) {
    throw new Error(
      'Firebase Admin SDK config is missing from environment variables.'
    );
  }
  const serviceAccount = JSON.parse(serviceAccountJson);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminFirestore = getFirestore();

// Main exported function that wraps the Genkit flow
export async function addRoom(
  input: AddRoomInput
): Promise<AddRoomOutput> {
  return addRoomFlow(input);
}

// Define the Genkit flow
const addRoomFlow = ai.defineFlow(
  {
    name: 'addRoomFlow',
    inputSchema: AddRoomInputSchema,
    outputSchema: AddRoomOutputSchema,
    // Add authentication to ensure only logged-in users can call this.
    // Further checks for 'superadmin' role should be done within the flow if needed.
    auth: (auth) => {
        if (!auth) {
            throw new Error('User must be authenticated.');
        }
    }
  },
  async (roomData) => {
    try {
      const docRef = await adminFirestore.collection('rooms').add(roomData);
      return { roomId: docRef.id };
    } catch (error: any) {
      console.error('Error creating room within flow:', error);
      return { error: 'Could not add room to the database.' };
    }
  }
);
