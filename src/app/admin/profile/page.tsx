
'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminProfilePage() {
  const { userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Utilisateur non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Impossible de charger les informations de votre profil.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'default';
      case 'stock_manager':
        return 'destructive';
      case 'receptionist':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Mon Profil</h1>
        <p className="mt-2 text-lg text-muted-foreground">Gérez les informations de votre compte.</p>
      </header>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || ''} />
              <AvatarFallback className="text-3xl">
                {userProfile.displayName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-3xl">{userProfile.displayName}</CardTitle>
              <CardDescription className="text-base">{userProfile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Rôle</h4>
              <Badge variant={getRoleVariant(userProfile.role)} className="mt-1 text-base">
                {userProfile.role}
              </Badge>
            </div>
            {/* Additional profile information can be added here */}
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Modifier le profil
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
