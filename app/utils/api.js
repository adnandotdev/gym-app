import AsyncStorage from '@react-native-async-storage/async-storage';

// Define backend API URL
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.109:5000/api';

/**
 * Pure Fetch Client mimicking Axios' API interface precisely
 * for backward compatibility across all context modules.
 */
class FetchClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Automatically inject Bearer JWT authorization token if saved in AsyncStorage
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error retrieving auth token from storage in FetchClient', e);
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (err) {
        // Fallback for non-JSON responses
        data = { message: responseText };
      }

      // Mimic Axios error handling (rejects on non-2xx status codes with a response object)
      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.response = {
          status: response.status,
          data: data,
        };
        throw error;
      }

      // Mimic Axios response structure: return { data, status }
      return {
        status: response.status,
        data: data,
      };
    } catch (error) {
      console.error(`Fetch API error on request to ${url}:`, error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const api = new FetchClient(API_URL);
export default api;
