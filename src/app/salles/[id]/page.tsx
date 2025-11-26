
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Users, Info, CalendarCheck, MonitorPlay, Presentation, Wifi, Volume2, AirVent, Wind, Martini, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StaticData } from '@/lib/static-data';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const iconMap: { [key: string]: React.ElementType } = {
    MonitorPlay,
    Presentation,
    Wifi,
    Volume2,
    AirVent,
    Wind,
    Martini,
    Music,
};

const quoteFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Veuillez entrer une adresse e-mail valide.'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères.'),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;


function QuoteForm({ roomName }: { roomName: string }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { name: '', email: '', message: `Bonjour, j'aimerais recevoir un devis pour la location de la salle "${roomName}". Merci.` },
  });

  async function onSubmit(data: QuoteFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: `Demande de devis pour : ${roomName}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Une erreur s'est produite.");
      }

      toast({
        title: 'Demande envoyée !',
        description: 'Merci, nous avons bien reçu votre demande de devis et vous répondrons bientôt.',
      });
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
            <CalendarCheck className='mr-2 h-5 w-5' />
            Demander un devis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Demande de devis : {roomName}</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire et notre équipe vous contactera rapidement avec une proposition.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl><Input placeholder="Votre nom" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="votre.email@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre message</FormLabel>
                  <FormControl><Textarea placeholder="Précisez vos besoins (dates, nombre de personnes, etc.)" {...field} className="min-h-[100px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer la demande
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function SalleDetailPage() {
  const params = useParams();
  const { id } = params;

  const salle = StaticData.salles.find(s => s.id === id);

  if (!salle) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Salle non trouvée.</p>
      </div>
    );
  }
  
  const salleData = salle as any;
  const galleryImages = salleData.imageUrls && salleData.imageUrls.length > 0
    ? salleData.imageUrls
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-4">
                {galleryImages.length > 0 ? (
                    <Carousel className="w-full">
                    <CarouselContent>
                        {galleryImages.map((url: string, index: number) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                                src={url}
                                alt={`${salleData.name} - image ${index + 1}`}
                                fill
                                priority={index === 0}
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                    </Carousel>
                ) : (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                       <p className='text-muted-foreground'>Pas d'image</p>
                    </div>
                )}
              </div>
              <div className="flex flex-col p-8 lg:col-span-2">
                <h1 className="font-headline text-4xl font-bold md:text-5xl mb-2">
                  {salleData.name}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {salleData.description}
                </p>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <span className="text-xl font-semibold">
                        Capacité : jusqu'à {salleData.capacity} personnes
                        </span>
                    </div>
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary" />
                     <Badge variant={salleData.status === 'Disponible' ? 'default' : 'destructive'} className="text-base">
                        {salleData.status}
                     </Badge>
                  </div>
                </div>

                 {salleData.amenities && salleData.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div className="mb-6">
                        <h2 className="text-xl font-headline font-semibold mb-4">Équipements Inclus</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {salleData.amenities.map((amenity: {name: string, icon: string}) => {
                                const Icon = iconMap[amenity.icon];
                                return (
                                <div key={amenity.name} className="flex items-center gap-3 text-muted-foreground">
                                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                                    <span>{amenity.name}</span>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                  </>
                )}

                <div className="mt-auto">
                    {salleData.status === 'Disponible' ? (
                        <QuoteForm roomName={salleData.name} />
                    ) : (
                        <Button size="lg" className="w-full" disabled>
                            <CalendarCheck className='mr-2 h-5 w-5' />
                            Indisponible
                        </Button>
                    )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
