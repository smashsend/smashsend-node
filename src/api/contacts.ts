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
  async create(options: ContactCreateOptions): Promise<{ contact: Contact }> {
    const { customProperties, ...rest } = options;

    return this.httpClient.post<{ contact: Contact }>('/contacts', {
      // Transform the input format to the backend expected format
      properties: {
        ...rest,
        ...(customProperties || {}),
      },
    });
  }

  /**
   * Get a contact by ID
   * @param id The contact ID
   * @returns The contact details
   */
  async get(id: string): Promise<{ contact: Contact }> {
    return this.httpClient.get<{ contact: Contact }>(`/contacts/${id}`);
  }

  /**
   * Update a contact
   * @param id The contact ID
   * @param options The contact update options
   * @returns The updated contact
   */
  async update(id: string, options: Partial<ContactCreateOptions>): Promise<{ contact: Contact }> {
    const { customProperties, ...rest } = options;

    // Transform the input format to the backend expected format
    const backendFormat: any = {
      properties: {
        ...rest,
        ...(customProperties || {}),
      },
    };

    return this.httpClient.put<{ contact: Contact }>(`/contacts/${id}`, backendFormat);
  }

  /**
   * Delete a contact
   * @param id The contact ID
   * @returns Deletion status
   */
  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.httpClient.delete<{ deleted: boolean }>(`/contacts/${id}`);
  }

  /**
   * List contacts
   * @param params Optional parameters for filtering and pagination
   * @returns A list of contacts with pagination info
   */
  async list(params?: { limit?: number; offset?: number }): Promise<{
    contacts: Contact[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  }> {
    return this.httpClient.get<{
      contacts: Contact[];
      pagination: {
        total: number;
        limit: number;
        offset: number;
      };
    }>('/contacts', { params });
  }

  /**
   * List all contact properties
   * @returns A list of contact properties
   */
  async listProperties(): Promise<{
    properties: Array<{
      id: string;
      name: string;
      label: string;
      type: string;
      createdAt: string;
      description?: string;
    }>;
  }> {
    return this.httpClient.get<{
      properties: Array<{
        id: string;
        name: string;
        label: string;
        type: string;
        createdAt: string;
        description?: string;
      }>;
    }>('/contact-properties');
  }

  /**
   * Create a new contact property
   * @param options The property creation options
   * @returns The created property
   */
  async createProperty(options: {
    name: string;
    label: string;
    type: string;
    description?: string;
  }): Promise<{
    property: {
      id: string;
      name: string;
      label: string;
      type: string;
      description?: string;
      createdAt: string;
    };
  }> {
    return this.httpClient.post<{
      property: {
        id: string;
        name: string;
        label: string;
        type: string;
        description?: string;
        createdAt: string;
      };
    }>('/contact-properties', options);
  }

  /**
   * Update a contact property
   * @param id The property ID
   * @param options The property update options
   * @returns The updated property
   */
  async updateProperty(
    id: string,
    options: {
      label?: string;
      description?: string;
    }
  ): Promise<{
    property: {
      id: string;
      name: string;
      label: string;
      type: string;
      description?: string;
      createdAt: string;
    };
  }> {
    return this.httpClient.put<{
      property: {
        id: string;
        name: string;
        label: string;
        type: string;
        description?: string;
        createdAt: string;
      };
    }>(`/contact-properties/${id}`, options);
  }
}
