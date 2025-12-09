
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { StaticData } from '@/lib/static-data';

export default function RoomShowcase() {
  const rooms = StaticData.rooms.slice(0, 3);

  return (
    <section id="chambres" className="py-16 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="section-title">Un Cocon de Confort et d'Élégance</h2>
          <p className="section-subtitle">
            Chaque chambre est une promesse de sérénité, alliant design contemporain et touches chaleureuses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <div key={room.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2 + 0.4}s`, animationFillMode: 'both' }}>
              <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={(room.imageUrls && room.imageUrls[0]) || "https://placehold.co/400x300"}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">{room.name}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{room.description}</p>
                  <div className="flex justify-end items-center">
                     <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        <Link href={`/chambres/${room.id}`}>
                          Détails
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/chambres">
                    Voir toutes les chambres
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
