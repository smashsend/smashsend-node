import { HttpClient } from '../utils/http-client';
import { Webhook, WebhookCreateOptions, WebhookUpdateOptions } from '../interfaces/types';
import * as crypto from 'crypto';

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
    const response = await this.httpClient.post<{ webhook: Webhook }>('/webhooks', options);
    return response.webhook;
  }

  /**
   * Get a webhook by ID
   * @param id The webhook ID
   * @returns The webhook details
   */
  async get(id: string): Promise<Webhook> {
    const response = await this.httpClient.get<{ webhook: Webhook }>(`/webhooks/${id}`);
    return response.webhook;
  }

  /**
   * List webhooks
   * @returns A list of webhooks
   */
  async list(): Promise<{
    webhooks: Array<{
      id: string;
      url: string;
      events: string[];
      enabled: boolean;
      description?: string;
      createdAt: string;
    }>;
  }> {
    return this.httpClient.get<{
      webhooks: Array<{
        id: string;
        url: string;
        events: string[];
        enabled: boolean;
        description?: string;
        createdAt: string;
      }>;
    }>('/webhooks');
  }

  /**
   * Update a webhook
   * @param id The webhook ID
   * @param options The webhook update options
   * @returns The updated webhook
   */
  async update(id: string, options: WebhookUpdateOptions): Promise<Webhook> {
    const response = await this.httpClient.post<{ webhook: Webhook }>(`/webhooks/${id}`, options);
    return response.webhook;
  }

  /**
   * Delete a webhook
   * @param id The webhook ID
   * @returns The deleted webhook and deletion status
   */
  async delete(id: string): Promise<{ webhook: Webhook; isDeleted: boolean }> {
    return this.httpClient.delete<{ webhook: Webhook; isDeleted: boolean }>(`/webhooks/${id}`);
  }

  /**
   * Verify webhook signature
   * @param payload The raw webhook payload (request body)
   * @param signature The signature from the X-SMASHSEND-SIGNATURE header
   * @param secret The webhook secret
   * @returns Whether the signature is valid
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    // Node.js crypto implementation
    try {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(payload).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    } catch (error) {
      return false;
    }
  }
}
