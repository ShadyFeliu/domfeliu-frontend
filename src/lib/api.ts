const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
if (!rawApiUrl && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_API_URL environment variable is missing');
}
export const API_URL = (rawApiUrl || 'http://localhost:3001/api').replace(/"/g, '').replace(/\/+$/, '');

class ApiClient {
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    // Add auth token if available (client-side only trick for now, or handled per request)
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    options.credentials = 'include';
    options.mode = 'cors'; // Explicitly state CORS for preflights

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json() as { message?: string | string[] };
        errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  }
  
  patch<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

/**
 * Normalizes media URLs from the backend.
 * If the URL is relative (starts with /uploads), it prepends the backend base URL.
 * If it's already an absolute URL (external), it returns it as is.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Clean potential quotes from env vars and handle normalization
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || API_URL || 'http://localhost:3001/api';
  const cleanApiUrl = rawApiUrl.replace(/"/g, '').replace(/\/+$/, '');
  
  // Base server URL (strip /api)
  const baseUrl = cleanApiUrl.replace(/\/api$/, '');
  
  // If it's already an absolute URL (starts with http), return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Ensure the path starts with / for concatenation
  const path = url.startsWith('/') ? url : `/${url}`;
  
  // Handle /uploads or uploads paths
  if (path.startsWith('/uploads/')) {
    return `${baseUrl}${path}`;
  }
  
  return url;
}
