import { HttpClient } from '../utils/http-client';
import {
  ListTransactionalOptions,
  ListTransactionalResponse,
  Transactional,
} from '../interfaces/types';

export class TransactionalEmails {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(id: string): Promise<Transactional> {
    const response = await this.httpClient.get<{
      transactional: Transactional;
    }>(`/transactional/${id}`);
    return response.transactional;
  }
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
  async list(params?: ListTransactionalOptions): Promise<ListTransactionalResponse> {
    const response = await this.httpClient.get<{
      transactional: ListTransactionalResponse;
    }>('/transactional', { params });
    return response.transactional;
  }
}
