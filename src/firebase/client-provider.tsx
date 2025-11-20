'use client';

import { FirebaseProvider, initializeFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ReactNode, useEffect, useState } from 'react';

// Define the shape of the Firebase instances
interface FirebaseInstances {
  app: ReturnType<typeof initializeFirebase>['app'];
  auth: ReturnType<typeof getAuth>;
  firestore: ReturnType<typeof getFirestore>;
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // Initialize Firebase only on the client side
    const firebase = initializeFirebase();
    const auth = getAuth(firebase.app);
    const firestore = getFirestore(firebase.app);

    setInstances({ app: firebase.app, auth, firestore });
  }, []);

  // Render children within the FirebaseProvider only when Firebase is initialized
  if (!instances) {
    // You can render a loading state here if needed
    return null;
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
