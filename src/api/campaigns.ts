import { HttpClient } from '../utils/http-client';
import { Campaign, CampaignCreateOptions } from '../interfaces/types';

export class Campaigns {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new campaign
   * @param options The campaign creation options
   * @returns The created campaign
   */
  async create(options: CampaignCreateOptions): Promise<Campaign> {
    // Format date if provided
    if (options.scheduledAt && options.scheduledAt instanceof Date) {
      options = {
        ...options,
        scheduledAt: options.scheduledAt.toISOString(),
      };
    }

    return this.httpClient.post<Campaign>('/campaigns', options);
  }

  /**
   * Get a campaign by ID
   * @param id The campaign ID
   * @returns The campaign details
   */
  async get(id: string): Promise<Campaign> {
    return this.httpClient.get<Campaign>(`/campaigns/${id}`);
  }

  /**
   * Update a campaign
   * @param id The campaign ID
   * @param options The campaign update options
   * @returns The updated campaign
   */
  async update(id: string, options: Partial<CampaignCreateOptions>): Promise<Campaign> {
    // Format date if provided
    if (options.scheduledAt && options.scheduledAt instanceof Date) {
      options = {
        ...options,
        scheduledAt: options.scheduledAt.toISOString(),
      };
    }

    return this.httpClient.patch<Campaign>(`/campaigns/${id}`, options);
  }

  /**
   * Delete a campaign
   * @param id The campaign ID
   * @returns Success status
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>(`/campaigns/${id}`);
  }

  /**
   * List campaigns
   * @param params Optional parameters for filtering and pagination
   * @returns A list of campaigns
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled';
  }): Promise<{
    data: Campaign[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.httpClient.get<{
      data: Campaign[];
      total: number;
      limit: number;
      offset: number;
    }>('/campaigns', { params });
  }

  /**
   * Schedule a campaign
   * @param id The campaign ID
   * @param scheduledAt When to send the campaign
   * @returns The updated campaign
   */
  async schedule(id: string, scheduledAt: Date | string): Promise<Campaign> {
    const schedule = typeof scheduledAt === 'string' 
      ? scheduledAt 
      : scheduledAt.toISOString();

    return this.httpClient.post<Campaign>(
      `/campaigns/${id}/schedule`,
      { scheduledAt: schedule }
    );
  }

  /**
   * Cancel a scheduled campaign
   * @param id The campaign ID
   * @returns The updated campaign
   */
  async cancel(id: string): Promise<Campaign> {
    return this.httpClient.post<Campaign>(`/campaigns/${id}/cancel`, {});
  }

  /**
   * Send a campaign immediately
   * @param id The campaign ID
   * @returns The updated campaign
   */
  async send(id: string): Promise<Campaign> {
    return this.httpClient.post<Campaign>(`/campaigns/${id}/send`, {});
  }

  /**
   * Get campaign statistics
   * @param id The campaign ID
   * @returns Campaign statistics
   */
  async getStats(id: string): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
  }> {
    return this.httpClient.get<{
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      complained: number;
      unsubscribed: number;
    }>(`/campaigns/${id}/stats`);
  }
} 