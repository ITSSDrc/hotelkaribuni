
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Info, CalendarCheck, Wifi, AirVent, Tv, ConciergeBell, Waves, GalleryVerticalEnd, GlassWater, Sofa, Sun, Bath, Star, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StaticData } from '@/lib/static-data';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import ReservationForm from '@/components/forms/reservation-form';
import { useState, useCallback, useEffect } from 'react';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const handleClose = () => setSelectedImageIndex(null);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % galleryImages.length);
    }
  }, [selectedImageIndex, galleryImages.length]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [selectedImageIndex, galleryImages.length]);

  const handleKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'Escape') {
        handleClose();
      }
    }
  }, [selectedImageIndex, handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const selectedImage = selectedImageIndex !== null ? galleryImages[selectedImageIndex] : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-4">
                 <Dialog open={selectedImageIndex !== null} onOpenChange={(isOpen) => !isOpen && handleClose()}>
                    {galleryImages.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent>
                        {galleryImages.map((url: string, index: number) => (
                            <CarouselItem key={index}>
                                <DialogTrigger asChild onClick={() => handleImageClick(index)} className="cursor-zoom-in">
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
                                </DialogTrigger>
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
                    <DialogContent className="max-w-4xl w-full p-0 border-0 bg-transparent shadow-none" onKeyDown={handleKeyDown as any}>
                        {selectedImage && (
                            <>
                                <DialogTitle className="absolute -left-full">
                                {roomData.name}
                                </DialogTitle>
                                <div className="relative aspect-video w-full">
                                    <Image
                                        src={selectedImage}
                                        alt={roomData.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap rounded-md bg-black/50 px-4 py-2 text-base text-white flex items-center gap-2">
                                    <span>{roomData.name}</span>
                                    {galleryImages.length > 1 && (
                                    <>
                                    <span className='text-white/70'>•</span>
                                    <span className="text-sm text-white/70">{selectedImageIndex! + 1} / {galleryImages.length}</span>
                                    </>
                                    )}
                                </div>

                                {galleryImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
                                            onClick={handlePrevious}
                                        >
                                            <ChevronLeft className="h-8 w-8" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
                                            onClick={handleNext}
                                        >
                                            <ChevronRight className="h-8 w-8" />
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </DialogContent>
                 </Dialog>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full" disabled={roomData.status !== 'Disponible'}>
                           <CalendarCheck className='mr-2 h-5 w-5' />
                           Vérifier la disponibilité
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Réserver: {roomData.name}</DialogTitle>
                          <DialogDescription>
                            Veuillez remplir le formulaire ci-dessous pour nous envoyer votre demande de réservation.
                          </DialogDescription>
                        </DialogHeader>
                        <ReservationForm roomId={roomData.id} />
                      </DialogContent>
                    </Dialog>
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
