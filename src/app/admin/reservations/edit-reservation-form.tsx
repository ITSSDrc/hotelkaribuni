
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, writeBatch, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useCollection } from '@/firebase/firestore/use-collection';
import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const reservationFormSchema = z.object({
  guestName: z.string().min(2, 'Le nom du client est requis.'),
  roomId: z.string().min(1, 'Veuillez sélectionner une chambre.'),
  dateRange: z.object(
    {
      from: z.date({ required_error: "Date d'arrivée requise." }),
      to: z.date({ required_error: 'Date de départ requise.' }),
    },
    { required_error: 'Veuillez sélectionner une période.' }
  ).refine(data => data.to > data.from, {
    message: "La date de départ doit être après la date d'arrivée.",
    path: ['to'],
  }),
  numberOfGuests: z.coerce.number().min(1, 'Il doit y avoir au moins un client.'),
  status: z.enum(['Confirmée', 'En cours', 'Terminée', 'Annulée']),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface EditReservationFormProps {
  onFinished?: () => void;
  initialData?: any;
}

export default function EditReservationForm({ onFinished, initialData }: EditReservationFormProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const roomsCollectionRef = useMemo(() => collection(firestore, 'rooms'), [firestore]);
  const { data: rooms, isLoading: isLoadingRooms, forceRefetch: refetchRooms } = useCollection(roomsCollectionRef);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: initialData ? {
        ...initialData,
        dateRange: {
            from: new Date(initialData.checkInDate),
            to: new Date(initialData.checkOutDate)
        }
    } : {
      guestName: '',
      roomId: '',
      numberOfGuests: 1,
      status: 'Confirmée',
    },
  });

  const selectedRoomId = form.watch('roomId');
  const dateRange = form.watch('dateRange');

  const selectedRoom = useMemo(() => {
    return rooms?.find((r: any) => r.id === selectedRoomId) as any;
  }, [rooms, selectedRoomId]);

  const totalPrice = useMemo(() => {
    if (selectedRoom && dateRange?.from && dateRange?.to) {
      const numberOfNights = differenceInDays(dateRange.to, dateRange.from);
      return numberOfNights > 0 ? numberOfNights * selectedRoom.price : selectedRoom.price;
    }
    return 0;
  }, [selectedRoom, dateRange]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        dateRange: {
            from: new Date(initialData.checkInDate),
            to: new Date(initialData.checkOutDate)
        }
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: ReservationFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La base de données n\'est pas prête.' });
      return;
    }
    
    if (!selectedRoom) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La chambre sélectionnée est invalide.' });
      refetchRooms();
      return;
    }

    const reservationData = {
        guestName: data.guestName,
        roomId: data.roomId,
        numberOfGuests: data.numberOfGuests,
        status: data.status,
        roomName: selectedRoom.name,
        checkInDate: format(data.dateRange.from, 'yyyy-MM-dd'),
        checkOutDate: format(data.dateRange.to, 'yyyy-MM-dd'),
        totalPrice: totalPrice,
        createdAt: serverTimestamp()
    };


    if (initialData) { // Updating existing reservation
        const reservationRef = doc(firestore, "reservations", initialData.id);
        const batch = writeBatch(firestore);

        batch.update(reservationRef, reservationData);
        
        if(initialData.roomId !== data.roomId) {
            // Room has changed, update both old and new rooms
            const oldRoomRef = doc(firestore, "rooms", initialData.roomId);
            batch.update(oldRoomRef, { status: "Disponible" });
            const newRoomRef = doc(firestore, "rooms", data.roomId);
            batch.update(newRoomRef, { status: "Occupée" });
        }

        batch.commit()
            .then(() => {
                 toast({ title: 'Réservation modifiée !', description: 'La réservation a été mise à jour.' });
                 form.reset();
                 onFinished?.();
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: reservationRef.path,
                    operation: 'update',
                    requestResourceData: reservationData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });

    } else { // Creating a new reservation
      const roomRef = doc(firestore, 'rooms', data.roomId);
      const roomDoc = await getDoc(roomRef);
      if (!roomDoc.exists() || roomDoc.data().status !== 'Disponible') {
        toast({ variant: 'destructive', title: 'Action impossible', description: "Cette chambre n'est plus disponible. Veuillez rafraîchir et en choisir une autre." });
        refetchRooms();
        return;
      }
      
      const reservationsCollectionRef = collection(firestore, 'reservations');
      const newReservationRef = doc(reservationsCollectionRef);
      
      const batch = writeBatch(firestore);

      batch.set(newReservationRef, reservationData);
      batch.update(roomRef, { status: "Occupée" });

      batch.commit()
        .then(() => {
            toast({ title: 'Réservation créée !', description: `La réservation pour ${data.guestName} a été créée.` });
            form.reset();
            onFinished?.();
        })
        .catch((serverError) => {
            // Since a batch can fail on either operation, we emit a generic error
            // that suggests a problem with either creating the reservation or updating the room.
            const permissionError = new FirestorePermissionError({
                path: newReservationRef.path, // Or roomRef.path, path of the failing op
                operation: 'create', // This is the most likely failure point
                requestResourceData: reservationData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
  };
  
  const availableRooms = useMemo(() => {
    if (!rooms) return [];
    // A room is available if its status is 'Disponible'
    // OR if we are editing a reservation, the room currently assigned to that reservation is also "available" for this form.
    return (rooms as any[]).filter(room => room.status === 'Disponible' || (initialData && room.id === initialData.roomId));
  }, [rooms, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du client</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chambre</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRooms}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingRooms ? "Chargement..." : "Sélectionnez une chambre disponible"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRooms.length > 0 ? (
                     availableRooms.map((room: any) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} ({room.type}) - {room.price}€/nuit
                        </SelectItem>
                      ))
                  ) : (
                    <div className="p-4 text-sm text-center text-muted-foreground">Aucune chambre disponible.</div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Période du séjour</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value?.from && 'text-muted-foreground'
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
                        <span>Choisissez les dates</span>
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

        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numberOfGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de clients</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut de la réservation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Confirmée">Confirmée</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminée">Terminée</SelectItem>
                      <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {totalPrice > 0 && (
            <div className="rounded-md border bg-muted p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Prix Total Estimé</p>
                <p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)}€</p>
            </div>
        )}


        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting 
                    ? (initialData ? 'Modification...' : 'Création...') 
                    : (initialData ? 'Modifier la réservation' : 'Créer la réservation')}
            </Button>
        </div>
      </form>
    </Form>
  );
}

    