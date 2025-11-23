
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, Cookie, User } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="section-title">Sécurité et Confidentialité</CardTitle>
              <p className="section-subtitle">
                Votre confiance et votre sécurité sont notre priorité absolue.
              </p>
            </CardHeader>
            <CardContent className="space-y-8 p-8 text-lg text-muted-foreground">
              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
                  Notre Engagement
                </h2>
                <p>
                  À l'Hôtel Karibuni, nous nous engageons à protéger la vie privée de nos clients. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons et les mesures que nous prenons pour garantir leur sécurité.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <User className="mr-3 h-7 w-7 text-primary" />
                  Collecte des informations
                </h2>
                <p>
                  Nous collectons des informations lorsque vous effectuez une demande de réservation sur notre site. Les informations collectées incluent votre nom, votre numéro de téléphone et votre adresse e-mail. Ces informations sont nécessaires pour traiter votre demande et vous offrir un service client de qualité.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Lock className="mr-3 h-7 w-7 text-primary" />
                  Utilisation et Sécurité des informations
                </h2>
                <p>
                  Toutes les informations que nous collectons sont exclusivement utilisées dans le cadre de votre réservation et pour communiquer avec vous. Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Celles-ci sont stockées dans des environnements sécurisés et ne sont accessibles qu'à un nombre limité de personnes qui ont des droits d'accès spéciaux et sont tenues de respecter la confidentialité de ces informations.
                </p>
                <p className="mt-2">
                  Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Cookie className="mr-3 h-7 w-7 text-primary" />
                  Utilisation des Cookies
                </h2>
                <p>
                  Notre site utilise des cookies pour améliorer l'expérience utilisateur, notamment pour la gestion des thèmes (clair/sombre) et pour analyser le trafic de manière anonyme. Les cookies sont de petits fichiers qu'un site transfère sur le disque dur de votre ordinateur par l'intermédiaire de votre navigateur Web (si vous l'autorisez). Ils ne collectent aucune information personnelle.
                </p>
              </section>
              
               <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                  Vos Droits
                </h2>
                <p>
                  Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter via les informations fournies sur notre page de contact.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                  Consentement
                </h2>
                <p>
                  En utilisant notre site, vous consentez à notre politique de confidentialité.
                </p>
              </section>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
