
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
import Image from 'next/image';
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
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import EditRoomForm from './edit-room-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Disponible':
      return 'default'; // Using 'default' for green-like primary color
    case 'Occupée':
      return 'destructive';
    case 'En nettoyage':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminRoomsPage() {
  const { firestore } = useFirebase();
  const roomsCollectionRef = collection(firestore, 'rooms');
  const { data: rooms, isLoading, forceRefetch } = useCollection(roomsCollectionRef);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const { toast } = useToast();
  
  const handleEditClick = (room: any) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (room: any) => {
    setSelectedRoom(room);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom || !firestore) return;

    const roomDocRef = doc(firestore, 'rooms', selectedRoom.id);

    deleteDoc(roomDocRef)
      .then(() => {
        toast({
          title: 'Chambre supprimée',
          description: `La chambre "${selectedRoom.name}" a été supprimée.`,
        });
        forceRefetch(); // Refresh the list
        setIsDeleteAlertOpen(false);
        setSelectedRoom(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: roomDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Gestion des Chambres
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ajoutez, modifiez et gérez les chambres de votre hôtel.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une chambre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle chambre</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour créer une nouvelle chambre.
              </DialogDescription>
            </DialogHeader>
            <EditRoomForm
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
          <CardTitle>Liste des chambres</CardTitle>
          <CardDescription>
            Consultez et gérez la liste de toutes les chambres de l'hôtel.
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
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix / Nuit</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms &&
                  (rooms as any[]).map((room: any) => (
                    <TableRow key={room.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={room.name}
                          className="aspect-video rounded-md object-cover"
                          height="80"
                          src={(room.imageUrls && room.imageUrls[0]) || room.imageUrl || "https://placehold.co/120x80"}
                          width="120"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.price.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(room.status)}>
                          {room.status}
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
                            <DropdownMenuItem onClick={() => handleEditClick(room)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => handleDeleteClick(room)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Room Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Modifier la chambre</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de la chambre.
            </DialogDescription>
          </DialogHeader>
          <EditRoomForm
            initialData={selectedRoom}
            onFinished={() => {
              forceRefetch();
              setIsEditModalOpen(false);
              setSelectedRoom(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Room Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La chambre "{selectedRoom?.name}" sera supprimée définitivement de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRoom(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
