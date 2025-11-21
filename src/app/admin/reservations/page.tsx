
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
          {/* Add Form will be here */}
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
                            <DropdownMenuItem>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
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
      
      {/* TODO: Add Edit/Delete Modals */}
    </>
  );
}
