
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
import EditPiscineForm from './edit-piscine-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Ouverte':
      return 'default';
    case 'Fermée':
      return 'destructive';
    case 'En maintenance':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminPiscinesPage() {
  const { firestore } = useFirebase();
  const piscinesCollectionRef = collection(firestore, 'piscines');
  const { data: piscines, isLoading, forceRefetch } = useCollection(piscinesCollectionRef);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPiscine, setSelectedPiscine] = useState<any>(null);
  const { toast } = useToast();
  
  const handleEditClick = (piscine: any) => {
    setSelectedPiscine(piscine);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (piscine: any) => {
    setSelectedPiscine(piscine);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPiscine || !firestore) return;

    const piscineDocRef = doc(firestore, 'piscines', selectedPiscine.id);

    deleteDoc(piscineDocRef)
      .then(() => {
        toast({
          title: 'Piscine supprimée',
          description: `La piscine "${selectedPiscine.name}" a été supprimée.`,
        });
        forceRefetch();
        setIsDeleteAlertOpen(false);
        setSelectedPiscine(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: piscineDocRef.path,
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
            Gestion des Piscines
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Gérez les espaces aquatiques de votre hôtel.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une piscine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle piscine</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour créer une nouvelle piscine.
              </DialogDescription>
            </DialogHeader>
            <EditPiscineForm
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
          <CardTitle>Liste des piscines</CardTitle>
          <CardDescription>
            Consultez et gérez la liste de toutes les piscines de l'hôtel.
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
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {piscines &&
                  (piscines as any[]).map((piscine: any) => (
                    <TableRow key={piscine.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt={piscine.name}
                          className="aspect-video rounded-md object-cover"
                          height="80"
                          src={(piscine.imageUrls && piscine.imageUrls[0]) || "https://placehold.co/120x80"}
                          width="120"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{piscine.name}</TableCell>
                      <TableCell>{piscine.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(piscine.status)}>
                          {piscine.status}
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
                            <DropdownMenuItem onClick={() => handleEditClick(piscine)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              onClick={() => handleDeleteClick(piscine)}
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
            <DialogTitle>Modifier la piscine</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de la piscine.
            </DialogDescription>
          </DialogHeader>
          <EditPiscineForm
            initialData={selectedPiscine}
            onFinished={() => {
              forceRefetch();
              setIsEditModalOpen(false);
              setSelectedPiscine(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La piscine "{selectedPiscine?.name}" sera supprimée définitivement de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPiscine(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
