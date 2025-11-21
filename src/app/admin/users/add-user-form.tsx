
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { createUser } from '@/lib/user-actions';
import { Loader2 } from 'lucide-react';

const userFormSchema = z.object({
  displayName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères.'),
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  role: z.enum(['superadmin', 'receptionist', 'stock_manager']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AddUserFormProps {
  onFinished?: () => void;
}

export default function AddUserForm({ onFinished }: AddUserFormProps) {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      role: 'receptionist',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    const result = await createUser(data);

    if (result && result.success) {
      toast({
        title: 'Utilisateur créé !',
        description: `Le compte pour ${data.displayName} a été créé avec succès.`,
      });
      form.reset();
      onFinished?.();
    } else {
        const errorMessage = result.error || "Impossible de créer l'utilisateur.";
        toast({
            variant: 'destructive',
            title: 'Oh non ! Une erreur est survenue.',
            description: errorMessage,
        });
    }
  };

  return (
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe temporaire" {...field} />
              </FormControl>
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
