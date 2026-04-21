const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `Request failed with status ${response.status}`,
      };
    }

    return result;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
    };
  }
}
