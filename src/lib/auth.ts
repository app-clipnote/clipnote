import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { Profile } from '../types';

export async function signUp(email: string, password: string, name: string) {
  // 1. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const now = new Date().toISOString();
  
  const newUser: Profile = {
    id: user.uid,
    email,
    name,
    password: '', // Do not store passwords in Firestore
    plan: 'free',
    created_at: now,
    updated_at: now,
  };

  // 2. Save profile in Firestore "users" collection
  await setDoc(doc(db, "users", user.uid), newUser);
  
  // 3. Create default settings
  const defaultSettings = {
    id: user.uid,
    user_id: user.uid,
    language: 'en',
    email_notifications: true,
    summary_complete_notifications: true,
    weekly_digest: false,
    theme: 'dark',
    created_at: now,
    updated_at: now,
  };
  await setDoc(doc(db, "user_settings", user.uid), defaultSettings);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  };
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  return {
    user: {
      id: userCredential.user.uid,
      email: userCredential.user.email as string,
    },
  };
}

export async function signOut() {
  await firebaseSignOut(auth);
  localStorage.removeItem('ai_summarizer_current_user'); 
}

export function getAuthUser(): Promise<{id: string, email: string} | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({ id: user.uid, email: user.email as string });
      } else {
        resolve(null);
      }
    });
  });
}

export async function getProfile(userId: string): Promise<Omit<Profile, 'password'>> {
  const userDoc = await getDoc(doc(db, "users", userId));
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const profile = userDoc.data() as Profile;
  const { password, ...safeProfile } = profile;
  return safeProfile;
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; email?: string; plan?: 'free' | 'pro' | 'pro-plus' | 'enterprise' }
) {
  const userRef = doc(db, "users", userId);
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  await updateDoc(userRef, updatedData);

  const newDoc = await getDoc(userRef);
  const profile = newDoc.data() as Profile;
  const { password, ...safeProfile } = profile;
  return safeProfile;
}
