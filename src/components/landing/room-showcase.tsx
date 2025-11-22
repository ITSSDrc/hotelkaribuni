
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { StaticData } from '@/lib/static-data';


export default function RoomShowcase() {
  const rooms = StaticData.rooms.slice(0, 3); // Show first 3 rooms

  return (
    <section id="chambres" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Un Cocon de Confort et d'Élégance</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Chaque chambre est conçue pour votre confort, alliant design moderne et touches locales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            return (
              <Card key={room.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                <div className="relative h-60 w-full">
                  <Image
                    src={(room.imageUrls && room.imageUrls[0]) || "https://placehold.co/400x300"}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
                  <CardDescription>{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xl font-semibold text-primary">
                    À partir de {room.price.toFixed(2)}€ <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/chambres/${room.id}`}>
                      Détails
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 text-center">
            <Button asChild size="lg">
                <Link href="/chambres">
                    Voir toutes les chambres
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
