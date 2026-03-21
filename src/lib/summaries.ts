import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import type { Summary } from '../types';

export async function createSummary(
  userId: string,
  url: string,
  title: string,
  summary: string,
  type: 'youtube' | 'audio' | 'url'
) {
  const now = new Date().toISOString();
  
  const newSummary = {
    user_id: userId,
    url,
    title,
    summary,
    type,
    created_at: now,
    updated_at: now,
  };

  const docRef = await addDoc(collection(db, "summaries"), newSummary);
  
  return {
    id: docRef.id,
    ...newSummary
  } as Summary;
}

export async function getSummaries(userId: string): Promise<Summary[]> {
  try {
    const q = query(collection(db, "summaries"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Summary[];
  } catch (error) {
    console.error('Error fetching summaries:', error);
    return [];
  }
}

export async function getSummary(summaryId: string): Promise<Summary | null> {
  try {
    const docRef = doc(db, "summaries", summaryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Summary;
    }
    return null;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
}

export async function deleteSummary(summaryId: string) {
  try {
    await deleteDoc(doc(db, "summaries", summaryId));
  } catch (error) {
    console.error('Error deleting summary:', error);
  }
}
