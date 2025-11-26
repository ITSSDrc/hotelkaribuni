
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { StaticData } from '@/lib/static-data';

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'default';
      case 'Réservée':
        return 'destructive';
      case 'En maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
};

export default function SallesPage() {
  const salles = StaticData.salles;
  const headerImage = salles[0]?.imageUrls[0] || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop';


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center">
            <div className="absolute inset-0">
                <Image
                    src={headerImage}
                    alt="Salle de conférence moderne"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            </div>
            <div className="relative z-10 text-center text-white px-4">
                 <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow">Nos Salles d'Événements</h1>
                  <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                    Découvrez nos espaces modulables et équipés pour tous vos événements professionnels ou privés.
                  </p>
            </div>
        </section>

        <section id="salles" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {salles.map((salle: any) => (
                <Card key={salle.id} className="flex flex-col overflow-hidden transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 dark:shadow-2xl dark:shadow-primary/25 dark:hover:shadow-primary/40">
                  <div className="relative h-60 w-full">
                    <Image
                      src={(salle.imageUrls && salle.imageUrls[0]) || "https://placehold.co/400x300"}
                      alt={salle.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <Badge variant={getStatusVariant(salle.status)} className="absolute top-2 right-2">
                      {salle.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{salle.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{salle.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                      <div className='flex justify-between items-center w-full'>
                           <p className="text-xl font-semibold text-primary">
                              ${salle.price} <span className="text-sm font-normal text-muted-foreground">/ jour</span>
                          </p>
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-5 w-5" />
                              <span className='font-medium'>jusqu'à {salle.capacity}</span>
                          </div>
                      </div>
                    <Button asChild className="w-full">
                      <Link href={`/salles/${salle.id}`}>
                        Voir les détails
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
