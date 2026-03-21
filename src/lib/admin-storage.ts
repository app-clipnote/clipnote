import type { Profile as User, Summary } from '../types';
import { getUsers, getSummariesByUserId } from './local-storage';

// Helper to get all summaries since local-storage groups it by user id
export function getAllSummariesHelper(): Summary[] {
  const summariesStr = localStorage.getItem('ai_summarizer_summaries');
  if (!summariesStr) return [];
  try {
    const rawData = JSON.parse(summariesStr);
    const result: Summary[] = [];
    Object.values(rawData).forEach((userSummaries: any) => {
      Object.values(userSummaries).forEach((summary: any) => {
        result.push(summary);
      });
    });
    return result;
  } catch (e) {
    return [];
  }
}

const ADMIN_CREDENTIALS = {
  email: 'admin@clipnote.com',
  password: 'Admin@123',
};

export function validateAdminLogin(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

export function getAllUsers(): User[] {
  const usersRecord = getUsers();
  return Object.values(usersRecord);
}

export function getAllSummaries(): Summary[] {
  return getAllSummariesHelper();
}
