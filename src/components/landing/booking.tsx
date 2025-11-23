
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';

const bookingFormSchema = z.object({
  dateRange: z.object(
    {
      from: z.date({ required_error: "Date d'arrivée requise." }),
      to: z.date({ required_error: 'Date de départ requise.' }),
    },
    { required_error: 'Veuillez sélectionner une période.' }
  ),
  guests: z.string().min(1, "Veuillez sélectionner le nombre d'hôtes."),
  phone: z.string().min(10, 'Veuillez entrer un numéro de téléphone valide.'),
  email: z.string().email("Veuillez entrer une adresse e-mail valide.").optional().or(z.literal('')),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Booking() {
  const router = useRouter();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: '1',
      phone: '',
      email: '',
    },
  });

  function onSubmit(data: BookingFormValues) {
    const { from, to } = data.dateRange;
    
    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
      guests: data.guests,
      phone: data.phone,
    });

    if (data.email) {
      params.set('email', data.email);
    }

    router.push(`/reservation/confirmation?${params.toString()}`);
  }

  return (
    <section id="reservation" className="bg-background py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-4xl shadow-2xl shadow-primary/10 border-primary/20">
          <CardHeader className="text-center p-8">
            <CardTitle className="section-title">Planifiez Votre Escapade</CardTitle>
            <CardDescription className="section-subtitle">
              Vérifiez nos disponibilités et réservez votre séjour de rêve en quelques clics.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Arrivée - Départ</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal h-12',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, 'dd LLL y', { locale: fr })} -{' '}
                                    {format(field.value.to, 'dd LLL y', { locale: fr })}
                                  </>
                                ) : (
                                  format(field.value.from, 'dd LLL y', { locale: fr })
                                )
                              ) : (
                                <span>Choisissez vos dates</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                            locale={fr}
                            disabled={{ before: new Date() }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hôtes</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <Users className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Nombre d'hôtes" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num} Hôte{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Votre numéro de téléphone" {...field} className="h-12 pl-10" />
                        </div>
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
                      <FormLabel>Email (Facultatif)</FormLabel>
                       <FormControl>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="votre.email@example.com" {...field} className="h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full h-12 md:col-span-2">Envoyer la demande</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
