
import Link from 'next/link';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram } from 'lucide-react';
import Logo from '../icons/logo';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold">Karibuni</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre havre de paix pour une escapade inoubliable.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-headline text-lg font-semibold">Découvrir</h3>
            <ul className="space-y-2">
              <li><Link href="/chambres" className="text-sm hover:text-primary">Chambres</Link></li>
              <li><Link href="/salles" className="text-sm hover:text-primary">Salles</Link></li>
              <li><Link href="/piscines" className="text-sm hover:text-primary">Piscines</Link></li>
              <li><Link href="/#restau-bar" className="text-sm hover:text-primary">Restau-bar</Link></li>
              <li><Link href="/#galerie" className="text-sm hover:text-primary">Galerie</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline text-lg font-semibold">Contactez-nous</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Avenue du Paradis, Océanville</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary">+1 (23) 456-7890</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contact@karibuni.com" className="hover:text-primary">contact@karibuni.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline text-lg font-semibold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Karibuni. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
