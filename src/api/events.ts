import { HttpClient } from '../utils/http-client';
import {
  EventPayload,
  BatchEventPayload,
  SingleEventResponse,
  BatchEventResponse,
  EventTrackingOptions
} from '../interfaces/events';

export class Events {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Send a single event
   * @param event The event payload to send
   * @param options Optional tracking options
   * @returns The event response
   * 
   * @example
   * ```typescript
   * // Basic event sending (SMASHSEND generates messageId automatically)
   * const response = await smashsend.events.send({
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
   * console.log(`Event sent with ID: ${response.messageId}`);
   * 
   * // With custom messageId for deduplication
   * const customResponse = await smashsend.events.send({
   *   event: 'purchase.completed',
   *   identify: { email: 'user@example.com' },
   *   properties: { orderId: 'order_123' },
   *   messageId: 'custom_msg_id_123' // Optional: for custom deduplication
   * });
   * ```
   */
  async send(
    event: EventPayload,
    options: EventTrackingOptions = {}
  ): Promise<SingleEventResponse> {
    const headers = options.headers || {};
    const timeout = options.timeout;

    // Use provided messageId or let SMASHSEND generate one
    const payload = { ...event };

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
   * Send multiple events in a single batch operation
   * @param events Array of event payloads to send
   * @param options Optional tracking options
   * @returns The batch event response
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
   * const result = await smashsend.events.sendBatch(events);
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
  async sendBatch(
    events: EventPayload[],
    options: EventTrackingOptions = {}
  ): Promise<BatchEventResponse> {
    const headers = options.headers || {};
    const timeout = options.timeout;

    // Use provided messageIds or let SMASHSEND generate them
    const payload: BatchEventPayload = {
      events: events,
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
}