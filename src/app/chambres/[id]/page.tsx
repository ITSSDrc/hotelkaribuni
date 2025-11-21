'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Loader2, BedDouble, BadgeDollarSign, Info, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RoomDetailPage() {
  const params = useParams();
  const { id } = params;
  const { firestore } = useFirebase();

  const roomDocRef = typeof id === 'string' ? doc(firestore, 'rooms', id) : null;
  const { data: room, isLoading } = useDoc(roomDocRef);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Chambre non trouvée.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-80 lg:h-auto min-h-[400px]">
                <Image
                  src={(room as any).imageUrl}
                  alt={(room as any).name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-8">
                <h1 className="font-headline text-4xl font-bold md:text-5xl mb-2">
                  {(room as any).name}
                </h1>
                <Badge variant="outline" className="w-fit text-lg mb-4">
                  {(room as any).type}
                </Badge>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {(room as any).description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <BadgeDollarSign className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {(room as any).price.toFixed(2)}€ 
                      <span className="text-base font-normal text-muted-foreground"> / nuit</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={(room as any).status === 'Disponible' ? 'default' : 'destructive'} className="text-base">
                        {(room as any).status}
                     </Badge>
                  </div>
                </div>

                <div className="mt-auto">
                    <Button size="lg" className="w-full" asChild disabled={(room as any).status !== 'Disponible'}>
                        <Link href="/#reservation">
                            <CalendarCheck className='mr-2 h-5 w-5' />
                            Réserver maintenant
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
