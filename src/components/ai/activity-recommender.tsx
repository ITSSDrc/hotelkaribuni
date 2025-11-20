'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getActivityRecommendations } from '@/ai/flows/personalized-activity-recommendations';

const formSchema = z.object({
  preferences: z.string().min(10, 'Veuillez décrire vos préférences (au moins 10 caractères).'),
  stayDuration: z.coerce.number().min(1, 'La durée doit être d\'au moins 1 jour.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ActivityRecommender() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: '',
      stayDuration: 3,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setRecommendations('');
    try {
      const result = await getActivityRecommendations({
        ...data,
        stayDuration: String(data.stayDuration),
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de générer les recommandations. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planificateur d'Activités IA</CardTitle>
        <CardDescription>
          Décrivez vos centres d'intérêt (par ex. "détente, nature, gastronomie locale") et la durée de votre séjour, et nous vous proposerons un programme sur mesure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vos Préférences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: J'aime la randonnée, les musées d'art et les bons restaurants de fruits de mer." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stayDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée du séjour (en jours)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Obtenir des recommandations'
              )}
            </Button>
          </form>
        </Form>

        {recommendations && (
          <div className="mt-8 rounded-lg border bg-background p-6">
            <h3 className="mb-4 flex items-center font-headline text-xl font-semibold">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              Vos Activités Recommandées
            </h3>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {recommendations}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
