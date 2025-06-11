/**
 * API Configuration and Service
 * Automatically detects environment and uses appropriate API URL
 */

// Get the appropriate API URL based on environment
const getApiUrl = (): string => {
  // Check if we're in production based on various indicators
  const isProduction = import.meta.env.PROD || 
                      import.meta.env.VITE_NODE_ENV === 'production' ||
                      window.location.hostname !== 'localhost';

  if (isProduction) {
    return import.meta.env.VITE_API_URL_PROD || 'https://api.your-app.com';
  }
  
  return import.meta.env.VITE_API_URL_DEV || 'http://localhost:3000';
};

// API base URL - automatically switches between dev/prod
export const API_BASE_URL = getApiUrl();

/**
 * Base API client configuration
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    
    // Log the current API URL for debugging
    console.log(`🔗 API Base URL: ${this.baseUrl}`);
    console.log(`🌍 Environment: ${import.meta.env.PROD ? 'production' : 'development'}`);
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as T;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * HTTP Methods
   */
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Health check to verify API connection
   */
  async healthCheck(): Promise<{ status: string; environment: string }> {
    return this.get('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for easy imports
export default apiClient; 