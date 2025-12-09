
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Logo from '../icons/logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeToggle } from './theme-toggle';
import { Separator } from '../ui/separator';

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Découvrir',
    subLinks: [
      { href: '/chambres', label: 'Chambres' },
      { href: '/salles', label: 'Salles' },
      { href: '/piscines', label: 'Piscines' },
      { href: '/restau-bar', label: 'Restau-bar' },
      { href: '/galerie', label: 'Galerie' },
    ],
  },
  { href: '/services', label: 'Services' },
  { href: '/a-propos', label: 'À Propos' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavLinks = (isMobile = false) => {
    return navLinks.map((link, index) => {
      if (link.subLinks) {
        if (isMobile) {
          return (
            <Collapsible key={index} className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent/10 [&[data-state=open]>svg]:rotate-180">
                {link.label}
                <ChevronDown className="h-5 w-5 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2 py-2 pl-10">
                  {link.subLinks.map((subLink, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subLink.href}
                      className="rounded-md px-4 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
              <Separator className="bg-border/50" />
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
        <React.Fragment key={index}>
          <Link
            href={link.href}
            className={cn(
              'text-sm font-medium text-foreground/80 transition-colors hover:text-primary',
              isMobile && 'rounded-md px-4 py-3 text-base'
            )}
            onClick={() => isMobile && setOpen(false)}
          >
            {link.label}
          </Link>
          {isMobile && <Separator className="bg-border/50" />}
        </React.Fragment>
      );
    });
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
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
            <ThemeToggle />
            <Button asChild>
                <Link href="/reservation">Réserver</Link>
            </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full max-w-sm flex-col bg-background p-0">
              <SheetHeader className="flex flex-row items-center justify-between border-b p-4">
                 <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold">Karibuni</span>
                  </Link>
                  <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer le menu</span>
                  </Button>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <nav className="flex-1 space-y-1 p-4">
                  {renderNavLinks(true)}
                </nav>
                 <div className="border-t border-border/50 p-4 flex flex-col gap-4">
                    <ThemeToggle />
                    <Button asChild className="w-full">
                        <Link href="/reservation" onClick={() => setOpen(false)}>Réserver</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
