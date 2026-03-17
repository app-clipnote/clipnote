import {
  generateId,
  saveSummary as saveToStorage,
  getSummariesByUserId,
  getSummaryById,
  deleteSummaryById,
} from './local-storage';
import type { Summary } from './types';

export async function createSummary(
  userId: string,
  url: string,
  title: string,
  summary: string,
  type: 'youtube' | 'audio' | 'url'
) {
  const now = new Date().toISOString();
  
  const newSummary: Summary = {
    id: generateId(),
    user_id: userId,
    url,
    title,
    summary,
    type,
    created_at: now,
    updated_at: now,
  };

  saveToStorage(newSummary);
  return newSummary;
}

export async function getSummaries(userId: string): Promise<Summary[]> {
  try {
    return getSummariesByUserId(userId);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    return [];
  }
}

export async function getSummary(summaryId: string): Promise<Summary | null> {
  try {
    return getSummaryById(summaryId);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
}

export async function deleteSummary(summaryId: string) {
  deleteSummaryById(summaryId);
}
