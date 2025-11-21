
'use server';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { type CreateUserInput } from '@/ai/flows/create-user-flow';
import { initializeFirebase } from '@/firebase';

/**
 * Calls the `createUserFlow` callable function to securely create a new user.
 * This is the recommended way to trigger secured server-side logic from the client.
 * @param userData The user data to create.
 * @returns An object with success status, and uid or error message.
 */
export async function createUser(userData: CreateUserInput) {
  try {
    // Ensure the client-side Firebase app is initialized.
    const { app } = initializeFirebase();
    const functions = getFunctions(app, 'us-central1'); // Make sure to use the correct region

    // Get a reference to the callable function.
    // The name 'createUserFlow' must match the name in the onFlow definition.
    const createUserFn = httpsCallable(functions, 'createUserFlow');
    
    // Call the function with the user data.
    const result = await createUserFn(userData);
    
    const uid = (result.data as any)?.uid;

    if (!uid) {
      throw new Error('The callable function did not return a user ID.');
    }

    return { success: true, uid };
  } catch (error: any) {
    console.error('Error calling createUserFlow callable function:', error);
    
    // Firebase callable functions wrap errors, so we look at `error.message`.
    return {
      success: false,
      error: error.message || 'Une erreur inattendue est survenue lors de la création de l’utilisateur.',
    };
  }
}
