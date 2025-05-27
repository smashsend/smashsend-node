import { HttpClient } from '../utils/http-client';
import {
  ApiKeyValidationResponse,
  ApiKeyInfo,
  ApiKeyCreateOptions,
  ApiKeyUpdateOptions,
  ApiKeyListOptions,
  ApiKeyListResponse,
  ApiKeyDeleteResponse,
} from '../interfaces/types';

export class ApiKeys {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Validate the current API key and get account information
   * @returns Promise<ApiKeyValidationResponse & { valid: boolean }>
   */
  async validate(): Promise<ApiKeyValidationResponse & { valid: boolean }> {
    const response = await this.httpClient.get<ApiKeyValidationResponse>('/api-keys/check');

    // Add a computed 'valid' field based on status for backward compatibility
    return {
      ...response,
      valid: response.status === 'SUCCEED',
    };
  }

  /**
   * Get information about the current API key
   * @returns Promise<ApiKeyInfo>
   */
  async getCurrent(): Promise<ApiKeyInfo> {
    const response = await this.httpClient.get<ApiKeyInfo>('/api-keys/current');
    return response;
  }

  /**
   * List API keys for a workspace
   * @param workspaceId - The workspace ID
   * @param options - List options (pagination, sorting)
   * @returns Promise<ApiKeyListResponse>
   */
  async list(workspaceId: string, options: ApiKeyListOptions = {}): Promise<ApiKeyListResponse> {
    const queryParams = new URLSearchParams();

    if (options.startAt) {
      queryParams.append('startAt', options.startAt.toISOString());
    }
    if (options.sort) {
      queryParams.append('sort', options.sort);
    }
    if (options.limit) {
      queryParams.append('limit', options.limit.toString());
    }

    const query = queryParams.toString();
    const url = `/workspaces/${workspaceId}/api-keys${query ? `?${query}` : ''}`;

    return await this.httpClient.get<ApiKeyListResponse>(url);
  }

  /**
   * Create a new API key for a workspace
   * @param workspaceId - The workspace ID
   * @param options - API key creation options
   * @returns Promise<{ apiKey: ApiKeyInfo }>
   */
  async create(workspaceId: string, options: ApiKeyCreateOptions): Promise<{ apiKey: ApiKeyInfo }> {
    return await this.httpClient.post<{ apiKey: ApiKeyInfo }>(
      `/workspaces/${workspaceId}/api-keys`,
      options
    );
  }

  /**
   * Update an existing API key
   * @param workspaceId - The workspace ID
   * @param apiKeyId - The API key ID to update
   * @param options - Update options
   * @returns Promise<{ apiKey: ApiKeyInfo }>
   */
  async update(
    workspaceId: string,
    apiKeyId: string,
    options: ApiKeyUpdateOptions
  ): Promise<{ apiKey: ApiKeyInfo }> {
    return await this.httpClient.post<{ apiKey: ApiKeyInfo }>(
      `/workspaces/${workspaceId}/api-keys/${apiKeyId}`,
      options
    );
  }

  /**
   * Delete an API key
   * @param workspaceId - The workspace ID
   * @param apiKeyId - The API key ID to delete
   * @returns Promise<ApiKeyDeleteResponse>
   */
  async delete(workspaceId: string, apiKeyId: string): Promise<ApiKeyDeleteResponse> {
    return await this.httpClient.delete<ApiKeyDeleteResponse>(
      `/workspaces/${workspaceId}/api-keys/${apiKeyId}`
    );
  }
}
