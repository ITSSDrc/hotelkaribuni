
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import AddRoomForm from './add-room-form';
import { useState } from 'react';

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
  const { firestore } = useFirebase();
  const roomsCollectionRef = collection(firestore, 'rooms');
  const { data: rooms, isLoading } = useCollection(roomsCollectionRef);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une chambre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle chambre</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour créer une nouvelle chambre.
              </DialogDescription>
            </DialogHeader>
            <AddRoomForm onFinished={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Liste des chambres</CardTitle>
          <CardDescription>
            Consultez et gérez la liste de toutes les chambres de l'hôtel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
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
                {rooms &&
                  (rooms as any[]).map((room: any) => (
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
          )}
        </CardContent>
      </Card>
    </>
  );
}
