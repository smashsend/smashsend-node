import { HttpClient } from '../utils/http-client';
import { EmailSendOptions, EmailSendResponse } from '../interfaces/types';

export class Emails {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Send an email
   * @param options The email options
   * @returns The email send response
   */
  async send(options: EmailSendOptions): Promise<EmailSendResponse> {
    // Convert to array if single address
    const to = this.normalizeAddresses(options.to);
    const cc = options.cc ? this.normalizeAddresses(options.cc) : undefined;
    const bcc = options.bcc ? this.normalizeAddresses(options.bcc) : undefined;

    // Prepare the payload
    const payload = {
      ...options,
      to,
      cc,
      bcc,
    };

    return this.httpClient.post<EmailSendResponse>('/emails', payload);
  }

  /**
   * Get an email by ID
   * @param id The email ID
   * @returns The email details
   */
  async get(id: string): Promise<EmailSendResponse> {
    return this.httpClient.get<EmailSendResponse>(`/emails/${id}`);
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
    data: EmailSendResponse[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.httpClient.get<{
      data: EmailSendResponse[];
      total: number;
      limit: number;
      offset: number;
    }>('/emails', { params });
  }

  // Helper method to normalize addresses to array format
  private normalizeAddresses(
    addresses:
      | string
      | { email: string; name?: string }
      | Array<string | { email: string; name?: string }>
  ): Array<string | { email: string; name?: string }> {
    if (typeof addresses === 'string' || (typeof addresses === 'object' && 'email' in addresses)) {
      return [addresses];
    }
    return addresses;
  }
}
