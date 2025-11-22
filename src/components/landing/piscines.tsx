
'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Piscines() {
  const piscineImage = PlaceHolderImages.find((img) => img.id === 'piscines-1');

  return (
    <section id="piscines" className="py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="group animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Card className="overflow-hidden shadow-xl border-0">
              <CardContent className="relative aspect-video p-0">
                {piscineImage && (
                  <Image
                    src={piscineImage.imageUrl}
                    alt={piscineImage.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={piscineImage.imageHint}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </CardContent>
            </Card>
          </div>
           <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <h2 className="section-title mb-4">
              Détente au bord de l'eau
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Plongez dans nos piscines rafraîchissantes ou détendez-vous sur un transat avec un cocktail à la main. Notre espace aquatique est un véritable havre de paix, conçu pour votre relaxation et votre bien-être.
            </p>
             <Button asChild size="lg">
                <Link href="/piscines">
                    Découvrir nos piscines
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
