'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase';


export default function RoomShowcase() {
  const { firestore } = useFirebase();
  const roomsCollectionRef = collection(firestore, 'rooms');
  
  // We only want to show the main categories on the landing page
  const standardRoomQuery = query(roomsCollectionRef, where('type', '==', 'Standard'), where('status', '==', 'Disponible'));
  const deluxeRoomQuery = query(roomsCollectionRef, where('type', '==', 'Deluxe'), where('status', '==', 'Disponible'));
  const suiteRoomQuery = query(roomsCollectionRef, where('type', '==', 'Suite'), where('status', '==', 'Disponible'));

  const { data: standardRooms, isLoading: loadingStandard } = useCollection(standardRoomQuery);
  const { data: deluxeRooms, isLoading: loadingDeluxe } = useCollection(deluxeRoomQuery);
  const { data: suiteRooms, isLoading: loadingSuite } = useCollection(suiteRoomQuery);

  const isLoading = loadingStandard || loadingDeluxe || loadingSuite;

  const roomTypes = [
    {
      type: 'Standard',
      title: 'Chambre Standard',
      description: 'Confort et élégance pour un séjour relaxant. Parfait pour les voyageurs seuls ou en couple.',
      rooms: standardRooms,
    },
    {
      type: 'Deluxe',
      title: 'Chambre Deluxe',
      description: 'Plus d\'espace et une vue imprenable pour une expérience améliorée. Idéal pour un confort supérieur.',
      rooms: deluxeRooms,
    },
    {
      type: 'Suite',
      title: 'Suite Luxueuse',
      description: 'Le summum du luxe avec un salon séparé et des services exclusifs. Pour un séjour inoubliable.',
      rooms: suiteRooms,
    },
  ];

  return (
    <section id="chambres" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Un Cocon de Confort et d'Élégance</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Chaque chambre est conçue pour votre confort, alliant design moderne et touches locales.
          </p>
        </div>

        {isLoading ? (
           <div className="flex h-64 items-center justify-center">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((roomType) => {
              // We'll just display the first available room of each type as a showcase
              const displayRoom = roomType.rooms && roomType.rooms.length > 0 ? (roomType.rooms[0] as any) : null;
              
              if (!displayRoom) return null;

              return (
                <Card key={roomType.type} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                  <div className="relative h-60 w-full">
                    <Image
                      src={displayRoom.imageUrl}
                      alt={roomType.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{roomType.title}</CardTitle>
                    <CardDescription>{roomType.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xl font-semibold text-primary">
                      À partir de {displayRoom.price.toFixed(2)}€ <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
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
        )}
      </div>
    </section>
  );
}
