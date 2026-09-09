const DEVELOPMENT_API_URL = 'http://192.168.0.109:5000/api';

export function resolveApiUrl(configuredUrl, development) {
  const value = typeof configuredUrl === 'string' ? configuredUrl.trim() : '';
  if (development) return value.replace(/\/+$/, '') || DEVELOPMENT_API_URL;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    // Production uses a public DNS hostname over TLS, never a device/LAN address.
    const privateHost = !hostname.includes('.') || hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') || hostname.endsWith('.internal') ||
      /^[\d.]+$/.test(hostname) || hostname.includes(':') || hostname.includes('[');
    if (url.protocol !== 'https:' || privateHost || url.username || url.password || url.search || url.hash) return null;
    return value.replace(/\/+$/, '');
  } catch {
    return null;
  }
}
