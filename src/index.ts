import { Contacts } from './api/contacts';
import { Emails } from './api/emails';
import { Webhooks } from './api/webhooks';
import { ApiKeys } from './api/api-keys';
import { Domains } from './api/domains';
import { HttpClient } from './utils/http-client';
import { SmashSendClientOptions } from './interfaces/types';
import {
  SmashSendError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from './errors';

export class SmashSend {
  /**
   * The Emails API resource
   */
  public readonly emails: Emails;

  /**
   * The Contacts API resource
   */
  public readonly contacts: Contacts;

  /**
   * The Webhooks API resource
   */
  public readonly webhooks: Webhooks;

  /**
   * The API Keys resource
   */
  public readonly apiKeys: ApiKeys;

  /**
   * The Domains API resource
   */
  public readonly domains: Domains;

  private httpClient: HttpClient;

  /**
   * Create a new SmashSend client instance
   *
   * @param apiKey Your SmashSend API key
   * @param options Configuration options for the client
   */
  constructor(apiKey: string, options: SmashSendClientOptions = {}) {
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
      options.timeout || 30000,
      options.apiVersion || 'v1'
    );

    // Initialize API resources
    this.emails = new Emails(this.httpClient);
    this.contacts = new Contacts(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
    this.apiKeys = new ApiKeys(this.httpClient);
    this.domains = new Domains(this.httpClient);
  }

  /**
   * Set custom headers to be included with every request
   * @param headers Record of header names and values
   * @returns The SmashSend instance for chaining
   */
  setHeaders(headers: Record<string, string>): SmashSend {
    this.httpClient.setHeaders(headers);
    return this;
  }

  /**
   * Set a specific custom header
   * @param name Header name
   * @param value Header value
   * @returns The SmashSend instance for chaining
   */
  setHeader(name: string, value: string): SmashSend {
    this.httpClient.setHeader(name, value);
    return this;
  }

  /**
   * Enable or disable debug mode
   * When enabled, requests and responses will be logged to console
   * @param enabled Whether debug mode should be enabled
   * @returns The SmashSend instance for chaining
   */
  setDebugMode(enabled: boolean): SmashSend {
    this.httpClient.setDebugMode(enabled);
    return this;
  }

  /**
   * Set the API version to use for requests
   * @param version API version string (e.g., 'v1', 'v2', etc.)
   * @returns The SmashSend instance for chaining
   */
  setApiVersion(version: string): SmashSend {
    this.httpClient.setApiVersion(version);
    return this;
  }
}

// Export types and errors
export type { SmashSendClientOptions } from './interfaces/types';
export type {
  RawEmailSendOptions,
  TemplatedEmailSendOptions,
  TransactionalEmailSendOptions,
  RawEmailSendResponse,
  TemplatedEmailSendResponse,
  TransactionalEmailSendResponse,
  ContactCreateOptions,
  Contact,
  WebhookCreateOptions,
  Webhook,
  EmailAddress,
  EmailAttachment,
  ApiKeyValidationResponse,
  ApiKeyInfo,
  ApiKeyCreateOptions,
  ApiKeyUpdateOptions,
  ApiKeyListOptions,
  ApiKeyListResponse,
  ApiKeyDeleteResponse,
  CustomProperty,
  CustomPropertyCreateOptions,
  CustomPropertyUpdateOptions,
  CustomPropertyListResponse,
  WebhookUpdateOptions,
} from './interfaces/types';

// Export domain types
export type { VerifiedEmailIdentities } from './api/domains';

// Export enums
export {
  SmashsendContactStatus,
  SmashsendCountryCode,
  SmashsendPropertyType,
  SmashsendApiKeyRole,
  SmashsendApiKeyStatus,
  SmashsendContactSource,
  SmashsendContactPropertyFilterType,
  SmashsendWebhookStatus,
  SmashsendWebhookEvent,
  TransactionalEmailStatus,
} from './interfaces/types';

export {
  SmashSendError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
};
