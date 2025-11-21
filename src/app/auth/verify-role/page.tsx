'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Loader2 } from 'lucide-react';

export default function VerifyRolePage() {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If still loading user data, do nothing.
    if (isLoading) {
      return;
    }

    // If no user is logged in, redirect them to the login page.
    if (!user) {
      router.replace('/connexion');
      return;
    }

    // If the user is logged in, but we are still waiting for the Firestore profile
    if (user && !userProfile) {
      // Still loading the profile, wait.
      return;
    }

    // If we have a user and their profile, decide where to send them.
    if (user && userProfile) {
      const isAdminOrStaff = ['superadmin', 'receptionist', 'stock_manager'].includes(userProfile.role);
      
      if (isAdminOrStaff) {
        // This is the main admin dashboard path.
        // We replace the history state so the user can't go back to login/verify pages.
        router.replace('/admin');
      } else {
        // For other roles like 'guest'.
        router.replace('/dashboard');
      }
    }
    
    // Fallback case: if a user is logged in but has no profile document (should be rare)
    // send them to the general user dashboard.
    if (user && !isLoading && !userProfile) {
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
