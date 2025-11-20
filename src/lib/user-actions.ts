
'use server';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Define the shape of the user data
interface UserData {
  displayName: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'receptionist' | 'stock_manager';
}

const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_CONFIG;

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
    if (!serviceAccountJson) {
        throw new Error('La clé de compte de service Firebase est manquante dans les variables d`environnement.');
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const adminAuth = getAuth();
const adminFirestore = getFirestore();

export async function createUser(userData: UserData) {
  try {
    // 1. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: true, // Automatically verify email for admin-created users
      disabled: false,
    });

    // 2. Create user profile document in Firestore
    const userProfile = {
      displayName: userData.displayName,
      email: userData.email,
      role: userData.role,
      photoURL: userRecord.photoURL || null, // Use default photoURL if available
    };
    
    await adminFirestore.collection('users').doc(userRecord.uid).set(userProfile);

    // 3. (Optional) Set custom claims if you use them for rules
    // await adminAuth.setCustomUserClaims(userRecord.uid, { role: userData.role });
    
    return { success: true, uid: userRecord.uid };

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    let errorMessage = "Une erreur inconnue est survenue.";
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'Cette adresse e-mail est déjà utilisée par un autre compte.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'Le mot de passe doit comporter au moins 6 caractères.';
    }

    return { success: false, error: errorMessage };
  }
}
