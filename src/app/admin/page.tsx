
'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, ConciergeBell, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { firestore } = useFirebase();

  // Only attempt to fetch the users collection if the current user is a superadmin
  const usersCollectionRef = userProfile?.role === 'superadmin' ? collection(firestore, 'users') : null;
  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const isLoading = isProfileLoading || (userProfile?.role === 'superadmin' && areUsersLoading);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Chargement du tableau de bord...</p>
          <p className="text-muted-foreground">Veuillez patienter.</p>
        </div>
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

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((u: any) => u.role === 'superadmin').length || 0;
  const receptionists = users?.filter((u: any) => u.role === 'receptionist').length || 0;
  const stockManagers = users?.filter((u: any) => u.role === 'stock_manager').length || 0;

  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="mt-2 text-lg text-muted-foreground">Aperçu général de la gestion de l'hôtel.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users">
            <Card className="transition-all hover:border-primary hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Nombre total de comptes</p>
            </CardContent>
            </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Comptes Superadmin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réceptionnistes</CardTitle>
            <ConciergeBell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receptionists}</div>
            <p className="text-xs text-muted-foreground">Personnel de la réception</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestionnaires de Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stockManagers}</div>
                <p className="text-xs text-muted-foreground">Personnel de la logistique</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
