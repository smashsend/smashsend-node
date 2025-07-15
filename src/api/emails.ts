import { HttpClient } from '../utils/http-client';
import type { ReactElement } from 'react';
import {
  RawEmailSendOptions,
  TemplatedEmailSendOptions,
  RawEmailSendResponse,
  TemplatedEmailSendResponse,
  TransactionalEmailSendResponse,
} from '../interfaces/types';

export class Emails {
  private httpClient: HttpClient;
  // Cache for the async renderer so we only import @react-email/render once
  private renderAsync?: (component: ReactElement) => Promise<string>;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Send a **raw** HTML / text email (no stored template).
   *
   * @example
   * ```ts
   * await smashsend.emails.send({
   *   from: 'John <john@acme.com>',
   *   to: 'jane@example.com',
   *   subject: 'Hi there!',
   *   html: '<strong>Welcome</strong>',
   * });
   * ```
   */
  async send(options: RawEmailSendOptions): Promise<RawEmailSendResponse> {
    // If a React element or JSX provided, render it to HTML first
    let htmlBody = options.html;

    if (options.react) {
      // Lazy-load @react-email/render the first time it's needed
      if (!this.renderAsync) {
        try {
          const mod = await import('@react-email/render');
          this.renderAsync = (mod as any).renderAsync ?? (mod as any).render;
        } catch (err) {
          throw new Error(
            'Failed to render React email. Please install `@react-email/render` as a dependency.'
          );
        }
      }

      htmlBody =
        typeof options.react === 'string'
          ? options.react
          : await (this.renderAsync as (c: ReactElement) => Promise<string>)(
              options.react as ReactElement
            );
    }

    if (!htmlBody) {
      throw new Error('Either "html" or "react" must be provided when calling emails.send');
    }

    // Prepare payload without the `react` field
    const payload = { ...options, html: htmlBody } as Omit<RawEmailSendOptions, 'react'> & {
      html: string;
    };

    delete (payload as any).react;

    return this.httpClient.post<RawEmailSendResponse>('/emails', {
      ...payload,
      sendAt: options.sendAt instanceof Date ? options.sendAt.toISOString() : options.sendAt,
    });
  }

  /**
   * Send an email **using a stored template**.
   *
   * @example
   * ```ts
   * await smashsend.emails.sendWithTemplate({
   *   template: 'payment-received',
   *   to: 'jane@example.com',
   *   variables: { amount: 42 },
   * });
   * ```
   */
  async sendWithTemplate(options: TemplatedEmailSendOptions): Promise<TemplatedEmailSendResponse> {
    return this.httpClient.post<TemplatedEmailSendResponse>('/emails', {
      ...options,
      sendAt: options.sendAt instanceof Date ? options.sendAt.toISOString() : options.sendAt,
    });
  }

  /**
   * Get an email by ID
   * @param id The email ID
   * @returns The email details
   */
  async get(id: string): Promise<TransactionalEmailSendResponse> {
    return this.httpClient.get<TransactionalEmailSendResponse>(`/emails/${id}`);
  }

  /**
   * List sent emails
   * @param params Optional parameters for filtering and pagination
   * @returns A list of emails
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    from?: string;
    to?: string;
    status?: string;
    tags?: string[];
  }): Promise<{
    data: TransactionalEmailSendResponse[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.httpClient.get<{
      data: TransactionalEmailSendResponse[];
      total: number;
      limit: number;
      offset: number;
    }>('/emails', { params });
  }
}
