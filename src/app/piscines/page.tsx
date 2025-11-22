
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { StaticData } from '@/lib/static-data';

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ouverte':
        return 'default';
      case 'Fermée':
        return 'destructive';
      case 'En maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
};

export default function PiscinesPage() {
  const piscines = StaticData.piscines;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section id="piscines" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">Nos Espaces Aquatiques</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Plongez dans un monde de détente et de fraîcheur. Découvrez nos différentes piscines conçues pour votre plaisir.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {piscines.map((piscine: any) => (
                <Card key={piscine.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                  <div className="relative h-60 w-full">
                    <Image
                      src={(piscine.imageUrls && piscine.imageUrls[0]) || "https://placehold.co/400x300"}
                      alt={piscine.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <Badge variant={getStatusVariant(piscine.status)} className="absolute top-2 right-2">
                      {piscine.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{piscine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <div className='flex justify-between items-center'>
                           <p className="text-lg font-semibold text-primary">
                              {piscine.type}
                          </p>
                      </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/piscines/${piscine.id}`}>
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
