import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { GoogleAuthProvider, getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export function getFirebaseApp() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!isFirebaseConfigured()) {
    return undefined;
  }

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return app;
}

export function getFirebaseAuth() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return undefined;
  }

  if (!authInstance) {
    authInstance = getAuth(firebaseApp);
  }

  return authInstance;
}

let firestoreInstance: Firestore | undefined;

export function getFirebaseFirestore() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return undefined;
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(firebaseApp);
  }

  return firestoreInstance;
}
