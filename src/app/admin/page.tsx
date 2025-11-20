'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { firestore } = useFirebase();

  // Fetch the current user's profile to check their role
  const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Fetch all users to display in the table and calculate stats
  const usersCollectionRef = collection(firestore, 'users');
  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const isLoading = isUserLoading || isProfileLoading || areUsersLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold">Chargement du tableau de bord...</p>
          <p className="text-muted-foreground">Veuillez patienter.</p>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== 'superadmin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
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

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((u: any) => u.role === 'superadmin').length || 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Tableau de Bord Administrateur</h1>
          <p className="mt-2 text-lg text-muted-foreground">Gestion centralisée des utilisateurs et du système.</p>
        </header>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Nombre total d'inscrits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">Comptes avec privilèges élevés</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>
              Liste de tous les utilisateurs enregistrés dans le système.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="text-right">Rôle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u: any) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={u.photoURL} alt={u.displayName} />
                            <AvatarFallback>{u.displayName?.charAt(0) || u.email?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{u.displayName || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{u.email}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={u.role === 'superadmin' ? 'default' : 'secondary'}>
                          {u.role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
