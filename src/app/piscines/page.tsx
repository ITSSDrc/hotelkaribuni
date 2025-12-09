
'use client';

import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaticData } from '@/lib/static-data';
import { Sun, Wind, Waves, Martini, Umbrella, ToyBrick, TriangleAlert } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
    Umbrella,
    Martini,
    ToyBrick,
};


export default function PiscinesPage() {
  const piscine = StaticData.piscines[0]; // On prend la seule piscine disponible

  if (!piscine) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <p>Informations sur la piscine non disponibles.</p>
            </main>
            <Footer />
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center text-white overflow-hidden">
             <div className="absolute inset-0">
                <Image
                    src={(piscine.imageUrls && piscine.imageUrls[0]) || "https://placehold.co/1920x1080"}
                    alt={piscine.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            </div>
            <div className="relative z-10 text-center px-4">
                 <h1 className="font-headline text-5xl font-bold md:text-7xl text-shadow">Oasis de Fraîcheur</h1>
                  <p className="mx-auto mt-4 max-w-2xl text-xl text-white/90">
                    Plongez dans un havre de paix et de détente.
                  </p>
            </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                 <div>
                    <h2 className="section-title text-4xl mb-4">Un Lagon Bleu à Bunia</h2>
                    <p className="text-lg text-muted-foreground">
                        Échappez à la chaleur et à l'agitation dans notre magnifique piscine extérieure. Conçue comme une oasis de tranquillité, elle est l'endroit idéal pour vous rafraîchir, vous prélasser au soleil ou simplement savourer un moment de calme. L'eau scintillante vous invite à un bain relaxant à toute heure de la journée.
                    </p>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative aspect-square h-auto w-full overflow-hidden rounded-lg shadow-lg">
                        <Image src="/images/principal-2.jpg" alt="Détente au bord de la piscine" fill className="object-cover"/>
                    </div>
                    <div className="relative aspect-square h-auto w-full overflow-hidden rounded-lg shadow-lg mt-8">
                        <Image src="/images/principal-3.jpg" alt="Ambiance de la piscine" fill className="object-cover"/>
                    </div>
                 </div>
            </div>

            <Card className="mb-20 bg-muted/50 border-0">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-center">Services & Ambiance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Umbrella className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Confort Absolu</h3>
                        <p className="text-muted-foreground">Des transats confortables et des parasols sont à votre disposition pour une journée de farniente parfaite.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Martini className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Bar de Piscine</h3>
                        <p className="text-muted-foreground">Notre bar vous propose des boissons rafraîchissantes, des jus frais et des cocktails exotiques à siroter au bord de l'eau.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Waves className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Plaisir pour Tous</h3>
                        <p className="text-muted-foreground">Un espace est spécialement aménagé pour que les plus jeunes puissent s'amuser en toute sécurité.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-yellow-500/50 bg-yellow-500/5 dark:bg-yellow-500/10">
                <CardHeader className="flex-row items-center gap-4">
                    <TriangleAlert className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                    <CardTitle className="text-yellow-600 dark:text-yellow-400 font-headline text-2xl">Avertissement de Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-yellow-700 dark:text-yellow-300/80">
                        La baignade est non surveillée. Pour votre sécurité, il est impératif de savoir nager. Les enfants doivent être accompagnés et rester sous la surveillance constante d'un adulte responsable. La direction décline toute responsabilité en cas d'incident.
                    </p>
                </CardContent>
            </Card>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
