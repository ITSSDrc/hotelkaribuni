
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Loader2, Users, BadgeDollarSign, Info, CalendarCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function SalleDetailPage() {
  const params = useParams();
  const { id } = params;
  const { firestore } = useFirebase();

  const salleDocRef = typeof id === 'string' ? doc(firestore, 'salles', id) : null;
  const { data: salle, isLoading } = useDoc(salleDocRef);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!salle) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Salle non trouvée.</p>
      </div>
    );
  }
  
  const salleData = salle as any;
  const galleryImages = salleData.imageUrls && salleData.imageUrls.length > 0
    ? salleData.imageUrls
    : ["https://placehold.co/1200x800"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {galleryImages.map((url: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                          <Image
                            src={url}
                            alt={`${salleData.name} - image ${index + 1}`}
                            fill
                            priority={index === 0}
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
              <div className="flex flex-col p-8 lg:col-span-2">
                <h1 className="font-headline text-4xl font-bold md:text-5xl mb-2">
                  {salleData.name}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {salleData.description}
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <span className="text-xl font-semibold">
                        Capacité : {salleData.capacity} personnes
                        </span>
                    </div>
                  <div className="flex items-center gap-3">
                    <BadgeDollarSign className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {salleData.price.toFixed(2)}€ 
                      <span className="text-base font-normal text-muted-foreground"> / jour</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={salleData.status === 'Disponible' ? 'default' : 'destructive'} className="text-base">
                        {salleData.status}
                     </Badge>
                  </div>
                </div>

                <div className="mt-auto">
                    <Button size="lg" className="w-full" asChild disabled={salleData.status !== 'Disponible'}>
                        <Link href="/#contact">
                            <CalendarCheck className='mr-2 h-5 w-5' />
                            Demander un devis
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
