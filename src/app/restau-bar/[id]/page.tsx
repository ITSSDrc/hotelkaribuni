
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Info, Clock, Fish, Sun, Award, Grape, Martini, Sunrise, Music, Cookie, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StaticData } from '@/lib/static-data';
import { Separator } from '@/components/ui/separator';

const iconMap: { [key: string]: React.ElementType } = {
    Fish,
    Sun,
    Award,
    Grape,
    Martini,
    Sunrise,
    Music,
    Cookie,
    Menu,
};

export default function RestauBarDetailPage() {
  const params = useParams();
  const { id } = params;

  const item = StaticData.restauBar.find(i => i.id === id);

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
                ) : (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                       <p className='text-muted-foreground'>Pas d'image</p>
                    </div>
                )}
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

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={itemData.status === 'Ouvert' ? 'default' : 'destructive'} className="text-base">
                        {itemData.status}
                     </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                     <span className="text-lg font-semibold">
                        Horaires à consulter sur place
                     </span>
                  </div>
                </div>

                {itemData.amenities && itemData.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="mb-6">
                        <h2 className="text-xl font-headline font-semibold mb-4">Points Forts</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {itemData.amenities.map((amenity: {name: string, icon: string}) => {
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

                 {itemData.products && itemData.products.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="mb-6">
                        <h2 className="text-xl font-headline font-semibold mb-4">Exemples de notre carte</h2>
                        <div className="space-y-4">
                            {itemData.products.map((product: {name: string, description: string, icon: string}) => {
                                const Icon = iconMap[product.icon] || (itemData.type === 'Restaurant' ? Menu : Martini);
                                return (
                                <Card key={product.name} className="bg-muted/50 p-4">
                                  <CardContent className='p-0 flex items-start gap-4'>
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-1">
                                        <Icon className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-foreground">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.description}</p>
                                      </div>
                                  </CardContent>
                                </Card>
                                );
                            })}
                        </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
