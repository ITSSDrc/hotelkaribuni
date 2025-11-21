import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {getApps, initializeApp, cert} from 'firebase-admin/app';

// Initialize Firebase Admin SDK only if it hasn't been already.
// The Genkit environment reliably handles environment variables.
if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // In a local development environment, you may not have the SDK config.
    // The flows that use the Admin SDK will fail, but other flows will work.
    console.warn(
      'Firebase Admin SDK config not found. Flows requiring admin privileges will fail.'
    );
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-pro',
});
