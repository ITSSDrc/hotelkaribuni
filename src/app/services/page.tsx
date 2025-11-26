
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Wifi, ParkingCircle, Presentation, Waves, Utensils, Award, Users, Tv } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ServicesPage() {
    const servicesImage = PlaceHolderImages.find(img => img.id === 'gallery-1');

    const services = [
        {
            icon: ParkingCircle,
            title: "Parking Sécurisé",
            description: "Profitez de notre grand parking gratuit et sécurisé, disponible 24h/24 pour tous nos clients."
        },
        {
            icon: ShieldCheck,
            title: "Sécurité 24/7",
            description: "Votre tranquillité d'esprit est notre priorité. Nos équipes assurent une surveillance constante de l'établissement."
        },
        {
            icon: Wifi,
            title: "Connexion Internet",
            description: "Restez connecté grâce à notre Wi-Fi disponible dans les chambres climatisées et les espaces communs comme le restaurant."
        },
        {
            icon: Presentation,
            title: "Salles d'Événements",
            description: "Des espaces modulables et entièrement équipés pour vos conférences, séminaires, mariages et réunions."
        },
        {
            icon: Waves,
            title: "Piscines",
            description: "Détendez-vous dans nos piscines, conçues comme une oasis de fraîcheur pour adultes et enfants."
        },
        {
            icon: Utensils,
            title: "Restaurant & Bar",
            description: "Savourez une cuisine raffinée et des cocktails créatifs dans nos espaces de restauration à l'ambiance unique."
        }
    ];

    const advantages = [
        {
            icon: Award,
            title: "Qualité de Service",
            description: "Une équipe dévouée et professionnelle à votre écoute pour faire de votre séjour un moment d'exception."
        },
        {
            icon: Users,
            title: "Personnel Qualifié",
            description: "Notre personnel est formé pour répondre à vos moindres besoins avec efficacité et discrétion."
        },
        {
            icon: Tv,
            title: "Abonnement TV",
            description: "Toutes nos chambres sont équipées de télévisions avec un large bouquet de chaînes nationales et internationales."
        }
    ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="section-title">Nos Infrastructures et Services</h1>
            <p className="section-subtitle">
              Découvrez tout ce que l'Hôtel Karibuni met à votre disposition pour un séjour parfait à Bunia.
            </p>
          </div>
          
           {servicesImage && (
              <Card className="mb-16 overflow-hidden shadow-lg">
                <div className="relative h-64 w-full md:h-96">
                    <Image
                    src={servicesImage.imageUrl}
                    alt={servicesImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={servicesImage.imageHint}
                    priority
                    />
                </div>
              </Card>
            )}

          <div className="mb-16">
              <h2 className="text-center section-title text-4xl mb-12">Nos Infrastructures Clés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Card key={index} className="text-center hover:shadow-primary/10 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <service.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{service.description}</p>
                        </CardContent>
                    </Card>
                ))}
              </div>
          </div>
          
          <div>
              <h2 className="text-center section-title text-4xl mb-12">Nos Avantages Compétitifs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {advantages.map((advantage, index) => (
                    <Card key={index} className="text-center bg-card">
                        <CardHeader>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <advantage.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">{advantage.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{advantage.description}</p>
                        </CardContent>
                    </Card>
                ))}
              </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
