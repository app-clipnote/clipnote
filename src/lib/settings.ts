import {
  getSettingsByUserId,
  saveSettings,
  createDefaultSettings,
} from './local-storage';
import type { UserSettings } from './types';

export async function getSettings(userId: string): Promise<UserSettings> {
  let settings = getSettingsByUserId(userId);
  
  if (!settings) {
    settings = createDefaultSettings(userId);
  }
  
  return settings;
}

export async function updateSettings(
  userId: string,
  updates: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserSettings> {
  let settings = getSettingsByUserId(userId);
  
  if (!settings) {
    settings = createDefaultSettings(userId);
  }

  const updatedSettings: UserSettings = {
    ...settings,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveSettings(updatedSettings);
  return updatedSettings;
}
