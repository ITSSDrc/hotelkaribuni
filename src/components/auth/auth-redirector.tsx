'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

export default function AuthRedirector() {
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && userProfile) {
      // If the user is a superadmin and is on the homepage, redirect to admin
      if (userProfile.role === 'superadmin' && pathname === '/') {
        router.push('/admin');
      }
    }
  }, [userProfile, isLoading, router, pathname]);

  // This component does not render anything
  return null;
}
