
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { StaticData } from '@/lib/static-data';

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return 'default';
      case 'Fermé':
        return 'destructive';
      default:
        return 'outline';
    }
};

export default function RestauBarPage() {
  const items = StaticData.restauBar;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section id="restau-bar" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">Notre Restaurant & Bar</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Découvrez des saveurs exquises et des cocktails créatifs dans nos espaces dédiés à la gastronomie et à la convivialité.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item: any) => (
                <Card key={item.id} className="flex flex-col overflow-hidden transition-shadow duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-60 w-full">
                    <Image
                      src={(item.imageUrls && item.imageUrls[0]) || "https://placehold.co/400x300"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <Badge variant={getStatusVariant(item.status)} className="absolute top-2 right-2">
                      {item.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <p className="text-lg font-semibold text-primary">
                          {item.type}
                      </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/restau-bar/${item.id}`}>
                        Découvrir
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
