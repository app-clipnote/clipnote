// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'pro-plus' | 'enterprise';
  password: string; // Stored locally (in production, this would be hashed)
  created_at: string;
  updated_at: string;
}

export interface Summary {
  id: string;
  user_id: string;
  url: string;
  title: string;
  summary: string;
  type: 'youtube' | 'audio' | 'url';
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  email_notifications: boolean;
  summary_complete_notifications: boolean;
  weekly_digest: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}
