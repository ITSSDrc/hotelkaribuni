
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ReservationForm from '@/components/forms/reservation-form';

export const dynamic = 'force-dynamic';

export default function ReservationPage() {
  return (
    <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
            <section id="reservation" className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="mx-auto max-w-4xl border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader className="text-center p-8">
                    <CardTitle className="section-title">Réservez Votre Séjour</CardTitle>
                    <CardDescription className="section-subtitle">
                    Planifiez votre escapade de rêve en quelques clics. Remplissez le formulaire ci-dessous pour nous envoyer votre demande.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <ReservationForm />
                </CardContent>
                </Card>
            </div>
            </section>
        </main>
        <Footer />
    </div>
  );
}
