import {
  generateId,
  getUserByEmail,
  getUserById,
  saveUser,
  setCurrentUser,
  getCurrentUser,
  createDefaultSettings,
} from './local-storage';
import type { Profile } from './types';

export async function signUp(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const userId = generateId();
  const now = new Date().toISOString();
  
  const newUser: Profile = {
    id: userId,
    email,
    name,
    password, // In production, this should be hashed
    plan: 'free',
    created_at: now,
    updated_at: now,
  };

  // Save user
  saveUser(newUser);
  
  // Create default settings
  createDefaultSettings(userId);
  
  // Set as current user
  setCurrentUser(userId);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  };
}

export async function signIn(email: string, password: string) {
  const user = getUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Set as current user
  setCurrentUser(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function signOut() {
  setCurrentUser(null);
}

export async function getAuthUser() {
  const user = getCurrentUser();
  return user ? { id: user.id, email: user.email } : null;
}

export async function getProfile(userId: string) {
  const user = getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Return profile without password
  const { password, ...profile } = user;
  return profile;
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; email?: string; plan?: 'free' | 'pro' | 'enterprise' }
) {
  const user = getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser: Profile = {
    ...user,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveUser(updatedUser);

  const { password, ...profile } = updatedUser;
  return profile;
}
