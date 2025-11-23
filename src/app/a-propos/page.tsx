
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Heart, Trophy, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'gallery-1');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="section-title">Notre Histoire, Votre Maison</h1>
            <p className="section-subtitle">
              Découvrez l'âme et la passion qui animent l'Hôtel Karibuni depuis ses débuts.
            </p>
          </div>

          <Card className="mb-12 overflow-hidden shadow-lg">
             {aboutImage && (
                <div className="relative h-64 w-full md:h-96">
                    <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={aboutImage.imageHint}
                    priority
                    />
                </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-muted-foreground">
              <div className="space-y-4">
                  <h2 className="font-headline text-3xl font-semibold text-foreground flex items-center">
                    <Landmark className="mr-4 h-8 w-8 text-primary" />
                    Nos Racines
                  </h2>
                  <p>
                    Fondé avec la vision de créer une oasis de paix et de raffinement au cœur de Bunia, l'Hôtel Karibuni est plus qu'un simple lieu de séjour. C'est un projet né de l'amour pour la région de l'Ituri et du désir d'offrir une hospitalité authentique et chaleureuse. "Karibuni", qui signifie "Bienvenue" en swahili, est la promesse que nous faisons à chaque visiteur qui franchit nos portes.
                  </p>
              </div>
               <div className="space-y-4">
                  <h2 className="font-headline text-3xl font-semibold text-foreground flex items-center">
                    <Heart className="mr-4 h-8 w-8 text-primary" />
                    Notre Mission
                  </h2>
                  <p>
                   Notre mission est de vous offrir une expérience inoubliable, où le confort moderne rencontre le charme local. Nous nous engageons à fournir un service impeccable, une cuisine exquise et un cadre exceptionnel pour que chaque moment passé chez nous soit un souvenir précieux. Votre bien-être est notre priorité absolue.
                  </p>
              </div>
          </div>
          
          <div className="my-16">
              <h2 className="text-center section-title text-4xl mb-12">Nos Valeurs Fondamentales</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Excellence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Nous visons la perfection dans chaque détail, du service à la propreté, pour dépasser vos attentes.</p>
                    </CardContent>
                </Card>
                 <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Hospitalité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Chaleur, convivialité et service personnalisé sont au cœur de l'expérience Karibuni.</p>
                    </CardContent>
                </Card>
                 <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Landmark className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Intégrité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Nous agissons avec honnêteté et transparence envers nos clients, notre personnel et notre communauté.</p>
                    </CardContent>
                </Card>
              </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
