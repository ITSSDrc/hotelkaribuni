
'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { firestore } = useFirebase();

  const usersCollectionRef = userProfile?.role === 'superadmin' ? collection(firestore, 'users') : null;
  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const isLoading = isProfileLoading || (userProfile?.role === 'superadmin' && areUsersLoading);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (userProfile?.role !== 'superadmin') {
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

  return (
    <>
       <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
        <p className="mt-2 text-lg text-muted-foreground">Gérez les comptes et les rôles des utilisateurs du système.</p>
      </header>
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
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && (users as any[]).map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL} />
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
                  <TableCell>
                    {/* Placeholder for creation date */}
                    24 Mai, 2024
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
