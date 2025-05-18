import { Emails } from './api/emails';
import { Contacts } from './api/contacts';
import { Campaigns } from './api/campaigns';
import { Webhooks } from './api/webhooks';
import { HttpClient } from './utils/http-client';
import { SMASHSENDClientOptions } from './interfaces/types';
import {
  SMASHSENDError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from './errors';

export class SMASHSEND {
  /**
   * The Emails API resource
   */
  public readonly emails: Emails;

  /**
   * The Contacts API resource
   */
  public readonly contacts: Contacts;

  /**
   * The Campaigns API resource
   */
  public readonly campaigns: Campaigns;

  /**
   * The Webhooks API resource
   */
  public readonly webhooks: Webhooks;

  private httpClient: HttpClient;

  /**
   * Create a new SMASHSEND client instance
   *
   * @param apiKey Your SMASHSEND API key
   * @param options Configuration options for the client
   */
  constructor(apiKey: string, options: SMASHSENDClientOptions = {}) {
    if (!apiKey) {
      throw new AuthenticationError('API key is required', {
        code: 'api_key_required',
      });
    }

    // Initialize the HTTP client
    this.httpClient = new HttpClient(
      apiKey,
      options.baseUrl || 'https://api.smashsend.com',
      options.maxRetries || 3,
      options.timeout || 30000
    );

    // Initialize API resources
    this.emails = new Emails(this.httpClient);
    this.contacts = new Contacts(this.httpClient);
    this.campaigns = new Campaigns(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
  }

  /**
   * Set custom headers to be included with every request
   * @param headers Record of header names and values
   * @returns The SMASHSEND instance for chaining
   */
  setHeaders(headers: Record<string, string>): SMASHSEND {
    this.httpClient.setHeaders(headers);
    return this;
  }

  /**
   * Set a specific custom header
   * @param name Header name
   * @param value Header value
   * @returns The SMASHSEND instance for chaining
   */
  setHeader(name: string, value: string): SMASHSEND {
    this.httpClient.setHeader(name, value);
    return this;
  }

  /**
   * Enable or disable debug mode
   * When enabled, requests and responses will be logged to console
   * @param enabled Whether debug mode should be enabled
   * @returns The SMASHSEND instance for chaining
   */
  setDebugMode(enabled: boolean): SMASHSEND {
    this.httpClient.setDebugMode(enabled);
    return this;
  }
}

// Export types and errors
export type { SMASHSENDClientOptions } from './interfaces/types';
export type {
  EmailSendOptions,
  EmailSendResponse,
  ContactCreateOptions,
  Contact,
  CampaignCreateOptions,
  Campaign,
  WebhookCreateOptions,
  Webhook,
} from './interfaces/types';
export {
  SMASHSENDError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
};
