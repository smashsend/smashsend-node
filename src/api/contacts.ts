import { HttpClient } from '../utils/http-client';
import { safeToISOString } from '../utils/date-utils';
import {
  Contact,
  ContactCreateOptions,
  CustomPropertyListResponse,
  CustomProperty,
  CustomPropertyCreateOptions,
  CustomPropertyUpdateOptions,
  BatchContactsResponse,
  BatchContactsOptions,
} from '../interfaces/types';

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
    const { customProperties, ...rest } = options;
    const response = await this.httpClient.post<{ contact: Contact }>('/contacts', {
      // Transform the input format to the backend expected format
      properties: {
        ...rest,
        ...(customProperties || {}),
      },
    });
    return response.contact;
  }

  /**
   * Create multiple contacts in a single batch operation
   *
   * @param contacts Array of contact creation options
   * @param options Batch operation options
   * @returns Batch operation result with success/failure details
   *
   * @example
   * ```typescript
   * // Basic batch creation
   * const result = await smashsend.contacts.createBatch([
   *   { email: 'john@example.com', firstName: 'John' },
   *   { email: 'jane@example.com', firstName: 'Jane' }
   * ]);
   *
   * console.log(`Created: ${result.summary.created}, Failed: ${result.summary.failed}`);
   *
   * // With retry-friendly options
   * const result = await smashsend.contacts.createBatch(contacts, {
   *   allowPartialSuccess: true,
   *   includeFailedContacts: true
   * });
   *
   * // Easy retry of failed contacts
   * if (result.failedContacts?.length > 0) {
   *   const retryableContacts = result.failedContacts
   *     .filter(fc => fc.errors.some(e => e.retryable))
   *     .map(fc => fc.contact);
   *
   *   if (retryableContacts.length > 0) {
   *     await smashsend.contacts.createBatch(retryableContacts);
   *   }
   * }
   *
   * // ⚠️ MIGRATION USE ONLY - Preserve historical creation dates
   * const legacyContacts = [
   *   {
   *     email: 'user@legacy-system.com',
   *     firstName: 'John',
   *     createdAt: new Date('2023-01-15T10:30:00Z') // Historical date
   *   }
   * ];
   * await smashsend.contacts.createBatch(legacyContacts, {
   *   overrideCreatedAt: true // Only for data migration!
   * });
   * ```
   */
  async createBatch(
    contacts: ContactCreateOptions[],
    options: BatchContactsOptions = {}
  ): Promise<BatchContactsResponse> {
    const queryParams = new URLSearchParams();

    if (options.allowPartialSuccess !== undefined) {
      queryParams.set('allowPartialSuccess', options.allowPartialSuccess.toString());
    }

    if (options.includeFailedContacts !== undefined) {
      queryParams.set('includeFailedContacts', options.includeFailedContacts.toString());
    }

    if (options.overrideCreatedAt !== undefined) {
      queryParams.set('overrideCreatedAt', options.overrideCreatedAt.toString());
    }

    const url = `/contacts/batch${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Transform contacts to backend format
    const payload = {
      contacts: contacts.map((contact) => {
        const { customProperties, createdAt, ...rest } = contact;

        // Safely convert createdAt to ISO string
        const createdAtIso = safeToISOString(createdAt);

        return {
          properties: {
            ...rest,
            ...(createdAtIso ? { createdAt: createdAtIso } : {}),
            ...(customProperties || {}),
          },
        };
      }),
    };

    return await this.httpClient.post<BatchContactsResponse>(url, payload);
  }

  /**
   * Search for a contact by email
   * @param email The contact email address
   * @returns The contact details or null if not found
   */
  async search(email: string): Promise<Contact | null> {
    const response = await this.httpClient.get<{ contact: Contact | null }>('/contacts/search', {
      params: { email },
    });
    return response.contact;
  }

  /**
   * Get a contact by ID
   * @param id The contact ID
   * @returns The contact details
   */
  async get(id: string): Promise<Contact> {
    const response = await this.httpClient.get<{ contact: Contact }>(`/contacts/${id}`);
    return response.contact;
  }

  /**
   * Update a contact
   * @param id The contact ID
   * @param options The contact update options
   * @returns The updated contact
   */
  async update(id: string, options: Partial<ContactCreateOptions>): Promise<Contact> {
    const { customProperties, ...rest } = options;
    const response = await this.httpClient.put<{ contact: Contact }>(`/contacts/${id}`, {
      // Transform the input format to the backend expected format
      properties: {
        ...rest,
        ...(customProperties || {}),
      },
    });
    return response.contact;
  }

  /**
   * Delete a contact
   * @param id The contact ID
   * @returns The deletion status and deleted contact
   */
  async delete(id: string): Promise<{ isDeleted: boolean; contact: Contact }> {
    return this.httpClient.delete<{ isDeleted: boolean; contact: Contact }>(`/contacts/${id}`);
  }

  /**
   * Delete a contact by email address
   * @param email The contact email address
   * @returns The deletion status and deleted contact
   */
  async deleteByEmail(email: string): Promise<{ isDeleted: boolean; contact: Contact }> {
    return this.httpClient.delete<{ isDeleted: boolean; contact: Contact }>(
      `/contacts/by-email/${encodeURIComponent(email)}`
    );
  }

  /**
   * List contacts
   * @param params Optional parameters for filtering and pagination
   * @returns A list of contacts with pagination info
   */
  async list(params?: {
    limit?: number;
    cursor?: string;
    sort?: 'createdAt.desc' | 'createdAt.asc';
    search?: string;
    status?: string;
    filter?: any;
    includeCount?: boolean;
  }): Promise<{
    contacts: {
      items: Contact[];
      cursor?: string;
      hasMore: boolean;
      totalCount?: number;
    };
  }> {
    return this.httpClient.get<{
      contacts: {
        items: Contact[];
        cursor?: string;
        hasMore: boolean;
        totalCount?: number;
      };
    }>('/contacts', { params });
  }

  /**
   * List all contact properties (custom properties only)
   * @returns A list of custom contact properties
   */
  async listProperties(): Promise<CustomPropertyListResponse> {
    const response = await this.httpClient.get<{ properties: CustomPropertyListResponse }>(
      '/contacts/properties',
      { params: { type: 'CUSTOM', limit: 50 } }
    );
    return response.properties;
  }

  /**
   * Create a new contact property
   * @param options The property creation options
   * @returns The created property
   */
  async createProperty(options: CustomPropertyCreateOptions): Promise<CustomProperty> {
    const response = await this.httpClient.post<{
      property: CustomProperty;
    }>('/contact-properties', options);
    return response.property;
  }

  /**
   * Update a contact property
   * @param id The property ID
   * @param options The property update options
   * @returns The updated property
   */
  async updateProperty(id: string, options: CustomPropertyUpdateOptions): Promise<CustomProperty> {
    const response = await this.httpClient.put<{
      property: CustomProperty;
    }>(`/contact-properties/${id}`, options);
    return response.property;
  }
}
