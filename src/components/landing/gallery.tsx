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
  {
    id: 3,
    name: 'Sophie Laurent',
    avatar: 'guest-avatar-3',
    rating: 5,
    comment: "La piscine est incroyable et le restaurant sert une cuisine divine. C'est l'endroit parfait pour se déconnecter et se ressourcer. Service 5 étoiles.",
  },
   {
    id: 4,
    name: 'Lucas Bernard',
    avatar: 'guest-avatar-4',
    rating: 4,
    comment: "Très bel hôtel, bien situé. La chambre était spacieuse et propre. Seul petit bémol, le petit-déjeuner pourrait être un peu plus varié. Mais dans l'ensemble, un excellent séjour.",
  },
];

export default function Gallery() {
  return (
    <section id="galerie" className="bg-card py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="section-title">Instants Précieux à l'Hôtel Karibuni</h2>
          <p className="section-subtitle">
            Explorez la beauté de notre établissement et découvrez pourquoi nos clients nous adorent.
          </p>
        </div>

        <div className="mb-24 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="mx-auto w-full max-w-7xl"
          >
            <CarouselContent>
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden border-0 group">
                      <CardContent className="relative aspect-[4/3] p-0">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={image.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="translate-x-12" />
            <CarouselNext className="-translate-x-12" />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => {
            const avatarImage = PlaceHolderImages.find(img => img.id === testimonial.avatar);
            return (
              <div key={testimonial.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2 + 0.6}s`, animationFillMode: 'both' }}>
              <Card className="bg-background border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={testimonial.name} data-ai-hint={avatarImage.imageHint} />}
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <div className="flex items-center gap-1 text-primary">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                         {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current text-muted-foreground/30" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
