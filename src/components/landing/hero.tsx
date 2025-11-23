
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export default function Hero() {
  const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative h-screen min-h-[700px] w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {heroImages.map((image) => (
            <CarouselItem key={image.id}>
                <div className="relative w-full h-screen">
                    <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white -mt-[100vh]">
        <div className="container px-4 md:px-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h1 className="mb-6 font-headline text-5xl font-bold tracking-tight text-shadow md:text-7xl lg:text-8xl">
            Hôtel Karibuni
          </h1>
          <p className="mb-4 text-lg font-medium tracking-widest text-white/80 uppercase">Votre Évasion de Rêve Commence Ici</p>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-white/90 md:text-xl">
            Découvrez un sanctuaire de paix et de luxe où chaque séjour devient un souvenir précieux.
          </p>
          <Button size="lg" asChild>
            <Link href="/reservation">Réservez Votre Escapade</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
