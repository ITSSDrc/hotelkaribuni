
'use server';

import {
  createUser as createFirebaseUser,
  type CreateUserInput,
} from '@/ai/flows/create-user-flow';

// This function now acts as a simple wrapper around the Genkit flow.
export async function createUser(userData: CreateUserInput) {
  try {
    const result = await createFirebaseUser(userData);

    if (result.error) {
      console.error('Error from createUser flow:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, uid: result.uid };
  } catch (error: any) {
    console.error('Error calling create user flow:', error);
    return {
      success: false,
      error:
        error.message ||
        'Une erreur inattendue est survenue lors de la création de l’utilisateur.',
    };
  }
}
