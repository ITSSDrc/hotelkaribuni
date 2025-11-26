
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { StaticData } from '@/lib/static-data';
import { Badge } from '../ui/badge';

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'default';
      case 'Réservée':
        return 'destructive';
      case 'En maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
};

export default function SalleShowcase() {
  const salles = StaticData.salles;

  return (
    <section id="salles-showcase" className="py-16 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="section-title">Événements & Conférences</h2>
          <p className="section-subtitle">
            Des espaces modulables et équipés pour faire de chaque événement un succès.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {salles.map((salle: any, index: number) => (
             <div key={salle.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2 + 0.4}s`, animationFillMode: 'both' }}>
                <Card className="flex flex-col overflow-hidden transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 dark:shadow-2xl dark:shadow-primary/25 dark:hover:shadow-primary/40">
                  <div className="relative h-60 w-full">
                    <Image
                      src={(salle.imageUrls && salle.imageUrls[0]) || "https://placehold.co/400x300"}
                      alt={salle.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <Badge variant={getStatusVariant(salle.status)} className="absolute top-2 right-2">
                      {salle.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{salle.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{salle.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                      <div className='flex justify-between items-center w-full'>
                           <p className="text-xl font-semibold text-primary">
                              ${salle.price} <span className="text-sm font-normal text-muted-foreground">/ jour</span>
                          </p>
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-5 w-5" />
                              <span className='font-medium'>jusqu'à {salle.capacity}</span>
                          </div>
                      </div>
                    <Button asChild className="w-full">
                      <Link href={`/salles/${salle.id}`}>
                        Voir les détails
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
            </div>
          ))}
        </div>
         <div className="mt-16 text-center">
            <Button asChild size="lg">
                <Link href="/salles">
                    Toutes nos salles
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
