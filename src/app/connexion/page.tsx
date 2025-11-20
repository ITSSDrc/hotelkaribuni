'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useFirebase } from '@/firebase';

const loginFormSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse e-mail valide.'),
  password: z.string().min(7, 'Le mot de passe doit contenir au moins 7 caractères.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function ConnexionPage() {
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast({
        title: 'Connexion réussie !',
        description: 'Vous êtes maintenant connecté.',
      });

      // Check user role for redirection
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.role === 'superadmin') {
            router.push('/admin');
            return;
          }
        }
      }

      router.push('/');

    } catch (error: any) {
      let description = "Une erreur est survenue lors de la connexion.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "L'adresse e-mail ou le mot de passe est incorrect.";
      } else {
        console.error("Firebase Auth Error:", error);
        description = error.message || description;
      }
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: description,
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background py-12">
        <Card className="mx-auto w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Accédez à votre compte pour gérer vos réservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre.email@example.com" {...field} />
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
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <Link href="#" className="underline hover:text-primary">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
