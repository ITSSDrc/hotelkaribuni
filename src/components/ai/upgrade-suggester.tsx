'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Sparkles, ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { aiAssistedRoomUpgradeSuggestions, type RoomUpgradeSuggestionsOutput } from '@/ai/flows/ai-assisted-room-upgrade-suggestions';

const formSchema = z.object({
  interests: z.string().min(3, 'Veuillez entrer au moins un intérêt.'),
  purposeOfStay: z.enum(['loisir', 'affaire', 'romantique', 'famille']),
  budget: z.enum(['economique', 'moyen', 'eleve']),
  roomType: z.enum(['standard', 'deluxe', 'suite']),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpgradeSuggester() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<RoomUpgradeSuggestionsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      purposeOfStay: 'loisir',
      budget: 'moyen',
      roomType: 'standard',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await aiAssistedRoomUpgradeSuggestions({
        guestProfile: {
          age: 35, // Mock data
          interests: data.interests.split(',').map(s => s.trim()),
          previousStays: 1, // Mock data
          spendingHabits: data.budget,
        },
        bookingDetails: {
          roomType: data.roomType,
          numberOfNights: 5, // Mock data
          purposeOfStay: data.purposeOfStay,
          budget: data.budget,
        },
      });
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de générer la suggestion. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assistant de Surclassement IA</CardTitle>
        <CardDescription>
          Remplissez vos informations pour recevoir des suggestions de surclassement de chambre personnalisées et améliorer votre séjour.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intérêts</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: plage, spa, lecture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purposeOfStay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif du séjour</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="loisir">Loisir</SelectItem>
                        <SelectItem value="affaire">Affaire</SelectItem>
                        <SelectItem value="romantique">Romantique</SelectItem>
                        <SelectItem value="famille">Famille</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="economique">Économique</SelectItem>
                        <SelectItem value="moyen">Moyen</SelectItem>
                        <SelectItem value="eleve">Élevé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chambre Actuelle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recherche...</>
              ) : (
                'Suggérer un Surclassement'
              )}
            </Button>
          </form>
        </Form>

        {suggestion && (
          <div className="mt-8 rounded-lg border bg-background p-6">
            <h3 className="mb-4 flex items-center font-headline text-xl font-semibold">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              Nos Suggestions Pour Vous
            </h3>
            <ul className="mb-4 space-y-2">
              {suggestion.upgradeSuggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowUp className="mt-1 h-4 w-4 text-primary" />
                  <span className='font-medium'>{s}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic">{suggestion.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
