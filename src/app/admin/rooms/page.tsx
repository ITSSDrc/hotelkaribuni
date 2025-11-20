
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const mockRooms = [
  {
    id: 'ROOM-101',
    imageUrl: 'https://picsum.photos/seed/room101/120/80',
    name: 'Suite Océan',
    type: 'Suite',
    price: 250,
    status: 'Disponible',
  },
  {
    id: 'ROOM-102',
    imageUrl: 'https://picsum.photos/seed/room102/120/80',
    name: 'Chambre Deluxe Vue Jardin',
    type: 'Deluxe',
    price: 180,
    status: 'Occupée',
  },
  {
    id: 'ROOM-205',
    imageUrl: 'https://picsum.photos/seed/room205/120/80',
    name: 'Chambre Standard',
    type: 'Standard',
    price: 120,
    status: 'En nettoyage',
  },
    {
    id: 'ROOM-301',
    imageUrl: 'https://picsum.photos/seed/room301/120/80',
    name: 'Suite Présidentielle',
    type: 'Suite',
    price: 450,
    status: 'Disponible',
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Disponible':
      return 'default'; // Using 'default' for green-like primary color
    case 'Occupée':
      return 'destructive';
    case 'En nettoyage':
      return 'secondary';
    default:
      return 'outline';
  }
};


export default function AdminRoomsPage() {
  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight">
            Gestion des Chambres
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Ajoutez, modifiez et gérez les chambres de votre hôtel.
            </p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une chambre
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Liste des chambres</CardTitle>
          <CardDescription>
            Consultez et gérez la liste de toutes les chambres de l'hôtel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix / Nuit</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={room.name}
                      className="aspect-video rounded-md object-cover"
                      height="80"
                      src={room.imageUrl}
                      width="120"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.price.toFixed(2)}€</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(room.status)}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
