
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addRoom } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const roomFormSchema = z.object({
  name: z.string().min(5, 'Le nom doit contenir au moins 5 caractères.'),
  type: z.enum(['Standard', 'Deluxe', 'Suite']),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  imageUrl: z.string().url("L'URL de l'image doit être valide."),
  status: z.enum(['Disponible', 'Occupée', 'En nettoyage']),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

export default function AddRoomPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      type: 'Standard',
      price: 0,
      description: '',
      imageUrl: '',
      status: 'Disponible',
    },
  });

  const onSubmit = async (data: RoomFormValues) => {
    try {
      await addRoom(data);
      toast({
        title: 'Chambre ajoutée !',
        description: `La chambre "${data.name}" a été créée avec succès.`,
      });
      router.push('/admin/rooms');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
        description: "Impossible d'ajouter la chambre. Veuillez réessayer.",
      });
    }
  };

  return (
    <>
       <header className="mb-8 flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/admin/rooms">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Link>
         </Button>
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Ajouter une nouvelle chambre
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Remplissez les détails ci-dessous pour créer une nouvelle chambre.
            </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la chambre</CardTitle>
          <CardDescription>
            Fournissez toutes les informations nécessaires sur la nouvelle chambre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la chambre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Suite Océan" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le nom affiché publiquement pour la chambre.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type de chambre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prix par nuit (€)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Ex: 150" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez la chambre, ses équipements, sa vue, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Statut Initial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un statut" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Disponible">Disponible</SelectItem>
                            <SelectItem value="Occupée">Occupée</SelectItem>
                            <SelectItem value="En nettoyage">En nettoyage</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? 'Ajout en cours...' : 'Ajouter la chambre'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
