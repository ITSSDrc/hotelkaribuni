
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
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const userRoleFormSchema = z.object({
  role: z.enum(['superadmin', 'receptionist', 'stock_manager', 'guest']),
});

type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

interface EditUserFormProps {
  onFinished?: () => void;
  initialData?: any;
}

export default function EditUserForm({ onFinished, initialData }: EditUserFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: {
      role: 'guest',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        role: initialData.role,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: UserRoleFormValues) => {
    if (!firestore || !initialData?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil. Données manquantes.',
      });
      return;
    }

    const userDocRef = doc(firestore, 'users', initialData.id);

    setDoc(userDocRef, { role: data.role }, { merge: true })
      .then(() => {
        toast({
          title: 'Profil mis à jour !',
          description: `Le rôle de ${initialData.displayName} a été défini sur ${data.role}.`,
        });
        onFinished?.();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { role: data.role },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
                {form.formState.isSubmitting ? 'Mise à jour...' : 'Mettre à jour le rôle'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
