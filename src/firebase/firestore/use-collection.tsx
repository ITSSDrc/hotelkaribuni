
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CollectionReference, DocumentData, Query } from 'firebase/firestore';
import { onSnapshot, getDocs } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface Options {
  listen?: boolean;
}

export function useCollection<T = DocumentData>(
  query: CollectionReference<T> | Query<T> | null,
  options: Options = { listen: true }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!query) {
      setData(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    try {
      const snapshot = await getDocs(query);
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents as T[]);
      setError(null);
    } catch (err) {
       const permissionError = new FirestorePermissionError({
          path: query.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
    } finally {
        setIsLoading(false);
    }
  }, [JSON.stringify(query)]); // Simple serialization for dependency array


  useEffect(() => {
    if (!query) {
      setData(null);
      setIsLoading(false);
      return;
    }

    if (options.listen) {
      const unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(documents as T[]);
          setIsLoading(false);
          setError(null);
        },
        (err) => {
          const permissionError = new FirestorePermissionError({
            path: query.path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
        fetchData();
    }
  }, [JSON.stringify(query), options.listen, fetchData]);

  return { data, isLoading, error, forceRefetch: fetchData };
}
