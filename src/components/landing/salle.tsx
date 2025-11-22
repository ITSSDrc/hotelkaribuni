'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Salle() {
  const salleImage = PlaceHolderImages.find((img) => img.id === 'salle-1');

  return (
    <section id="salle" className="py-16 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <h2 className="section-title mb-4">
              Événements & Conférences
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Notre salle de conférence polyvalente est l'endroit idéal pour vos réunions d'affaires, séminaires ou événements privés. Entièrement équipée avec les dernières technologies, elle peut être configurée pour répondre à vos besoins spécifiques.
            </p>
            <Button asChild size="lg">
              <Link href="#contact">
                Demander un devis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 group animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Card className="overflow-hidden shadow-xl border-0">
              <CardContent className="relative aspect-video p-0">
                {salleImage && (
                  <Image
                    src={salleImage.imageUrl}
                    alt={salleImage.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={salleImage.imageHint}
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
