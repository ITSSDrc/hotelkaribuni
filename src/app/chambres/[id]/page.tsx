
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Info, CalendarCheck, Wifi, AirVent, Tv, ConciergeBell, Waves, GalleryVerticalEnd, GlassWater, Sofa, Sun, Bath, Star, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StaticData } from '@/lib/static-data';
import { Separator } from '@/components/ui/separator';

const iconMap: { [key: string]: React.ElementType } = {
  Wifi,
  AirVent,
  Tv,
  ConciergeBell,
  Waves,
  GalleryVerticalEnd,
  GlassWater,
  Sofa,
  Sun,
  Bath,
  Star,
  Wind
};

export default function RoomDetailPage() {
  const params = useParams();
  const { id } = params;

  const room = StaticData.rooms.find(r => r.id === id);

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Chambre non trouvée.</p>
      </div>
    );
  }
  
  const roomData = room as any;
  const galleryImages = roomData.imageUrls && roomData.imageUrls.length > 0
    ? roomData.imageUrls
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-4">
                {galleryImages.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {galleryImages.map((url: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                              src={url}
                              alt={`${roomData.name} - image ${index + 1}`}
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
                ) : (
                   <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                       <p className='text-muted-foreground'>Pas d'image</p>
                   </div>
                )}
              </div>
              <div className="flex flex-col p-8 lg:col-span-2">
                <h1 className="font-headline text-4xl font-bold md:text-5xl mb-2">
                  {roomData.name}
                </h1>
                <Badge variant="outline" className="w-fit text-lg mb-4">
                  {roomData.type}
                </Badge>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {roomData.description}
                </p>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                         <span className="text-3xl font-bold text-primary">
                            ${roomData.price}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            / nuit
                          </span>
                    </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={roomData.status === 'Disponible' ? 'default' : 'destructive'} className="text-base">
                        {roomData.status}
                     </Badge>
                  </div>
                </div>

                {roomData.amenities && roomData.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="mb-6">
                        <h2 className="text-xl font-headline font-semibold mb-4">Équipements</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {roomData.amenities.map((amenity: {name: string, icon: string}) => {
                                const Icon = iconMap[amenity.icon];
                                return (
                                <div key={amenity.name} className="flex items-center gap-3 text-muted-foreground">
                                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                                    <span>{amenity.name}</span>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                  </>
                )}


                <div className="mt-auto">
                    <Button size="lg" className="w-full" asChild disabled={roomData.status !== 'Disponible'}>
                        <Link href="/reservation">
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

    