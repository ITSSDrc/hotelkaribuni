'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Loader2 } from 'lucide-react';

export default function VerifyRolePage() {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading is complete
    if (isLoading) {
      return;
    }

    // If there's no authenticated user at all, redirect to login.
    if (!user) {
      router.replace('/connexion');
      return;
    }

    // If we have a user profile from Firestore, check their role.
    if (userProfile) {
      if (userProfile.role === 'superadmin' || userProfile.role === 'receptionist' || userProfile.role === 'stock_manager') {
        router.replace('/admin');
      } else {
        // Handle guest or other roles
        router.replace('/dashboard');
      }
    } else {
      // This case handles a logged-in user who doesn't have a document in the 'users' collection yet.
      // This might happen for a 'guest' role or during sign-up race conditions.
      // We'll send them to the general dashboard.
      router.replace('/dashboard');
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
