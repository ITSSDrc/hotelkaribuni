
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TriangleAlert } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <TriangleAlert className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="section-title">Avis de Non-Responsabilité</CardTitle>
              <p className="section-subtitle">
                Informations légales concernant l'utilisation de notre site.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-8 text-muted-foreground">
              <p>
                Hôtel Karibuni ("nous", "notre") fournit l’information présentée sur ce site web (le "Site web") uniquement à des fins d’information.
              </p>
              <p>
                Votre usage du Site web est régi par ce Disclaimer et notre Politique sur la Vie Privée. Toute réservation de chambre que vous faites avec nous sera en outre soumise à nos Conditions Générales, ainsi qu’aux conditions de notre opérateur de réservation de chambre.
              </p>
              <p>
                En utilisant une partie du Site web et/ou en nous soumettant une information par le Site web, vous marquez votre accord sur les conditions prévues dans ce Disclaimer et notre Politique sur la Vie Privée, et vous marquez votre accord sur le fait que vos données personnelles obtenues par le Site web peuvent être traitées conformément à notre Politique sur la Vie Privée.
              </p>
              <p>
                Si vous avez des questions concernant ces documents, veuillez nous contacter à l’adresse e-mail suivante : contact@karibuni-bunia.com.
              </p>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Pas d’utilisation illégitime ou interdite</h2>
                <p>
                  Vous vous engagez à ne pas utiliser le Site web pour une utilisation illégitime ou interdite par ce Disclaimer. Vous ne pouvez utiliser le Site web d’une quelconque manière qui pourrait endommager, mettre hors d’état, surcharger ou détériorer le Site web ou interférer avec l’utilisation et la jouissance du Site web par une autre partie. Vous ne pouvez pas obtenir ou tenter d’obtenir un quelconque matériel ou information par un quelconque moyen qui ne serait pas intentionnellement rendu disponible ou fourni par le Site web.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Liens de tiers</h2>
                <p>
                  Les liens aux sites web de tiers sur le Site web sont fournis uniquement pour votre information et votre facilité. Nous n’approuvons, ni ne contrôlons, ni sommes responsables du contenu ou matériel disponible sur ces sites web ou des résultats qui peuvent être obtenus en les utilisant. L’accès à des sites web de tiers par le Site web se fait entièrement à vos propres risques.
                </p>
                <p>
                  Nous ne sommes pas responsables pour l’utilisation de vos informations personnelles par des sites web de tiers accessibles via le Site web. Avant de fournir une quelconque information personnelle, vous devriez passer en revue attentivement les règles relatives à la vie privée de tels sites web.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Représentations, garanties et limitation de responsabilité</h2>
                <p>
                  Le Site web est créé et entretenu par nous avec les plus grands soins. Cependant, nous ne pouvons garantir que toutes les informations sur le Site web seront correctes en permanence. Vous acceptez que de telles informations, en particulier concernant les services offerts et leurs prix, peuvent être modifiées ou retirées sans préavis.
                </p>
                <p>
                  Vous acceptez également que, dans la limite autorisée par la loi, Hôtel Karibuni ne sera pas responsable contractuellement ou extra-contractuellement pour toute perte ou dommage direct ou indirect (en ce compris la perte anticipée de bénéfice, la perte d’une chance, la perte de données, les coûts et amendes) qui surviennent de, ou qui sont liés d’une quelconque manière au : (i) Site web, en ce compris son indisponibilité ou son fonctionnement technique ; (ii) le contenu du Site web; (iii) les virus, le piratage informatique et/ou autres crimes informatiques; ou (iv) au contenu des sites web de tiers indiqués par le Site web. De plus, vous nous indemniserez, vous nous défendrez et vous nous couvrirez contre toute violation d’une disposition de ce Disclaimer que vous commettez.
                </p>
                <p>
                  Rien dans ce Disclaimer n’exclut la responsabilité pour dol ou faute lourde.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Propriété intellectuelle</h2>
                <p>
                  Tout contenu disponible sur le Site web, incluant – sans s’y limiter – le texte, les graphiques, logos, boutons, icônes, images, vidéos, clips audio, compilations de données et logiciel (ensemble le “Contenu”) est la propriété de Hôtel Karibuni ou ses partenaires et est protégé par le droit d’auteur applicable. Toute utilisation du Contenu pour une finalité autre que le rassemblement d’informations nous concernant ou pour la réservation d’une chambre est interdite sans notre consentement préalable. De plus, rien dans ce Disclaimer ne pourra être interprété comme vous octroyant une licence ou un droit d’utiliser les marques présentes sur le Site web (qu’elles soient enregistrées ou non).
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Autres dispositions</h2>
                <p>
                  Si une disposition de ce Disclaimer s’avérait illégale, non valide ou inapplicable en tout ou en partie, les autres dispositions de ce Disclaimer continueront d’être valides ainsi que le reste de la disposition affectée.
                </p>
                <p>
                  Nous nous réservons le droit de changer ce Disclaimer à tout moment. Etant donné que tous les changements seront indiqués sur le Site web, nous vous conseillons de vérifier régulièrement le Site web pour les changements. Les changements seront effectifs trente (30) jours après leur mise en ligne sur le Site web. Votre utilisation continue du Site web constitue un consentement de votre part sur ces changements.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-3">Loi applicable et tribunaux compétents</h2>
                <p>
                  Ce Site web et l’utilisation que vous en faites seront gouvernés par le droit applicable en République Démocratique du Congo. Tout litige qui peut survenir du fait ou en relation avec votre utilisation du Site web sera soumis à la compétence exclusive des tribunaux de Bunia.
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
