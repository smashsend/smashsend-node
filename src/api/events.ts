import { HttpClient } from '../utils/http-client';
import {
  EventPayload,
  BatchEventPayload,
  SingleEventResponse,
  BatchEventResponse,
  EventTrackingOptions,
  EventUsage,
  EventUsageOptions,
} from '../interfaces/events';

export class Events {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Track a single event
   * @param event The event payload to track
   * @param options Optional tracking options
   * @returns The tracking response
   * 
   * @example
   * ```typescript
   * const response = await smashsend.events.track({
   *   event: 'user.signup',
   *   identify: {
   *     email: 'user@example.com',
   *     userId: 'user123'
   *   },
   *   properties: {
   *     plan: 'premium',
   *     source: 'website'
   *   }
   * });
   * 
   * console.log(`Event tracked with ID: ${response.messageId}`);
   * ```
   */
  async track(
    event: EventPayload,
    options: EventTrackingOptions = {}
  ): Promise<SingleEventResponse> {
    const headers = options.headers || {};
    const timeout = options.timeout;

    // Generate messageId if not provided
    const payload = {
      ...event,
      messageId: event.messageId || this.generateMessageId(),
    };

    const requestOptions: any = { headers };
    if (timeout) {
      requestOptions.timeout = timeout;
    }

    return await this.httpClient.post<SingleEventResponse>(
      '/events',
      payload,
      requestOptions
    );
  }

  /**
   * Track multiple events in a single batch operation
   * @param events Array of event payloads to track
   * @param options Optional tracking options
   * @returns The batch tracking response
   * 
   * @example
   * ```typescript
   * const events = [
   *   {
   *     event: 'page.view',
   *     identify: { email: 'user1@example.com' },
   *     properties: { page: '/home' }
   *   },
   *   {
   *     event: 'button.click',
   *     identify: { email: 'user2@example.com' },
   *     properties: { button: 'signup' }
   *   }
   * ];
   * 
   * const result = await smashsend.events.trackBatch(events);
   * console.log(`Accepted: ${result.accepted}, Failed: ${result.failed}`);
   * 
   * // Handle failed events
   * if (result.errors?.length > 0) {
   *   result.errors.forEach(error => {
   *     console.log(`Event ${error.index} failed:`, error.errors);
   *   });
   * }
   * ```
   */
  async trackBatch(
    events: EventPayload[],
    options: EventTrackingOptions = {}
  ): Promise<BatchEventResponse> {
    const headers = options.headers || {};
    const timeout = options.timeout;

    // Generate messageIds for events that don't have them
    const eventsWithIds = events.map(event => ({
      ...event,
      messageId: event.messageId || this.generateMessageId(),
    }));

    const payload: BatchEventPayload = {
      events: eventsWithIds,
    };

    const requestOptions: any = { headers };
    if (timeout) {
      requestOptions.timeout = timeout;
    }

    return await this.httpClient.post<BatchEventResponse>(
      '/events/batch',
      payload,
      requestOptions
    );
  }

  /**
   * Get event usage statistics
   * @param options Optional query options
   * @returns Event usage statistics
   * 
   * @example
   * ```typescript
   * // Get overall usage
   * const usage = await smashsend.events.getUsage();
   * console.log(`Events this month: ${usage.eventsThisMonth}`);
   * 
   * // Get usage for specific date range
   * const rangeUsage = await smashsend.events.getUsage({
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-31',
   *   includeBreakdown: true
   * });
   * ```
   */
  async getUsage(options: EventUsageOptions = {}): Promise<EventUsage> {
    const params: Record<string, string> = {};
    
    if (options.startDate) {
      params.startDate = options.startDate;
    }
    
    if (options.endDate) {
      params.endDate = options.endDate;
    }
    
    if (options.includeBreakdown !== undefined) {
      params.includeBreakdown = options.includeBreakdown.toString();
    }

    const response = await this.httpClient.get<{ usage: EventUsage }>(
      '/events/usage',
      { params }
    );
    
    return response.usage;
  }

  /**
   * Send a test event (for development/testing purposes)
   * @param event The test event payload
   * @returns The tracking response
   * 
   * @example
   * ```typescript
   * const response = await smashsend.events.sendTest({
   *   event: 'test.event',
   *   identify: {
   *     email: 'test@example.com'
   *   },
   *   properties: {
   *     environment: 'development'
   *   }
   * });
   * ```
   */
  async sendTest(event: EventPayload): Promise<SingleEventResponse> {
    const payload = {
      ...event,
      messageId: event.messageId || this.generateMessageId(),
    };

    return await this.httpClient.post<SingleEventResponse>(
      '/events/test',
      payload
    );
  }

  /**
   * Generate a unique message ID for event deduplication
   * @returns A unique message ID
   */
  private generateMessageId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `msg_${timestamp}_${randomPart}`;
  }
}