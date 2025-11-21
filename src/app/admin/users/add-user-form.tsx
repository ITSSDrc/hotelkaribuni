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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const userProfileFormSchema = z.object({
  displayName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères.'),
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  role: z.enum(['superadmin', 'receptionist', 'stock_manager', 'guest']),
  // We remove password as we are not creating an auth user anymore from the client.
});

type UserProfileFormValues = z.infer<typeof userProfileFormSchema>;

interface AddUserFormProps {
  onFinished?: () => void;
}

export default function AddUserForm({ onFinished }: AddUserFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      role: 'receptionist',
    },
  });

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erreur Firestore',
        description: 'La connexion à la base de données a échoué.',
      });
      return;
    }

    try {
      // This is not secure. A superadmin should be the only one to do this.
      // This will be handled by security rules. We are just creating the doc.
      // The UID will be missing, so this profile is incomplete until the user is created in Auth.
      await addDoc(collection(firestore, 'users'), {
        ...data,
        // The UID will be set manually or via a cloud function later
      });

      toast({
        title: 'Profil utilisateur créé !',
        description: `Le profil pour ${data.displayName} a été créé dans Firestore.`,
      });
      form.reset();
      onFinished?.();
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
        description: "Impossible de créer le profil utilisateur en base de données.",
      });
    }
  };

  return (
    <>
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Processus en 2 étapes</AlertTitle>
        <AlertDescription>
          Ceci créera uniquement le profil dans la base de données. Vous devrez ensuite créer manuellement le compte utilisateur correspondant dans la console Firebase (Authentication {'>'} Users) avec la même adresse e-mail.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Ex: jean.dupont@karibuni.com" {...field} />
                </FormControl>
                <FormDescription>
                  Cette email doit correspondre à celle du compte que vous créerez dans Firebase Auth.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="receptionist">Réceptionniste</SelectItem>
                    <SelectItem value="stock_manager">Gestionnaire de stock</SelectItem>
                    <SelectItem value="superadmin">Super-admin</SelectItem>
                    <SelectItem value="guest">Client (Guest)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {form.formState.isSubmitting ? 'Création en cours...' : "Créer le profil"}
              </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
