import { HttpClient } from '../utils/http-client';
import type { ReactElement } from 'react';
import {
  RawEmailSendOptions,
  TemplatedEmailSendOptions,
  RawEmailSendResponse,
  TemplatedEmailSendResponse,
  TransactionalEmailSendResponse,
  ListTransactionalOptions,
  ListTransactionalResponse,
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

    if (options.react !== undefined) {
      // Lazy-load @react-email/render the first time it's needed
      if (!this.renderAsync) {
        try {
          const mod = await import('@react-email/render');
          if (typeof (mod as any).renderAsync === 'function') {
            // Use the async renderer directly
            this.renderAsync = (component: ReactElement) => (mod as any).renderAsync(component);
          } else if (typeof (mod as any).render === 'function') {
            // Wrap synchronous render in a Promise to keep the type consistent
            const syncRender = (mod as any).render;
            this.renderAsync = (component: ReactElement) => Promise.resolve(syncRender(component));
          } else {
            throw new Error(
              '`@react-email/render` does not export `renderAsync` or `render`. Please upgrade to the latest version.'
            );
          }
        } catch (err) {
          throw new Error(
            'Failed to render React email. Please install `@react-email/render` as a dependency.'
          );
        }
      }

      htmlBody =
        typeof options.react === 'string'
          ? options.react
          : await this.renderAsync(options.react as ReactElement);
    }

    // Check if neither html nor react was provided (not just falsy)
    if (htmlBody === null || htmlBody === undefined) {
      throw new Error('Either "html" or "react" must be provided when calling emails.send');
    }

    // Properly construct payload by destructuring and excluding react
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { react: _react, sendAt, ...restOptions } = options;

    const payload = {
      ...restOptions,
      html: htmlBody,
      sendAt: sendAt instanceof Date ? sendAt.toISOString() : sendAt,
    };

    const response = await this.httpClient.post<{ email: RawEmailSendResponse }>(
      '/emails',
      payload
    );
    return response.email;
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
    const response = await this.httpClient.post<{ email: TemplatedEmailSendResponse }>('/emails', {
      ...options,
      sendAt: options.sendAt instanceof Date ? options.sendAt.toISOString() : options.sendAt,
    });
    return response.email;
  }

  /**
   * Get an email by ID
   * @param id The email ID
   * @returns The email details
   */
  async get(id: string): Promise<TransactionalEmailSendResponse> {
    const response = await this.httpClient.get<{ email: TransactionalEmailSendResponse }>(
      `/emails/${id}`
    );
    return response.email;
  }

  // /**
  //  * List sent emails
  //  * @param params Optional parameters for filtering and pagination
  //  * @returns A response object containing emails list with pagination metadata
  //  */
  // async list(params?: {
  //   limit?: number;
  //   offset?: number;
  //   from?: string;
  //   to?: string;
  //   status?: string;
  //   tags?: string[];
  // }): Promise<{
  //   data: TransactionalEmailSendResponse[];
  //   total: number;
  //   limit: number;
  //   offset: number;
  // }> {
  //   const response = await this.httpClient.get<{
  //     emails: {
  //       data: TransactionalEmailSendResponse[];
  //       total: number;
  //       limit: number;
  //       offset: number;
  //     };
  //   }>('/emails', { params });
  //   return response.emails;
  // }

  /**
   * List transactional email templates
   *
   * @example
   * ```ts
   * // List all active transactionals
   * await smashsend.emails.listTransactional({ status: 'ACTIVE' });
   *
   * // List with pagination
   * await smashsend.emails.listTransactional({
   *   limit: 50,
   *   cursor: 'next_page_cursor'
   * });
   * ```
   */
  async listTransactional(params?: ListTransactionalOptions): Promise<ListTransactionalResponse> {
    const response = await this.httpClient.get<{
      transactional: ListTransactionalResponse;
    }>('/transactional', { params });
    return response.transactional;
  }
}
