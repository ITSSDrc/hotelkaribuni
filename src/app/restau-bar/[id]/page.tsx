
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Loader2, Info, Clock, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function RestauBarDetailPage() {
  const params = useParams();
  const { id } = params;
  const { firestore } = useFirebase();

  const itemDocRef = typeof id === 'string' ? doc(firestore, 'restau-bar', id) : null;
  const { data: item, isLoading } = useDoc(itemDocRef);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Établissement non trouvé.</p>
      </div>
    );
  }
  
  const itemData = item as any;
  const galleryImages = itemData.imageUrls && itemData.imageUrls.length > 0
    ? itemData.imageUrls
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
                            alt={`${itemData.name} - image ${index + 1}`}
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
                <Badge variant="outline" className="w-fit text-lg mb-4">
                  {itemData.type}
                </Badge>
                <h1 className="font-headline text-4xl font-bold md:text-5xl mb-2">
                  {itemData.name}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {itemData.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={itemData.status === 'Ouvert' ? 'default' : 'destructive'} className="text-base">
                        {itemData.status}
                     </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                     <span className="text-xl font-semibold">
                        Horaires à consulter sur place
                     </span>
                  </div>
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
