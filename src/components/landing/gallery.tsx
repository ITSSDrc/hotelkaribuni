'use client';
import Image from 'next/image';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
const testimonials = [
  {
    id: 1,
    name: 'Marie Dubois',
    avatar: 'guest-avatar-1',
    rating: 5,
    comment: "Un séjour absolument magique ! Le service était impeccable et la vue depuis notre chambre était à couper le souffle. Nous reviendrons, c'est certain !",
  },
  {
    id: 2,
    name: 'Paul Martin',
    avatar: 'guest-avatar-2',
    rating: 5,
    comment: "L'hôtel Karibuni a dépassé toutes nos attentes. Le personnel est incroyablement attentionné et les recommandations d'activités étaient parfaites. Un vrai paradis.",
  },
];

export default function Gallery() {
  return (
    <section id="galerie" className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Galerie & Expériences</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Plongez dans l'univers de Karibuni Oasis et découvrez ce que nos hôtes disent de nous.
          </p>
        </div>

        <div className="mb-16">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="mx-auto w-full max-w-5xl"
          >
            <CarouselContent>
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="relative aspect-[4/3] p-0">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          data-ai-hint={image.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => {
            const avatarImage = PlaceHolderImages.find(img => img.id === testimonial.avatar);
            return (
              <Card key={testimonial.id} className="bg-background">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={testimonial.name} data-ai-hint={avatarImage.imageHint} />}
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex items-center gap-1 text-accent">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
