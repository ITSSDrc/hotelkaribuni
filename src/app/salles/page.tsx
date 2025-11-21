
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Users } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';


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


export default function SallesPage() {
  const { firestore } = useFirebase();
  const sallesCollectionRef = collection(firestore, 'salles');
  const sallesQuery = query(sallesCollectionRef, orderBy('price', 'asc'));

  const { data: salles, isLoading } = useCollection(sallesQuery);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section id="salles" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">Nos Salles d'Événements</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Découvrez nos espaces modulables et équipés pour tous vos événements professionnels ou privés.
              </p>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {salles && (salles as any[]).map((salle: any) => (
                  <Card key={salle.id} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
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
                      <CardDescription>{salle.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className='flex justify-between items-center'>
                             <p className="text-xl font-semibold text-primary">
                                {salle.price.toFixed(2)}€ <span className="text-sm font-normal text-muted-foreground">/ jour</span>
                            </p>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-5 w-5" />
                                <span className='font-medium'>{salle.capacity}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/salles/${salle.id}`}>
                          Voir les détails
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
