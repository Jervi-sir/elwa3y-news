import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyNames from '../utils/KeyNames';
import axios from 'axios';
import Api from '../utils/Api';

const TokenContext = createContext(null);

const AUTH_KEY = KeyNames.authToken;

export const useToken = () => {
  return useContext(TokenContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem(AUTH_KEY);
      if (storedToken) {
        // Validate the token by making an API call
        try {
          const response = await axios.get(Api.base + Api.validate_token, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          
          if (response.status === 200) {
            setToken(storedToken);
            console.log('token is valid: ' + storedToken)
          }
        } catch (error) {
          // Handle the error as you'd like, e.g., by removing the invalid token
          console.error('Token validation failed:', error);
          await AsyncStorage.removeItem(AUTH_KEY);
        }
      }
    };
  
    //fetchToken();

    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_KEY);
        if (storedToken) {
          // If a token exists in AsyncStorage, update the state
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load the token from AsyncStorage:', error);
      }
    };
    loadToken();

  }, []);

  // A function to set the token and also save it to AsyncStorage
  const saveToken = async (newToken) => {
    setToken(newToken);
    await AsyncStorage.setItem(AUTH_KEY, newToken);
  };

  const removeToken = async () => {
    setToken(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  const isAuthenticated = token !== null;


  const value = {
    token,
    saveToken,
    removeToken,
    isAuthenticated 
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};
