import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {firebase} from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    googleAI(),
    firebase(), // Add the firebase plugin
  ],
  model: 'googleai/gemini-pro',
  flowStateStore: 'firebase', // Use Firestore to store flow states
  traceStore: 'firebase', // Use Firestore to store traces
});
