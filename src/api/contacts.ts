import { HttpClient } from '../utils/http-client';
import { Contact, ContactCreateOptions } from '../interfaces/types';

export class Contacts {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new contact
   * @param options The contact creation options
   * @returns The created contact
   */
  async create(options: ContactCreateOptions): Promise<Contact> {
    return this.httpClient.post<Contact>('/contacts', options);
  }

  /**
   * Get a contact by ID
   * @param id The contact ID
   * @returns The contact details
   */
  async get(id: string): Promise<Contact> {
    return this.httpClient.get<Contact>(`/contacts/${id}`);
  }

  /**
   * Update a contact
   * @param id The contact ID
   * @param options The contact update options
   * @returns The updated contact
   */
  async update(id: string, options: Partial<ContactCreateOptions>): Promise<Contact> {
    return this.httpClient.patch<Contact>(`/contacts/${id}`, options);
  }

  /**
   * Delete a contact
   * @param id The contact ID
   * @returns Success status
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>(`/contacts/${id}`);
  }

  /**
   * List contacts
   * @param params Optional parameters for filtering and pagination
   * @returns A list of contacts
   */
  async list(params?: {
    limit?: number;
    offset?: number;
    email?: string;
    tag?: string;
    listId?: string;
  }): Promise<{
    data: Contact[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.httpClient.get<{
      data: Contact[];
      total: number;
      limit: number;
      offset: number;
    }>('/contacts', { params });
  }

  /**
   * Add a contact to a list
   * @param contactId The contact ID
   * @param listId The list ID
   * @returns Success status
   */
  async addToList(contactId: string, listId: string): Promise<{ success: boolean }> {
    return this.httpClient.post<{ success: boolean }>(
      `/contacts/${contactId}/lists`,
      { listId }
    );
  }

  /**
   * Remove a contact from a list
   * @param contactId The contact ID
   * @param listId The list ID
   * @returns Success status
   */
  async removeFromList(contactId: string, listId: string): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>(
      `/contacts/${contactId}/lists/${listId}`
    );
  }

  /**
   * Add tags to a contact
   * @param contactId The contact ID
   * @param tags Array of tags to add
   * @returns The updated contact
   */
  async addTags(contactId: string, tags: string[]): Promise<Contact> {
    return this.httpClient.post<Contact>(
      `/contacts/${contactId}/tags`,
      { tags }
    );
  }

  /**
   * Remove tags from a contact
   * @param contactId The contact ID
   * @param tags Array of tags to remove
   * @returns The updated contact
   */
  async removeTags(contactId: string, tags: string[]): Promise<Contact> {
    return this.httpClient.delete<Contact>(
      `/contacts/${contactId}/tags`,
      { data: { tags } }
    );
  }
} 