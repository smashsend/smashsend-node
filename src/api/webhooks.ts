import { HttpClient } from '../utils/http-client';
import { Webhook, WebhookCreateOptions } from '../interfaces/types';

export class Webhooks {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new webhook
   * @param options The webhook creation options
   * @returns The created webhook
   */
  async create(options: WebhookCreateOptions): Promise<Webhook> {
    return this.httpClient.post<Webhook>('/webhooks', options);
  }

  /**
   * Get a webhook by ID
   * @param id The webhook ID
   * @returns The webhook details
   */
  async get(id: string): Promise<Webhook> {
    return this.httpClient.get<Webhook>(`/webhooks/${id}`);
  }

  /**
   * Update a webhook
   * @param id The webhook ID
   * @param options The webhook update options
   * @returns The updated webhook
   */
  async update(id: string, options: Partial<WebhookCreateOptions>): Promise<Webhook> {
    return this.httpClient.patch<Webhook>(`/webhooks/${id}`, options);
  }

  /**
   * Delete a webhook
   * @param id The webhook ID
   * @returns Success status
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>(`/webhooks/${id}`);
  }

  /**
   * List webhooks
   * @param params Optional parameters for filtering and pagination
   * @returns A list of webhooks
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    enabled?: boolean;
    event?: string;
  }): Promise<{
    data: Webhook[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.httpClient.get<{
      data: Webhook[];
      total: number;
      limit: number;
      offset: number;
    }>('/webhooks', { params });
  }

  /**
   * Enable a webhook
   * @param id The webhook ID
   * @returns The updated webhook
   */
  async enable(id: string): Promise<Webhook> {
    return this.httpClient.post<Webhook>(`/webhooks/${id}/enable`, {});
  }

  /**
   * Disable a webhook
   * @param id The webhook ID
   * @returns The updated webhook
   */
  async disable(id: string): Promise<Webhook> {
    return this.httpClient.post<Webhook>(`/webhooks/${id}/disable`, {});
  }

  /**
   * Rotate the secret for a webhook
   * @param id The webhook ID
   * @returns The updated webhook with new secret
   */
  async rotateSecret(id: string): Promise<Webhook & { secret: string }> {
    return this.httpClient.post<Webhook & { secret: string }>(
      `/webhooks/${id}/rotate-secret`,
      {}
    );
  }
} 