import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check AsyncStorage for token and user on app load
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userObject');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Verify token validity by calling /auth/me
          try {
            const response = await api.get('/auth/me');
            if (response.data && response.data.success) {
              const freshUser = response.data.user;
              setUser(freshUser);
              await AsyncStorage.setItem('userObject', JSON.stringify(freshUser));
            } else {
              // Token is invalid, clean up
              await logout();
            }
          } catch (apiError) {
            console.error('Failed to validate token on launch', apiError.message);
            // If offline, keep local stored user/token, but if token is explicitly expired (e.g. 401), logout
            if (apiError.response && apiError.response.status === 401) {
              await logout();
            }
          }
        }
      } catch (e) {
        console.error('Failed to load login state from AsyncStorage', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.success) {
        const { token: userToken, user: userData } = response.data;

        // Persist token and user in storage
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userObject', JSON.stringify(userData));

        // Update state
        setToken(userToken);
        setUser(userData);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || error.message || 'Network error';
      return { success: false, error: message };
    }
  };

  // Register handler (only registers, doesn't auto-login as per requirements)
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', { name, email, password });
      
      if (response.data && response.data.success) {
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.data.message || 'Registration failed' };
      }
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || error.message || 'Network error';
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      setIsLoading(true);
      // Remove authentication details from storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userObject');

      // Reset state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile details helper
  const updateUser = async (updatedUser) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem('userObject', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to update user context', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        token,
        user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
