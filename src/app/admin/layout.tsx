
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
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Settings, Users, LineChart, LogOut, PanelLeft, UserCircle2 } from 'lucide-react';
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
      router.push('/connexion');
      router.refresh(); // Force a hard refresh to clear all client-side state
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, show a toast message for the error
    }
  };
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold">Karibuni</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'} className="data-[active=false]:hover:bg-primary data-[active=false]:hover:text-primary-foreground">
                <Link href="/admin">
                  <Home />
                  Tableau de bord
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/users'} className="data-[active=false]:hover:bg-primary data-[active=false]:hover:text-primary-foreground">
                <Link href="/admin/users">
                  <Users />
                  Utilisateurs
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[active=false]:hover:bg-primary data-[active=false]:hover:text-primary-foreground">
                <Link href="#">
                  <LineChart />
                  Analyses
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/profile'} className="data-[active=false]:hover:bg-primary data-[active=false]:hover:text-primary-foreground">
                <Link href="/admin/profile">
                  <UserCircle2 />
                  Profil
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[active=false]:hover:bg-primary data-[active=false]:hover:text-primary-foreground">
                <Link href="#">
                  <Settings />
                  Paramètres
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3">
                 <Link href="/admin/profile" className="group flex flex-1 items-center gap-3 overflow-hidden rounded-md p-1 transition-colors hover:bg-primary">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || ''} />
                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold group-hover:text-primary-foreground">{userProfile?.displayName || 'Admin'}</p>
                        <p className="truncate text-xs text-muted-foreground group-hover:text-primary-foreground/80">{userProfile?.email}</p>
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
