import { getApps, getApp, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Firebase web config is read from NEXT_PUBLIC_ env vars so the values can
 * differ per environment (dev / staging / prod on Vercel).
 *
 * These values are the public client config and are safe to expose in the
 * browser bundle. Security is enforced by Firebase Security Rules on
 * Firestore / Storage / Auth — not by hiding this config.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function firebaseApp(): FirebaseApp {
  return getFirebaseApp();
}

export function firestore(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function auth(): Auth {
  return getAuth(getFirebaseApp());
}

export function storage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
