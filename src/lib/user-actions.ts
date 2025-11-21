
'use server';

import { createUser as createUserWithFlow, type CreateUserInput } from '@/ai/flows/create-user-flow';

/**
 * Server Action to securely create a new user.
 * This function runs on the server and calls the Genkit flow.
 * @param userData The user data to create.
 * @returns An object with success status, and uid or error message.
 */
export async function createUser(userData: CreateUserInput): Promise<{ success: boolean, uid?: string, error?: string }> {
  try {
    // Call the Genkit flow wrapper function directly from the server action.
    const result = await createUserWithFlow(userData);

    if (!result.uid) {
      throw new Error('The flow did not return a user ID.');
    }

    return { success: true, uid: result.uid };
  } catch (error: any) {
    console.error('Error in createUser Server Action:', error);
    
    return {
      success: false,
      error: error.message || 'Une erreur inattendue est survenue lors de la création de l’utilisateur.',
    };
  }
}
