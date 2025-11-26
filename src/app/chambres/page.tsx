
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BedDouble } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { StaticData } from '@/lib/static-data';

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'default';
      case 'Occupée':
        return 'destructive';
      case 'En nettoyage':
        return 'secondary';
      default:
        return 'outline';
    }
};

export default function ChambresPage() {
  const rooms = StaticData.rooms;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section id="chambres" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">Nos Chambres & Suites</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Découvrez le confort et l'élégance de nos espaces, conçus pour rendre votre séjour inoubliable.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room: any) => (
                <Card key={room.id} className="flex flex-col overflow-hidden transition-shadow duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-60 w-full">
                    <Image
                      src={(room.imageUrls && room.imageUrls[0]) || "https://placehold.co/400x300"}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Badge variant={getStatusVariant(room.status)} className="absolute top-2 right-2">
                      {room.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
                    <CardDescription>{room.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{room.description}</p>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                     <div className='flex justify-between items-center w-full'>
                           <p className="text-xl font-semibold text-primary">
                              ${room.price} <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
                          </p>
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <BedDouble className="h-5 w-5" />
                              <span className='font-medium'>{room.type}</span>
                          </div>
                      </div>
                    <Button asChild className="w-full">
                      <Link href={`/chambres/${room.id}`}>
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

    