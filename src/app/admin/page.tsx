
'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, ConciergeBell, Package, Calendar, CalendarPlus } from 'lucide-react';
import Link from 'next/link';

function SuperAdminDashboard({ users }: { users: any[] | null }) {
  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((u: any) => u.role === 'superadmin').length || 0;
  const receptionists = users?.filter((u: any) => u.role === 'receptionist').length || 0;
  const stockManagers = users?.filter((u: any) => u.role === 'stock_manager').length || 0;

  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Tableau de Bord Super Admin</h1>
        <p className="mt-2 text-lg text-muted-foreground">Aperçu général de la gestion de l'hôtel.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" className="group">
            <Card className="transition-all group-hover:bg-primary/5 group-hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary">Utilisateurs Totaux</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
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

function ReceptionistDashboard({ reservations }: { reservations: any[] | null }) {
    const totalReservations = reservations?.length || 0;

    return (
        <>
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Tableau de Bord Réception</h1>
                <p className="mt-2 text-lg text-muted-foreground">Gérez les arrivées, les départs et le planning.</p>
            </header>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/reservations" className="group">
                    <Card className="transition-all group-hover:bg-primary/5 group-hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium group-hover:text-primary">Toutes les réservations</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReservations}</div>
                        <p className="text-xs text-muted-foreground">Nombre total de réservations</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/reservations" className="group">
                    <Card className="transition-all group-hover:bg-primary/5 group-hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium group-hover:text-primary">Nouvelle Réservation</CardTitle>
                        <CalendarPlus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mt-2">Enregistrer une nouvelle arrivée.</p>
                    </CardContent>
                    </Card>
                </Link>
             </div>
        </>
    )
}

function OtherRoleDashboard({ role }: { role: string }) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Bienvenue !</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Votre tableau de bord de <span className="font-semibold">{role}</span> est en cours de construction.</p>
          </CardContent>
        </Card>
      </div>
    );
}


export default function AdminDashboardPage() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { firestore } = useFirebase();

  const usersCollectionRef = userProfile?.role === 'superadmin' ? collection(firestore, 'users') : null;
  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const reservationsCollectionRef = userProfile?.role === 'receptionist' ? collection(firestore, 'reservations') : null;
  const { data: reservations, isLoading: areReservationsLoading } = useCollection(reservationsCollectionRef);


  const isLoading = isProfileLoading || areUsersLoading || areReservationsLoading;

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

  if (!userProfile) {
     return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Impossible de charger votre profil. Veuillez vous reconnecter.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (userProfile.role) {
    case 'superadmin':
      return <SuperAdminDashboard users={users} />;
    case 'receptionist':
      return <ReceptionistDashboard reservations={reservations} />;
    default:
      return <OtherRoleDashboard role={userProfile.role} />;
  }
}
