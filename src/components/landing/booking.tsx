'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const bookingFormSchema = z.object({
  dateRange: z.object(
    {
      from: z.date({ required_error: 'Date d\'arrivée requise.' }),
      to: z.date({ required_error: 'Date de départ requise.' }),
    },
    { required_error: 'Veuillez sélectionner une période.' }
  ),
  guests: z.string().min(1, 'Veuillez sélectionner le nombre d\'hôtes.'),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Booking() {
  const { toast } = useToast();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: '2',
    },
  });

  function onSubmit(data: BookingFormValues) {
    toast({
      title: 'Vérification de la disponibilité...',
      description: `Recherche de chambres du ${format(data.dateRange.from, 'dd LLL y', { locale: fr })} au ${format(data.dateRange.to, 'dd LLL y', { locale: fr })} for ${data.guests} hôte(s).`,
    });
  }

  return (
    <section id="reservation" className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-4xl shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl font-bold md:text-5xl">Réservez Votre Séjour</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end">
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
                                'w-full justify-start text-left font-normal',
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
                          <SelectTrigger>
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

                <Button type="submit" className="w-full h-10 md:h-auto">Vérifier la disponibilité</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
