
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImageIcon, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const roomFormSchema = z.object({
  name: z.string().min(5, 'Le nom doit contenir au moins 5 caractères.'),
  type: z.enum(['Standard', 'Deluxe', 'Suite']),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  imageUrl: z.string().url("L'URL de l'image est requise et doit être valide."),
  status: z.enum(['Disponible', 'Occupée', 'En nettoyage']),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface AddRoomFormProps {
  onFinished?: () => void;
}

export default function AddRoomForm({ onFinished }: AddRoomFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [preview, setPreview] = useState<string | null>(null);

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

  const generateRandomImage = () => {
    const seed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${seed}/1200/800`;
    form.setValue('imageUrl', imageUrl);
    setPreview(imageUrl);
  };
  
  const onSubmit = (data: RoomFormValues) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'La base de données n\'est pas prête. Veuillez réessayer.',
      });
      return;
    }
    
    const roomsCollectionRef = collection(firestore, 'rooms');
    
    addDoc(roomsCollectionRef, data)
      .then(() => {
        toast({
          title: 'Chambre ajoutée !',
          description: `La chambre "${data.name}" a été créée avec succès.`,
        });
        form.reset();
        setPreview(null);
        onFinished?.();
      })
      .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
              path: roomsCollectionRef.path,
              operation: 'create',
              requestResourceData: data,
          });
          errorEmitter.emit('permission-error', permissionError);
          
          toast({
              variant: 'destructive',
              title: 'Oh non ! Erreur de permission.',
              description: "Vous n'avez pas les droits pour ajouter une chambre.",
          });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la chambre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Suite Océan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="min-h-[100px]"
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
              <FormLabel>Image de la chambre</FormLabel>
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex h-32 w-48 flex-shrink-0 items-center justify-center rounded-md border border-dashed">
                  {preview ? (
                    <Image src={preview} alt="Aperçu de l'image" fill className="object-cover rounded-md" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className='flex flex-row sm:flex-col gap-2'>
                   <Button type="button" variant="secondary" size="sm" onClick={generateRandomImage}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Générer une image
                  </Button>
                </div>
              </div>
              <FormDescription>
                Cliquez sur "Générer" pour obtenir une image aléatoire. Le téléversement de fichiers sera bientôt disponible.
              </FormDescription>
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

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? 'Ajout en cours...' : 'Ajouter la chambre'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
