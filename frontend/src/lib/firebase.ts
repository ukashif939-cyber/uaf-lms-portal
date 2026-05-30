"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBZ4qxqny2Ss5rVbO9-kIst0Y1fpOTMZw0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "uaf-lms-main.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "uaf-lms-main",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "uaf-lms-main.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1094444892511",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1094444892511:web:26b6fba0600dee7865b6ea",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithEmailAndPasswordFirebase(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogleFirebase() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutFirebase() {
  return signOut(auth);
}

export async function getFirebaseIdToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function mapFirebaseAuthError(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled.";
    case "auth/popup-blocked":
      return "Popup blocked. Allow popups for this site and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email is registered with a different sign-in method.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return err instanceof Error ? err.message : "Authentication failed.";
  }
}
