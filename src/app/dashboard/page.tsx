'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.replace('/connexion');
    }
  }, [isLoading, user, router]);

  if (isLoading || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto">
          <Card className="mx-auto max-w-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl font-bold">
                Bienvenue, {userProfile.displayName || 'cher client'} !
              </CardTitle>
              <CardDescription>
                Ceci est votre tableau de bord personnel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Depuis cet espace, vous pourrez bientôt gérer vos réservations, consulter l'historique de vos séjours et bien plus encore.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
