'use client';

import { doc } from 'firebase/firestore';
import { useFirebase } from '../provider';
import { useUser } from './use-user';
import { useDoc } from '../firestore/use-doc';

export function useUserProfile() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading, error } = useDoc(userProfileRef);

  return { user, userProfile, isLoading, error };
}
