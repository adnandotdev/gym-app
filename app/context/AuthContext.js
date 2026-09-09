import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { authStorage } from '../utils/authStorage';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check protected storage for token and cached user on app load
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await authStorage.getToken();
        const storedUser = await authStorage.getUser();

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(storedUser);
          }

          // Verify token validity by calling /auth/me
          try {
            const response = await api.get('/auth/me');
            if (response.data && response.data.success) {
              const freshUser = response.data.user;
              setUser(freshUser);
              await authStorage.setUser(freshUser);
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
        console.error('Failed to load login state from storage', e);
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
        try {
          await authStorage.setToken(userToken);
          await authStorage.setUser(userData);
        } catch (storageError) {
          await authStorage.removeToken().catch(() => {});
          throw storageError;
        }

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
    setToken(null);
    setUser(null);
    try {
      setIsLoading(true);
      // Remove authentication details from storage
      await Promise.all([
        authStorage.removeToken(),
        authStorage.removeUser(),
      ]);
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
      await authStorage.setUser(updatedUser);
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
