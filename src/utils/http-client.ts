import {
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  SMASHSENDError,
} from '../errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  maxRetries?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export class HttpClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultMaxRetries: number;
  private defaultTimeout: number;
  private customHeaders: Record<string, string> = {};
  private debugMode: boolean = false;

  constructor(
    apiKey: string,
    baseUrl: string = 'https://api.smashsend.com',
    maxRetries: number = 3,
    timeout: number = 30000
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.defaultMaxRetries = maxRetries;
    this.defaultTimeout = timeout;
  }

  /**
   * Set custom headers to be included with every request
   * @param headers Record of header names and values
   * @returns The HttpClient instance for chaining
   */
  setHeaders(headers: Record<string, string>): HttpClient {
    this.customHeaders = { ...this.customHeaders, ...headers };
    return this;
  }

  /**
   * Set a specific custom header
   * @param name Header name
   * @param value Header value
   * @returns The HttpClient instance for chaining
   */
  setHeader(name: string, value: string): HttpClient {
    this.customHeaders[name] = value;
    return this;
  }

  /**
   * Enable or disable debug mode
   * When enabled, requests and responses will be logged to console
   * @param enabled Whether debug mode should be enabled
   * @returns The HttpClient instance for chaining
   */
  setDebugMode(enabled: boolean): HttpClient {
    this.debugMode = enabled;
    return this;
  }

  private createUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(): Record<string, string> {
    // Try to get package version for User-Agent - fallback to "unknown" if not found
    let version = 'unknown';
    try {
      // Dynamic require - ESLint will complain but this works at runtime
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const packageJson = require('../../../package.json');
      version = packageJson.version || 'unknown';
    } catch (e) {
      // Silently fail if package.json cannot be read
    }

    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `SMASHSEND Node SDK v${version}`,
      Accept: 'application/json',
      ...this.customHeaders,
    };
  }

  private calculateBackoff(retryCount: number, retryDelay: number): number {
    // Use a more aggressive factor (4 instead of 2)
    const exponentialPart = retryDelay * Math.pow(4, retryCount);

    // Add jitter (between 80-120% of calculated time)
    const withJitter = exponentialPart * (0.8 + 0.4 * Math.random());

    // Cap at 30 seconds maximum backoff
    return Math.min(withJitter, 30000);
  }

  async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      params,
      data,
      maxRetries = this.defaultMaxRetries,
      retryCount = 0,
      retryDelay = 100,
      timeout = this.defaultTimeout,
    } = options;

    const url = this.createUrl(path, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const requestHeaders = {
        ...this.getHeaders(),
        ...headers,
      };

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        signal: controller.signal,
      };

      // Add body for non-GET requests
      if (method !== 'GET' && data !== undefined) {
        requestOptions.body = JSON.stringify(data);
      }

      // Log request in debug mode
      if (this.debugMode) {
        console.log(`[SMASHSEND] Request: ${method} ${url}`);
        console.log('[SMASHSEND] Headers:', requestHeaders);
        if (data) console.log('[SMASHSEND] Body:', JSON.stringify(data, null, 2));
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Extract request ID from headers
      const requestId = response.headers.get('x-request-id');

      // Try to parse the response as JSON
      let responseData: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Log response in debug mode
      if (this.debugMode) {
        console.log(`[SMASHSEND] Response: ${response.status}`);
        console.log(
          '[SMASHSEND] Response body:',
          typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2)
        );
      }

      // Handle different status codes
      if (response.status === 429) {
        if (retryCount < maxRetries) {
          // Calculate more aggressive exponential backoff
          const nextDelay = this.calculateBackoff(retryCount, retryDelay);

          if (this.debugMode) {
            console.log(
              `[SMASHSEND] Rate limited, retrying in ${nextDelay}ms (attempt ${retryCount + 1}/${maxRetries})`
            );
          }

          await new Promise((resolve) => setTimeout(resolve, nextDelay));

          return this.request<T>(path, {
            method,
            headers,
            params,
            data,
            maxRetries,
            retryCount: retryCount + 1,
            retryDelay,
            timeout,
          });
        }

        throw new RateLimitError('Rate limit exceeded', {
          statusCode: response.status,
          requestId: requestId || undefined,
        });
      }

      if (response.status === 401) {
        throw new AuthenticationError('Invalid API key', {
          statusCode: response.status,
          code: 'invalid_api_key',
          requestId: requestId || undefined,
        });
      }

      // Handle server errors (5xx)
      if (response.status >= 500) {
        if (retryCount < maxRetries) {
          // Calculate more aggressive exponential backoff
          const nextDelay = this.calculateBackoff(retryCount, retryDelay);

          await new Promise((resolve) => setTimeout(resolve, nextDelay));

          return this.request<T>(path, {
            method,
            headers,
            params,
            data,
            maxRetries,
            retryCount: retryCount + 1,
            retryDelay,
            timeout,
          });
        }
      }

      // If not successful, handle the error
      if (!response.ok) {
        const errorMessage = responseData?.message || `HTTP error ${response.status}`;
        const errorCode = responseData?.code || 'api_error';

        throw new APIError(errorMessage, {
          code: errorCode,
          statusCode: response.status,
          requestId: requestId || undefined,
          data: responseData,
        });
      }

      return responseData as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (this.debugMode && error instanceof Error) {
        console.error(`[SMASHSEND] Error:`, error.message);
      }

      // If it's already a SMASHSEND error, just rethrow it
      if (error instanceof SMASHSENDError) {
        throw error;
      }

      // Handle abort/timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError('Request timed out', {
          code: 'request_timeout',
        });
      }

      // Handle fetch network errors
      if (error instanceof TypeError) {
        if (retryCount < maxRetries) {
          // Calculate more aggressive exponential backoff
          const nextDelay = this.calculateBackoff(retryCount, retryDelay);

          await new Promise((resolve) => setTimeout(resolve, nextDelay));

          return this.request<T>(path, {
            method,
            headers,
            params,
            data,
            maxRetries,
            retryCount: retryCount + 1,
            retryDelay,
            timeout,
          });
        }

        throw new NetworkError('Network error', {
          code: 'network_error',
          data: error.message,
        });
      }

      // Other unknown errors
      if (error instanceof Error) {
        throw new NetworkError(error.message, {
          code: 'unknown_error',
        });
      }

      throw new NetworkError('Unknown error occurred', {
        code: 'unknown_error',
        data: error,
      });
    }
  }

  async get<T = any>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, {
      method: 'GET',
      ...options,
    });
  }

  async post<T = any>(
    path: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      data,
      ...options,
    });
  }

  async put<T = any>(
    path: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      data,
      ...options,
    });
  }

  async patch<T = any>(
    path: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'data'>
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      data,
      ...options,
    });
  }

  async delete<T = any>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      ...options,
    });
  }
}
