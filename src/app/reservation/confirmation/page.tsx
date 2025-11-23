
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Calendar, Users, Home } from 'lucide-react';
import Link from 'next/link';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const guests = searchParams.get('guests');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold">Demande de réservation reçue !</CardTitle>
          <CardDescription className="max-w-md text-lg text-muted-foreground">
            Merci pour votre demande. Nous allons vérifier la disponibilité et vous recontacterons très prochainement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-4 text-xl font-semibold">Récapitulatif de votre demande</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <span>
                  Du <strong className="text-foreground">{formatDate(from)}</strong> au <strong className="text-foreground">{formatDate(to)}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-primary" />
                <span>
                  Pour <strong className="text-foreground">{guests}</strong> personne(s)
                </span>
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Un membre de notre équipe vous enverra un e-mail ou un message WhatsApp pour confirmer votre réservation et finaliser les détails.
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>Chargement...</p></div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
