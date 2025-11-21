'use client';

import { doc } from 'firebase/firestore';
import { useFirebase } from '../provider';
import { useUser } from './use-user';
import { useDoc } from '../firestore/use-doc';

export function useUserProfile() {
  const { firestore } = useFirebase();
  const { user, isLoading: isUserLoading } = useUser();

  // Create a stable reference to the document path.
  const userProfilePath = user ? `users/${user.uid}` : null;
  const userProfileRef = userProfilePath ? doc(firestore, userProfilePath) : null;

  const { data: userProfile, isLoading: isProfileLoading, error } = useDoc(userProfileRef);
  
  const isLoading = isUserLoading || (user && isProfileLoading);

  return { user, userProfile, isLoading, error };
}
