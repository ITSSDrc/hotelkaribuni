
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
import { ArrowLeft, Loader2, ImageIcon, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];


const roomFormSchema = z.object({
  name: z.string().min(5, 'Le nom doit contenir au moins 5 caractères.'),
  type: z.enum(['Standard', 'Deluxe', 'Suite']),
  price: z.coerce.number().min(1, 'Le prix doit être supérieur à 0.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  image: z
    .any()
    .refine(
        (value) => {
            // If it's a string, it's the placeholder URL, which is valid.
            if (typeof value === 'string') return true;
            // If it's a file, check its properties.
            return value?.size > 0 && ACCEPTED_IMAGE_TYPES.includes(value?.type);
        },
        { message: "Veuillez sélectionner une image valide (JPG, PNG, WebP)." }
    )
    .refine((value) => typeof value === 'string' || value?.size <= MAX_FILE_SIZE, {
        message: `La taille du fichier ne doit pas dépasser 5 Mo.`,
    }),
  status: z.enum(['Disponible', 'Occupée', 'En nettoyage']),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

export default function AddRoomPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      type: 'Standard',
      price: 0,
      description: '',
      image: undefined,
      status: 'Disponible',
    },
  });
  
  const generateRandomImage = () => {
    const seed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${seed}/1200/800`;
    form.setValue('image', imageUrl);
    setPreview(imageUrl);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (data: RoomFormValues) => {
    try {
      let imageUrl = '';
      if (data.image instanceof File) {
         // This is a workaround. In a real app, you'd upload to a storage service
         // and get a URL. Here we convert the image to a base64 data URL.
         const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
        imageUrl = await toBase64(data.image);
      } else if (typeof data.image === 'string') {
        imageUrl = data.image;
      }
      
      if (!imageUrl) {
        throw new Error("L'image est requise.");
      }

      await addRoom({ ...data, imageUrl });

      toast({
        title: 'Chambre ajoutée !',
        description: `La chambre "${data.name}" a été créée avec succès.`,
      });
      router.push('/admin/rooms');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Impossible d'ajouter la chambre. Veuillez réessayer.";
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
        description: errorMessage,
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

              <FormItem>
                <FormLabel>Image de la chambre</FormLabel>
                <div className="flex items-center gap-4">
                    <div className="relative flex h-32 w-48 flex-shrink-0 items-center justify-center rounded-md border border-dashed">
                        {preview ? (
                        <Image src={preview} alt="Aperçu de l'image" fill className="object-cover rounded-md" />
                        ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Button type="button" asChild variant="outline">
                            <label htmlFor="image-upload" className="cursor-pointer">
                                Téléverser une image
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="sr-only"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={handleImageChange}
                                />
                            </label>
                        </Button>
                        <Button type="button" variant="secondary" onClick={generateRandomImage}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Générer une image
                        </Button>
                    </div>
                </div>
                <FormDescription>
                  Téléversez une image ou générez-en une aléatoirement. Taille max : 5Mo.
                </FormDescription>
                <FormMessage />
              </FormItem>

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

    