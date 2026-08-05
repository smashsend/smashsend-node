import { HttpClient } from '../utils/http-client';
import {
  BroadcastCreateOptions,
  BroadcastListOptions,
  BroadcastListResponse,
  BroadcastResponse,
  BroadcastScheduleOptions,
  BroadcastTestOptions,
} from '../interfaces/broadcasts';

export class Broadcasts {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a draft broadcast from raw HTML.
   *
   * The HTML is stored exactly as sent; tracking links and required footers are
   * applied when the broadcast is scheduled.
   *
   * @param data Broadcast creation options
   * @returns The created broadcast
   *
   * @example
   * ```typescript
   * const { broadcast } = await smashsend.broadcasts.create({
   *   name: 'Weekly newsletter #42',
   *   subject: 'This week: {{firstName}}, the new roadmap is live',
   *   fromEmail: 'news@yourdomain.com',
   *   html: '<html><body><h1>Hello {{firstName}}</h1></body></html>',
   *   audience: { all: true },
   * });
   *
   * console.log(`Draft created: ${broadcast.id}`);
   * ```
   */
  async create(data: BroadcastCreateOptions): Promise<BroadcastResponse> {
    return await this.httpClient.post<BroadcastResponse>('/broadcasts', data);
  }

  /**
   * List broadcasts, optionally filtered by status.
   *
   * @example
   * ```typescript
   * const { broadcasts } = await smashsend.broadcasts.list({ limit: 10 });
   * broadcasts.items.forEach((b) => console.log(b.subject, b.status));
   * ```
   */
  async list(params?: BroadcastListOptions): Promise<BroadcastListResponse> {
    return await this.httpClient.get<BroadcastListResponse>('/broadcasts', {
      params,
    });
  }

  /**
   * Get a single broadcast by ID.
   */
  async get(broadcastId: string): Promise<BroadcastResponse> {
    return await this.httpClient.get<BroadcastResponse>(
      `/broadcasts/${encodeURIComponent(broadcastId)}`
    );
  }

  /**
   * Schedule a broadcast for delivery.
   *
   * @example
   * ```typescript
   * await smashsend.broadcasts.schedule('bcs_123', {
   *   sendAt: '2026-08-10T09:00:00.000Z',
   * });
   * ```
   */
  async schedule(
    broadcastId: string,
    data?: BroadcastScheduleOptions
  ): Promise<BroadcastResponse> {
    return await this.httpClient.post<BroadcastResponse>(
      `/broadcasts/${encodeURIComponent(broadcastId)}/schedule`,
      data ?? {}
    );
  }

  /**
   * Cancel a scheduled broadcast.
   */
  async cancel(broadcastId: string): Promise<BroadcastResponse> {
    return await this.httpClient.post<BroadcastResponse>(
      `/broadcasts/${encodeURIComponent(broadcastId)}/cancel`,
      {}
    );
  }

  /**
   * Send a test copy of a broadcast to workspace members.
   *
   * Recipients must be members of your workspace. The email is sent with a
   * [TEST] subject prefix.
   *
   * @example
   * ```typescript
   * await smashsend.broadcasts.sendTest('bcs_123', {
   *   emails: ['you@yourcompany.com'],
   * });
   * ```
   */
  async sendTest(
    broadcastId: string,
    data: BroadcastTestOptions
  ): Promise<BroadcastResponse> {
    return await this.httpClient.post<BroadcastResponse>(
      `/broadcasts/${encodeURIComponent(broadcastId)}/test`,
      data
    );
  }
}
