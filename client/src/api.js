// In development Vite proxies /api to the server. For deployments, set
// VITE_API_URL to the single, intended backend origin. Do not scan ports: a
// stale backend can otherwise return a response for a different API version.
const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export async function apiRequest(endpoint, options = {}) {
  let lastError;
  try {
    const response = await fetch(`${apiBase}${endpoint}`, options);
    const data = await response.json().catch(() => null);
    return { response, data };
  } catch (error) {
    lastError = error;
  }
  throw lastError || new Error('Unable to connect to the server.');
}
