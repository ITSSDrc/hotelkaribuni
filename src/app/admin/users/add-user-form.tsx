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
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const addUserFormSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Veuillez entrer une adresse e-mail valide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  role: z.enum(['superadmin', 'receptionist', 'stock_manager', 'guest']),
});

type AddUserFormValues = z.infer<typeof addUserFormSchema>;

interface AddUserFormProps {
  onFinished?: () => void;
}

const secondaryAppName = 'secondary';

// Initialize the secondary Firebase app if it doesn't exist
const getSecondaryApp = () => {
    const apps = getApps();
    const secondaryApp = apps.find(app => app.name === secondaryAppName);
    return secondaryApp || initializeApp(firebaseConfig, secondaryAppName);
}

export default function AddUserForm({ onFinished }: AddUserFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      role: 'receptionist',
    },
  });

  const onSubmit = async (data: AddUserFormValues) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'La base de données n\'est pas prête.',
      });
      return;
    }
    
    let secondaryAuth;
    try {
      const secondaryApp = getSecondaryApp();
      // We use browserLocalPersistence to avoid issues in some environments.
      secondaryAuth = initializeAuth(secondaryApp, {
          persistence: browserLocalPersistence
      });

      // 1. Create the user in the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
      const { user } = userCredential;

      // 2. Create the user profile document in Firestore with the new user's UID
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: data.displayName,
        email: data.email,
        role: data.role,
        photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(data.displayName)}`,
      });

      toast({
        title: 'Utilisateur créé !',
        description: `Le compte pour ${data.displayName} a été créé avec succès.`,
      });
      
      form.reset();
      onFinished?.();

    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = "Une erreur inconnue est survenue lors de la création.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Cette adresse e-mail est déjà utilisée par un autre compte.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
      }
      toast({
        variant: 'destructive',
        title: 'Échec de la création',
        description: errorMessage,
      });
    } finally {
        // 3. Sign out from the secondary auth instance to clean up
        if (secondaryAuth?.currentUser) {
            await signOut(secondaryAuth);
        }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
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
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe temporaire</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
               <FormDescription>
                L'utilisateur pourra le changer plus tard. 6 caractères minimum.
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
            {form.formState.isSubmitting ? 'Création en cours...' : "Créer l'utilisateur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
