
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Settings, Users, LineChart, LogOut, PanelLeft, UserCircle2, BedDouble, Hotel, Dumbbell, Waves, UtensilsCrossed, ChevronDown, CalendarCheck } from 'lucide-react';
import Logo from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import React from 'react';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile } = useUserProfile();
  const { auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/connexion');
      router.refresh(); // Force a hard refresh to clear all client-side state
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, show a toast message for the error
    }
  };
  
  const isHotelSectionActive = pathname.startsWith('/admin/rooms') || pathname.startsWith('/admin/salles') || pathname.startsWith('/admin/piscines') || pathname.startsWith('/admin/restau-bar');

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold">Karibuni</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="/admin">
                  <Home />
                  <span>Tableau de bord</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/reservations'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="/admin/reservations">
                  <CalendarCheck />
                  <span>Réservations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/users'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="/admin/users">
                  <Users />
                  <span>Utilisateurs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <Collapsible asChild>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild isActive={isHotelSectionActive} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary justify-between">
                            <div className='flex w-full items-center justify-between'>
                                <div className="flex items-center gap-2">
                                    <Hotel />
                                    <span>Hôtel</span>
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </div>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu className='pl-6'>
                             <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/rooms'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                                    <Link href="/admin/rooms">
                                    <BedDouble />
                                    <span>Chambres</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/salles'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                                    <Link href="/admin/salles">
                                    <Dumbbell />
                                    <span>Salles</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/piscines'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                                    <Link href="/admin/piscines">
                                    <Waves />
                                    <span>Piscines</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/restau-bar'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                                    <Link href="/admin/restau-bar">
                                    <UtensilsCrossed />
                                    <span>Restau-bar</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="#">
                  <LineChart />
                  <span>Analyses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/profile'} className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="/admin/profile">
                  <UserCircle2 />
                  <span>Profil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[active=false]:hover:bg-primary/5 data-[active=false]:hover:text-primary">
                <Link href="#">
                  <Settings />
                  <span>Paramètres</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3">
                 <Link href="/admin/profile" className="group flex flex-1 items-center gap-3 overflow-hidden rounded-md p-1 transition-colors hover:bg-primary/5">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || ''} />
                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold group-hover:text-primary">{userProfile?.displayName || 'Admin'}</p>
                        <p className="truncate text-xs text-muted-foreground group-hover:text-primary/80">{userProfile?.email}</p>
                    </div>
                 </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0">
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Déconnexion</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Votre session actuelle sera terminée et vous devrez vous reconnecter pour accéder au tableau de bord.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Confirmer la déconnexion
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="h-6 w-6" />
            <span>Karibuni</span>
          </Link>
          <SidebarTrigger>
            <PanelLeft />
          </SidebarTrigger>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
