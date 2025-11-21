
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
import { MoreHorizontal, PlusCircle, Loader2, Users } from 'lucide-react';
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
import EditSalleForm from './edit-salle-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Disponible':
      return 'default';
    case 'Réservée':
      return 'destructive';
    case 'En maintenance':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminSallesPage() {
  const { firestore } = useFirebase();
  const sallesCollectionRef = collection(firestore, 'salles');
  const { data: salles, isLoading, forceRefetch } = useCollection(sallesCollectionRef);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<any>(null);
  const { toast } = useToast();
  
  const handleEditClick = (salle: any) => {
    setSelectedSalle(salle);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (salle: any) => {
    setSelectedSalle(salle);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSalle || !firestore) return;

    const salleDocRef = doc(firestore, 'salles', selectedSalle.id);

    deleteDoc(salleDocRef)
      .then(() => {
        toast({
          title: 'Salle supprimée',
          description: `La salle "${selectedSalle.name}" a été supprimée.`,
        });
        forceRefetch();
        setIsDeleteAlertOpen(false);
        setSelectedSalle(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: salleDocRef.path,
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
            Gestion des Salles
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ajoutez, modifiez et gérez les salles de conférence et d'événements.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une salle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle salle</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour créer une nouvelle salle.
              </DialogDescription>
            </DialogHeader>
            <EditSalleForm
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
          <CardTitle>Liste des salles</CardTitle>
          <CardDescription>
            Consultez et gérez la liste de toutes les salles de l'hôtel.
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
                  <TableHead>Capacité</TableHead>
                  <TableHead>Prix / jour</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salles &&
                  (salles as any[]).map((salle: any) => (
                    <TableRow key={salle.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={salle.name}
                          className="aspect-video rounded-md object-cover"
                          height="80"
                          src={(salle.imageUrls && salle.imageUrls[0]) || "https://placehold.co/120x80"}
                          width="120"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{salle.name}</TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {salle.capacity}
                        </div>
                        </TableCell>
                      <TableCell>{salle.price.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(salle.status)}>
                          {salle.status}
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
                            <DropdownMenuItem onClick={() => handleEditClick(salle)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => handleDeleteClick(salle)}
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
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Modifier la salle</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de la salle.
            </DialogDescription>
          </DialogHeader>
          <EditSalleForm
            initialData={selectedSalle}
            onFinished={() => {
              forceRefetch();
              setIsEditModalOpen(false);
              setSelectedSalle(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La salle "{selectedSalle?.name}" sera supprimée définitivement de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSalle(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
