
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '../icons/logo';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Découvrir',
    subLinks: [
      { href: '/chambres', label: 'Chambres' },
      { href: '/salles', label: 'Salles' },
      { href: '/#piscines', label: 'Piscines' },
      { href: '/#restau-bar', label: 'Restau-bar' },
    ],
  },
  { href: '/#galerie', label: 'Galerie' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const { user, userProfile, isLoading } = useUserProfile();
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: 'Déconnexion réussie',
    });
    router.replace('/');
  };

  const getDashboardLink = () => {
    if (!user || !userProfile) return null;
    const isAdminOrStaff = ['superadmin', 'receptionist', 'stock_manager'].includes(userProfile.role);
    if (isAdminOrStaff) {
      return { href: '/admin', label: 'Admin' };
    }
    return { href: '/dashboard', label: 'Tableau de bord' };
  };

  const dashboardLink = getDashboardLink();

  const renderAuthButtons = () => {
    if (isLoading) {
      return <Button disabled>Chargement...</Button>;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
           {dashboardLink && (
            <Button variant="outline" asChild>
              <Link href={dashboardLink.href}>{dashboardLink.label}</Link>
            </Button>
          )}
          <Button onClick={handleLogout}>Déconnexion</Button>
        </div>
      );
    }

    return (
      <Button asChild>
        <Link href="/connexion">Connexion</Link>
      </Button>
    );
  };
  
  const renderMobileAuthButtons = () => {
    if (isLoading) {
      return <Button disabled className="w-full">Chargement...</Button>;
    }

    if (user) {
      return <Button onClick={() => { handleLogout(); setOpen(false); }} className="w-full">Déconnexion</Button>;
    }

    return (
       <Button asChild className="w-full">
        <Link href="/connexion" onClick={() => setOpen(false)}>
          Connexion
        </Link>
      </Button>
    );
  }

  const renderNavLinks = (isMobile = false) => {
    return navLinks.map((link, index) => {
      if (link.subLinks) {
        if (isMobile) {
          return (
            <Collapsible key={index}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-accent/50 [&[data-state=open]>svg]:rotate-180">
                {link.label}
                <ChevronDown className="h-5 w-5 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2 pl-6 pt-2 pb-2">
                  {link.subLinks.map((subLink, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subLink.href}
                      className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent/50"
                      onClick={() => setOpen(false)}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        }
        return (
          <DropdownMenu key={index}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:bg-transparent hover:text-primary focus-visible:ring-0"
              >
                {link.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {link.subLinks.map((subLink, subIndex) => (
                <DropdownMenuItem key={subIndex} asChild>
                  <Link href={subLink.href}>{subLink.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      return (
        <Link
          key={index}
          href={link.href}
          className={cn(
            'text-sm font-medium text-foreground/80 transition-colors hover:text-primary',
            isMobile && 'rounded-md px-3 py-2 text-lg'
          )}
          onClick={() => isMobile && setOpen(false)}
        >
          {link.label}
        </Link>
      );
    });
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">Karibuni</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {renderAuthButtons()}
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold">Karibuni</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer le menu</span>
                  </Button>
                </div>
                <nav className="flex flex-1 flex-col gap-2 p-4">
                  {renderNavLinks(true)}
                  {dashboardLink && (
                     <Link
                      href={dashboardLink.href}
                      className="rounded-md px-3 py-2 text-lg font-medium transition-colors hover:bg-accent/50"
                      onClick={() => setOpen(false)}
                    >
                      {dashboardLink.label}
                    </Link>
                  )}
                </nav>
                <div className="border-t p-4">
                  {renderMobileAuthButtons()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
