import { HttpClient } from '../utils/http-client';
import { ApiKeyValidationResponse, ApiKeyInfo } from '../interfaces/types';

export class ApiKeys {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Validate the current API key and get account information
   * @returns Promise<ApiKeyValidationResponse>
   */
  async validate(): Promise<ApiKeyValidationResponse> {
    const response = await this.httpClient.get<ApiKeyValidationResponse>('/api-keys/check');
    return response;
  }

  /**
   * Get information about the current API key
   * @returns Promise<ApiKeyInfo>
   */
  async getCurrent(): Promise<ApiKeyInfo> {
    const response = await this.httpClient.get<ApiKeyInfo>('/api-keys/current');
    return response;
  }
}
