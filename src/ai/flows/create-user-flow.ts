'use server';
/**
 * @fileOverview A secure flow for creating new users with specific roles.
 *
 * - createUser - Creates a user in Firebase Auth and sets their profile in Firestore.
 * - CreateUserInput - The input type for the createUser function.
 * - CreateUserOutput - The return type for the createUser function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Define the input schema for the flow
export const CreateUserInputSchema = z.object({
  displayName: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['superadmin', 'receptionist', 'stock_manager']),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

// Define the output schema for the flow
export const CreateUserOutputSchema = z.object({
  uid: z.string().optional(),
  error: z.string().optional(),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;

// Initialize Firebase Admin SDK only if it hasn't been already.
// The Genkit environment reliably handles environment variables.
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

const adminAuth = getAuth();
const adminFirestore = getFirestore();

// Main exported function that wraps the Genkit flow
export async function createUser(
  input: CreateUserInput
): Promise<CreateUserOutput> {
  return createUserFlow(input);
}

// Define the Genkit flow
const createUserFlow = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: CreateUserOutputSchema,
  },
  async (userData) => {
    try {
      // 1. Create user in Firebase Authentication
      const userRecord = await adminAuth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true,
        disabled: false,
      });

      // 2. Create user profile document in Firestore
      const userProfile = {
        displayName: userData.displayName,
        email: userData.email,
        role: userData.role,
        photoURL: userRecord.photoURL || null,
      };

      await adminFirestore
        .collection('users')
        .doc(userRecord.uid)
        .set(userProfile);

      return { uid: userRecord.uid };
    } catch (error: any) {
      console.error('Error creating user within flow:', error);

      let errorMessage = 'Une erreur inconnue est survenue.';
      if (error.code === 'auth/email-already-exists') {
        errorMessage =
          'Cette adresse e-mail est déjà utilisée par un autre compte.';
      } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'Le mot de passe doit comporter au moins 6 caractères.';
      }

      return { error: errorMessage };
    }
  }
);
