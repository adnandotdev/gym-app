import { authStorage } from './authStorage';
import { normalizeRequestOptions } from './apiRequest';
import { resolveApiUrl } from './apiConfiguration';

// Define backend API URL
export const API_URL = resolveApiUrl(process.env.EXPO_PUBLIC_API_URL, __DEV__);

/**
 * Pure Fetch Client mimicking Axios' API interface precisely
 * for backward compatibility across all context modules.
 */
class FetchClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    if (!this.baseUrl) {
      throw new Error('The service is not configured for this app version. Please contact support.');
    }
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Automatically inject Bearer JWT authorization token if saved in protected storage.
    const token = await authStorage.getToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
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
      if (error.name === 'AbortError') {
        const timeoutError = new Error('The service took too long to respond. Please try again.');
        console.error(`API request timed out for ${endpoint}.`);
        throw timeoutError;
      }
      console.error(`API request failed for ${endpoint}:`, error.message);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, normalizeRequestOptions('GET', options));
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, normalizeRequestOptions('POST', { ...options, body: data }));
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, normalizeRequestOptions('PUT', { ...options, body: data }));
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, normalizeRequestOptions('DELETE', options));
  }
}

const api = new FetchClient(API_URL);
export default api;
