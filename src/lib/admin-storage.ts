import type { User, Summary } from './types';

const ADMIN_CREDENTIALS = {
  email: 'admin@clipnote.com',
  password: 'Admin@123',
};

export function validateAdminLogin(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

export function getAllUsers(): User[] {
  const users: User[] = [];
  
  // Get all users from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('user_profile_')) {
      const userStr = localStorage.getItem(key);
      if (userStr) {
        try {
          users.push(JSON.parse(userStr));
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    }
  }
  
  return users;
}

export function getAllSummaries(): Summary[] {
  const summariesStr = localStorage.getItem('summaries');
  if (!summariesStr) return [];
  
  try {
    return JSON.parse(summariesStr);
  } catch (e) {
    console.error('Error parsing summaries:', e);
    return [];
  }
}
