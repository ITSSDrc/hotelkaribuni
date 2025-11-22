
'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

export default function Gallery() {
  return (
    <section id="galerie" className="bg-card py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="section-title">Instants Précieux à l'Hôtel Karibuni</h2>
          <p className="section-subtitle">
            Explorez la beauté de notre établissement en images.
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
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

        <div className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/galerie">
                    Voir toute la galerie
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>

      </div>
    </section>
  );
}
