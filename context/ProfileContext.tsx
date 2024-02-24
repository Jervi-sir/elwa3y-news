import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '@types/Profile';
import KeyNames from '@utils/KeyNames';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserProfileContext = createContext({
  profile: null,
  saveProfile: async (_: any) => {},
  updateProfile: (_: any) => {},
  clearProfile: async () => {}, // Add method to clear profile
});

const PROFILE_KEY = KeyNames.profile;
// Custom hook to use the context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Load profile from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile)); // Parse the JSON string
        }
      } catch (error) {
        console.error('Failed to load the profile from AsyncStorage:', error);
      }
    };
    loadProfile();
  }, []);
  
  // Save profile to AsyncStorage
  const saveProfile = async (newProfile) => {
    try {
      const profileString = JSON.stringify(newProfile); // Convert to string before saving
      await AsyncStorage.setItem(PROFILE_KEY, profileString);
      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to save the profile:', error);
    }
  };

  // Update profile
  const updateProfile = useCallback((updates) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      ...updates,
    }));
  }, []);


  // Clear profile data upon logout
  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
      setProfile(null); // Reset profile state
    } catch (error) {
      console.error('Failed to clear the profile:', error);
    }
  };

  const value = {
    profile,
    saveProfile,
    updateProfile,
    clearProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
/*
  updateProfile(newProfile);
  updateProfile({ bio: "Updated Bio" });
*/

