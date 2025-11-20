import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

const rooms = [
  {
    id: 'room-standard',
    title: 'Chambre Standard',
    description: 'Confort et élégance pour un séjour relaxant. Parfait pour les voyageurs seuls ou en couple.',
    price: '120€',
  },
  {
    id: 'room-deluxe',
    title: 'Chambre Deluxe',
    description: 'Plus d\'espace et une vue imprenable pour une expérience améliorée. Idéal pour un confort supérieur.',
    price: '180€',
  },
  {
    id: 'room-suite',
    title: 'Suite Luxueuse',
    description: 'Le summum du luxe avec un salon séparé et des services exclusifs. Pour un séjour inoubliable.',
    price: '250€',
  },
];

export default function RoomShowcase() {
  return (
    <section id="chambres" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Nos Chambres & Suites</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Chaque chambre est conçue pour votre confort, alliant design moderne et touches locales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const roomImage = PlaceHolderImages.find((img) => img.id === room.id);
            return (
              <Card key={room.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                {roomImage && (
                  <div className="relative h-60 w-full">
                    <Image
                      src={roomImage.imageUrl}
                      alt={room.title}
                      fill
                      className="object-cover"
                      data-ai-hint={roomImage.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{room.title}</CardTitle>
                  <CardDescription>{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xl font-semibold text-primary">
                    À partir de {room.price} <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="#reservation">
                      Réserver
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
