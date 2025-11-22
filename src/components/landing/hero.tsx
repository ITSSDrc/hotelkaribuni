import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-screen min-h-[700px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4 md:px-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <p className="mb-4 text-lg font-medium tracking-widest text-white/80 uppercase">Hôtel Karibuni</p>
          <h1 className="mb-6 font-headline text-5xl font-bold tracking-tight text-shadow md:text-7xl lg:text-8xl">
            Votre Évasion de Rêve Commence Ici
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-white/90 md:text-xl">
            Découvrez un sanctuaire de paix et de luxe où chaque séjour devient un souvenir précieux.
          </p>
          <Button size="lg" asChild>
            <Link href="#reservation">Réservez Votre Escapade</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
