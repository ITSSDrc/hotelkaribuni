'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Loader2 } from 'lucide-react';

export default function VerifyRolePage() {
  const { userProfile, isLoading, user } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // If it's not loading and we have a result
    if (!isLoading) {
      // If there's no user, they shouldn't be here, send to login
      if (!user) {
        router.replace('/connexion');
        return;
      }

      // If we have a user profile, check the role
      if (userProfile) {
        if (userProfile.role === 'superadmin') {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      } else {
        // If there's a user but no profile document in Firestore,
        // it's likely a regular user. Send them to the homepage.
        // This can happen if the doc creation failed or is delayed.
        router.replace('/');
      }
    }
  }, [user, userProfile, isLoading, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h1 className="text-xl font-semibold">Vérification de votre compte...</h1>
      <p className="text-muted-foreground">Vous allez être redirigé(e) dans un instant.</p>
    </div>
  );
}
