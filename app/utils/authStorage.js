import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createAuthTokenStorage } from './authTokenStorageCore';

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userObject';
const tokenStorage = createAuthTokenStorage({
  platform: Platform.OS,
  secureStore: SecureStore,
});

export const authStorage = {
  async getToken() {
    const protectedToken = await tokenStorage.getToken();
    if (protectedToken || Platform.OS === 'web') return protectedToken;
    const legacyToken = await AsyncStorage.getItem(TOKEN_KEY);
    if (legacyToken) {
      await tokenStorage.setToken(legacyToken);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    return legacyToken;
  },

  async setToken(token) {
    await tokenStorage.setToken(token);
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async removeToken() {
    await tokenStorage.clearToken();
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async getUser() {
    const storedUser = await AsyncStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  },

  async setUser(user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },
};
