// Local storage utility for managing app data
import type { Profile, Summary, UserSettings } from '../types';

const STORAGE_KEYS = {
  USERS: 'ai_summarizer_users',
  CURRENT_USER: 'ai_summarizer_current_user',
  SUMMARIES: 'ai_summarizer_summaries',
  SETTINGS: 'ai_summarizer_settings',
};

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// User Management
export function getUsers(): Record<string, Profile> {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : {};
}

export function saveUser(user: Profile): void {
  const users = getUsers();
  users[user.id] = user;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getUserByEmail(email: string): Profile | null {
  const users = getUsers();
  return Object.values(users).find(u => u.email === email) || null;
}

export function getUserById(id: string): Profile | null {
  const users = getUsers();
  return users[id] || null;
}

// Session Management
export function setCurrentUser(userId: string | null): void {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): Profile | null {
  const userId = getCurrentUserId();
  return userId ? getUserById(userId) : null;
}

// Summaries Management
export function getSummaries(): Record<string, Summary> {
  const data = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
  return data ? JSON.parse(data) : {};
}

export function saveSummary(summary: Summary): void {
  const summaries = getSummaries();
  summaries[summary.id] = summary;
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
}

export function getSummariesByUserId(userId: string): Summary[] {
  const summaries = getSummaries();
  return Object.values(summaries)
    .filter(s => s.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getSummaryById(id: string): Summary | null {
  const summaries = getSummaries();
  return summaries[id] || null;
}

export function deleteSummaryById(id: string): void {
  const summaries = getSummaries();
  delete summaries[id];
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
}

// Settings Management
export function getSettings(): Record<string, UserSettings> {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {};
}

export function saveSettings(settings: UserSettings): void {
  const allSettings = getSettings();
  allSettings[settings.user_id] = settings;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(allSettings));
}

export function getSettingsByUserId(userId: string): UserSettings | null {
  const settings = getSettings();
  return settings[userId] || null;
}

export function createDefaultSettings(userId: string): UserSettings {
  const settings: UserSettings = {
    id: generateId(),
    user_id: userId,
    language: 'en',
    email_notifications: true,
    summary_complete_notifications: true,
    weekly_digest: false,
    theme: 'light',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveSettings(settings);
  return settings;
}

// Clear all data (for logout)
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Clear everything (for reset)
export function clearEverything(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
