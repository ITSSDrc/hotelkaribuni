'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export default function RestauBar() {
  const restauBarImage = PlaceHolderImages.find((img) => img.id === 'restau-bar-1');

  return (
    <section id="restau-bar" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
                <h2 className="font-headline text-4xl font-bold md:text-5xl mb-4">
                Saveurs & Cocktails
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                Notre restaurant-bar vous propose une expérience culinaire inoubliable. Dégustez des plats raffinés préparés avec des produits locaux frais, ou sirotez un cocktail signature dans une ambiance chic et décontractée.
                </p>
                <Button asChild variant="outline">
                <Link href="#">
                    Voir le menu
                </Link>
                </Button>
            </div>
            <div className="order-1 md:order-2">
                <Card className="overflow-hidden shadow-xl">
                <CardContent className="relative aspect-video p-0">
                    {restauBarImage && (
                    <Image
                        src={restauBarImage.imageUrl}
                        alt={restauBarImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={restauBarImage.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    )}
                </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
