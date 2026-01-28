import { UserProfile } from '../types';

const STORAGE_KEY = 'wsp_profiles';

export const getProfiles = (): UserProfile[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveProfiles = (profiles: UserProfile[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const generateAvatar = (seed: string): string => {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

export const createProfile = (name: string): UserProfile => {
  const profiles = getProfiles();
  const newProfile: UserProfile = {
    id: Date.now().toString(),
    name,
    avatar: generateAvatar(name),
    watchlist: []
  };
  profiles.push(newProfile);
  saveProfiles(profiles);
  return newProfile;
};

export const updateProfile = (id: string, updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>): UserProfile[] => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updates };
    saveProfiles(profiles);
  }
  return profiles;
};

export const deleteProfile = (id: string): UserProfile[] => {
  const profiles = getProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  return profiles;
};