import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useUserProfile } from './auth/use-user-profile';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';


function initializeFirebase() {
  const isInitialized = getApps().length > 0;
  const app = isInitialized ? getApp() : initializeApp(firebaseConfig);
  return { app };
}

// Export the initialization function
export { initializeFirebase };

// Export the provider and hook
export { FirebaseProvider, useFirebase, FirebaseClientProvider, useUser, useCollection, useDoc, useUserProfile };
