import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityRecommender from "../ai/activity-recommender"
import UpgradeSuggester from "../ai/upgrade-suggester"

export default function AiRecommendations() {
  return (
    <section id="recommandations" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">
            Personnalisez Votre Expérience
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Laissez notre assistant IA vous aider à créer le séjour parfait, des activités locales aux surclassements de chambre.
          </p>
        </div>

        <Tabs defaultValue="activities" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activities">Activités Recommandées</TabsTrigger>
            <TabsTrigger value="upgrades">Suggérer un Surclassement</TabsTrigger>
          </TabsList>
          <TabsContent value="activities">
            <ActivityRecommender />
          </TabsContent>
          <TabsContent value="upgrades">
            <UpgradeSuggester />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
