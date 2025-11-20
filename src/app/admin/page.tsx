
'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Users, ConciergeBell, Package } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

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
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">Tableau de Bord Administrateur</h1>
            <p className="mt-2 text-lg text-muted-foreground">Aperçu général de la gestion de l'hôtel.</p>
        </div>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Nombre total de comptes</p>
          </CardContent>
        </Card>
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
          </C