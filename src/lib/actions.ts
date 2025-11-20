
'use server';

import { initializeFirebase } from '@/firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Define the shape of the room data
interface RoomData {
  name: string;
  type: 'Standard' | 'Deluxe' | 'Suite';
  price: number;
  description: string;
  imageUrl: string;
  status: 'Disponible' | 'Occupée' | 'En nettoyage';
}

export async function addRoom(roomData: RoomData) {
  try {
    const { app } = initializeFirebase();
    const firestore = getFirestore(app);
    const roomsCollection = collection(firestore, 'rooms');
    
    // The imageUrl is now handled before calling this function
    // and is either a data URL or a picsum URL.
    await addDoc(roomsCollection, roomData);
    
    return { success: true };

  } catch (error) {
    console.error('Error adding document: ', error);
    // Re-throw the error to be caught by the calling function
    throw new Error('Could not add room to the database.');
  }
}

    