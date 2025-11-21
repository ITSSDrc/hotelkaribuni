
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
import { Loader2, ImageIcon, RefreshCw, X, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent } from '@/components/ui/card';

const roomFormSchema = z.object({
  name: z.string().min(5, 'Le nom doit contenir au moins 5 caractères.'),
  type: z.enum(['Standard', 'Deluxe', 'Suite']),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  imageUrls: z.array(z.string().url("L'URL de l'image est requise et doit être valide.")).min(1, "Au moins une image est requise."),
  status: z.enum(['Disponible', 'Occupée', 'En nettoyage']),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface EditRoomFormProps {
  onFinished?: () => void;
  initialData?: any;
}

const generateRandomImageUrl = () => `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/1200/800`;

export default function EditRoomForm({ onFinished, initialData }: EditRoomFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      type: 'Standard',
      price: 0,
      description: '',
      imageUrls: [],
      status: 'Disponible',
      ...initialData,
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        imageUrls: initialData.imageUrls || [],
      });
    }
  }, [initialData, form]);

  const replaceGallery = () => {
    const newUrls = Array.from({ length: 3 }, generateRandomImageUrl);
    form.setValue('imageUrls', newUrls, { shouldValidate: true, shouldDirty: true });
  };
  
  const addImage = () => {
    const currentUrls = form.getValues('imageUrls');
    form.setValue('imageUrls', [...currentUrls, generateRandomImageUrl()], { shouldValidate: true, shouldDirty: true });
  };

  const removeImage = (index: number) => {
    const currentUrls = form.getValues('imageUrls');
    form.setValue('imageUrls', currentUrls.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
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
    
    if(initialData) {
        // Update existing room
        const roomDocRef = doc(firestore, 'rooms', initialData.id);
        setDoc(roomDocRef, data, { merge: true })
            .then(() => {
                toast({
                    title: 'Chambre modifiée !',
                    description: `La chambre "${data.name}" a été mise à jour.`,
                });
                onFinished?.();
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: roomDocRef.path,
                    operation: 'update',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
    } else {
        // Add new room
        const roomsCollectionRef = collection(firestore, 'rooms');
        addDoc(roomsCollectionRef, data)
          .then(() => {
            toast({
              title: 'Chambre ajoutée !',
              description: `La chambre "${data.name}" a été créée avec succès.`,
            });
            form.reset();
            onFinished?.();
          })
          .catch((serverError) => {
              const permissionError = new FirestorePermissionError({
                  path: roomsCollectionRef.path,
                  operation: 'create',
                  requestResourceData: data,
              });
              errorEmitter.emit('permission-error', permissionError);
          });
    }
  };

  const imageUrls = form.watch('imageUrls');

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
          name="imageUrls"
          render={() => (
            <FormItem>
              <FormLabel>Galerie d'images</FormLabel>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imageUrls && imageUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-video">
                        <Image
                          src={url}
                          alt={`Aperçu ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Supprimer l'image</span>
                        </Button>
                      </div>
                    ))}
                    {!imageUrls || imageUrls.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center h-32 border border-dashed rounded-md">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Aucune image</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={addImage}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter une image
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={replaceGallery}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Remplacer la galerie
                </Button>
              </div>
              <FormDescription>
                Gérez la galerie d'images pour cette chambre.
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
                {form.formState.isSubmitting 
                    ? (initialData ? 'Modification en cours...' : 'Ajout en cours...') 
                    : (initialData ? 'Modifier la chambre' : 'Ajouter la chambre')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
