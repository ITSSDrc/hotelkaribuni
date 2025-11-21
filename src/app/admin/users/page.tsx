'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import EditUserForm from './edit-user-form';
import AddUserForm from './add-user-form';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export default function AdminUsersPage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { firestore } = useFirebase();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { toast } = useToast();

  const usersCollectionRef = userProfile?.role === 'superadmin' ? collection(firestore, 'users') : null;
  const { data: users, isLoading: areUsersLoading, forceRefetch } = useCollection(usersCollectionRef);

  const isLoading = isProfileLoading || (userProfile?.role === 'superadmin' && areUsersLoading);

  if (userProfile?.role !== 'superadmin' && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'default';
      case 'stock_manager':
        return 'destructive';
      case 'receptionist':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }

  const handleDeleteClick = (user: any) => {
    // Prevent a superadmin from deleting their own account
    if (user.id === userProfile?.uid) {
        toast({
            variant: 'destructive',
            title: 'Action non autorisée',
            description: 'Vous ne pouvez pas supprimer votre propre compte administrateur.',
        });
        return;
    }
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser || !firestore) return;

    // We only delete the Firestore document. The auth user must be deleted from the console.
    const userDocRef = doc(firestore, 'users', selectedUser.id);
    deleteDoc(userDocRef)
        .then(() => {
            toast({
                title: 'Profil utilisateur supprimé',
                description: `Le profil de ${selectedUser.displayName} a été supprimé. L'enregistrement d'authentification doit être supprimé manuellement depuis la console Firebase.`,
            });
            forceRefetch();
        })
        .catch((err) => {
             const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsDeleteAlertOpen(false);
            setSelectedUser(null);
        });
  };

  const onFormFinished = () => {
    forceRefetch();
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
       <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
            <p className="mt-2 text-lg text-muted-foreground">Gérez les comptes et les rôles des utilisateurs du système.</p>
        </div>
         <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Créez un nouvel enregistrement d'authentification et un profil utilisateur.
                  </DialogDescription>
                </DialogHeader>
                <AddUserForm onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </header>
       {isLoading ? (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : (
        <Card>
            <CardHeader>
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <CardDescription>Liste de tous les utilisateurs enregistrés dans le système.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users && (users as any[]).map((user: any) => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.displayName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getRoleVariant(user.role)}>
                        {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                    Modifier le rôle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => handleDeleteClick(user)}
                                    disabled={user.id === userProfile?.uid}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {(!users || users.length === 0) && (
                <div className="text-center p-8 text-muted-foreground">
                    Aucun utilisateur trouvé. Les nouveaux utilisateurs qui s'inscrivent apparaîtront ici.
                </div>
            )}
            </CardContent>
        </Card>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le rôle de l'utilisateur</DialogTitle>
              <DialogDescription>
                Mettez à jour le rôle de {selectedUser?.displayName}.
              </DialogDescription>
            </DialogHeader>
            <EditUserForm
              onFinished={onFormFinished}
              initialData={selectedUser}
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action supprimera le profil de l'utilisateur de Firestore, mais ne supprimera pas
                        l'enregistrement d'authentification. Vous devrez le faire manuellement
                        depuis la console Firebase. Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedUser(null)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>
                       Confirmer la suppression
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
