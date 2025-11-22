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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Veuillez entrer une adresse e-mail valide.'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  function onSubmit(data: ContactFormValues) {
    console.log(data);
    toast({
      title: 'Message envoyé !',
      description: 'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.',
    });
    form.reset({ name: '', email: '', message: ''});
  }

  return (
    <section id="contact" className="bg-background py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-2xl shadow-2xl shadow-primary/10 border-primary/20">
          <CardHeader className="text-center p-8">
            <CardTitle className="section-title">Contactez-nous</CardTitle>
            <CardDescription className="section-subtitle">
              Une question ou une demande particulière ? Nous sommes à votre écoute.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom complet" {...field} className="h-12" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="votre.email@example.com" {...field} className="h-12"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Écrivez votre message ici..." className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full h-12">Envoyer le message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
