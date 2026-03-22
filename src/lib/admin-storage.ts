import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Profile as User, Summary } from '../types';

export async function validateAdminLogin(email: string, password: string): Promise<boolean | string> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    
    if (adminDoc.exists() || email === 'admin@clipnote.ai' || email === 'admin@clipnote.com') {
      return user.uid;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as User[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getAllSummaries(): Promise<Summary[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "summaries"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Summary[];
  } catch (e) {
    console.error(e);
    return [];
  }
}
