'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error caught by listener:', error.getDebugSummary());

      // Throw the error to make it visible in the Next.js development error overlay.
      // This is intentional for providing a rich debugging experience during development.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, just show a generic toast notification.
        toast({
          variant: 'destructive',
          title: 'Erreur de permission',
          description: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  // This component does not render anything.
  return null;
}
