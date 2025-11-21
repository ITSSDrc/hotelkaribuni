
'use server';
/**
 * @fileOverview A secure flow for creating new users with specific roles.
 *
 * - createUserFlow - A flow that creates a user in Firebase Auth and sets their profile in Firestore.
 * - CreateUserInput - The input type for the createUser function.
 * - CreateUserOutput - The return type for the createUser function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';

// Helper function to initialize Firebase Admin SDK if not already done.
// This is idempotent and safe to call multiple times.
let adminApp: App | undefined;
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (!serviceAccountJson) {
    console.error('Firebase Admin SDK config is not set in environment variables.');
    throw new Error('La configuration du SDK Admin Firebase est manquante.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Failed to parse or initialize Firebase Admin SDK:', e.message);
    throw new Error('Échec de l\'initialisation du SDK Admin Firebase.');
  }
};

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
  uid: z.string(),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;

// The main flow function
export const createUserFlow = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: CreateUserOutputSchema,
  },
  async (userData) => {
    try {
      initializeFirebaseAdmin();

      const adminAuth = getAuth();
      const adminFirestore = getFirestore();
      
      const userRecord = await adminAuth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true,
        disabled: false,
      });

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
        errorMessage = 'Cette adresse e-mail est déjà utilisée par un autre compte.';
      } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'Le mot de passe doit comporter au moins 6 caractères.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Re-throw with a more user-friendly message
      throw new Error(errorMessage);
    }
  }
);
