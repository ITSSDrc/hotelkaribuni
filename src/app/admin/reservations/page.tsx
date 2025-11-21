
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import EditReservationForm from './edit-reservation-form';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminReservationsPage() {
  const { firestore } = useFirebase();
  const reservationsCollectionRef = collection(firestore, 'reservations');
  const { data: reservations, isLoading, forceRefetch } = useCollection(reservationsCollectionRef);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return 'default';
      case 'En cours':
        return 'secondary';
      case 'Terminée':
        return 'outline';
      case 'Annulée':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const handleEditClick = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };
  
  const handleCancelClick = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReservation || !firestore) return;

    const batch = writeBatch(firestore);
    
    // Update reservation status to 'Annulée'
    const reservationRef = doc(firestore, 'reservations', selectedReservation.id);
    batch.update(reservationRef, { status: 'Annulée' });
    
    // Update room status back to 'Disponible'
    if (selectedReservation.roomId) {
      const roomRef = doc(firestore, 'rooms', selectedReservation.roomId);
      batch.update(roomRef, { status: 'Disponible' });
    }
    
    try {
        await batch.commit();
        toast({
          title: 'Réservation annulée',
          description: `La réservation pour ${selectedReservation.guestName} a été annulée.`,
        });
        forceRefetch();
        setIsDeleteAlertOpen(false);
        setSelectedReservation(null);
    } catch (err: any) {
        console.error("Error cancelling reservation: ", err);
        const permissionError = new FirestorePermissionError({
            path: reservationRef.path,
            operation: 'update',
            requestResourceData: { status: 'Annulée' },
        });
        errorEmitter.emit('permission-error', permissionError);
    }
  };


  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Gestion des Réservations
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enregistrez et consultez les réservations de l'hôtel.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réservation</DialogTitle>
              <DialogDescription>
                Remplissez les détails pour enregistrer une arrivée.
              </DialogDescription>
            </DialogHeader>
            <EditReservationForm
              onFinished={() => {
                forceRefetch();
                setIsAddModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
          <CardDescription>
            Consultez et gérez les réservations à venir et passées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations &&
                  (reservations as any[]).map((reservation: any) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.guestName}</TableCell>
                      <TableCell>{reservation.roomName}</TableCell>
                       <TableCell>
                        {new Date(reservation.checkInDate).toLocaleDateString()} - {new Date(reservation.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(reservation)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => handleCancelClick(reservation)}
                               disabled={reservation.status === 'Annulée' || reservation.status === 'Terminée'}
                            >
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          {(!reservations || reservations.length === 0) && !isLoading && (
            <div className="text-center p-8 text-muted-foreground">
                Aucune réservation pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
      
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Modifier la réservation</DialogTitle>
                <DialogDescription>
                Mettez à jour les informations de la réservation.
                </DialogDescription>
            </DialogHeader>
            <EditReservationForm
                initialData={selectedReservation}
                onFinished={() => {
                forceRefetch();
                setIsEditModalOpen(false);
                setSelectedReservation(null);
                }}
            />
            </DialogContent>
        </Dialog>
      
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                    <AlertDialogDescription>
                    Êtes-vous sûr de vouloir annuler la réservation pour "{selectedReservation?.guestName}" ? Le statut de la chambre "{selectedReservation?.roomName}" sera remis à "Disponible".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedReservation(null)}>Fermer</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmCancel}>
                    Confirmer l'annulation
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
