import { HttpClient } from '../utils/http-client';
import {
  Group,
  GroupCreateOptions,
  GroupUpdateOptions,
  GroupListOptions,
  GroupListResponse,
  GroupContactListOptions,
  GroupContactListResponse,
  GroupCreateResponse,
  GroupGetResponse,
  GroupDeleteResponse,
  GroupAddContactResponse,
  GroupRemoveContactResponse,
} from '../interfaces/groups';

export class Groups {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new group
   * @param data Group creation options
   * @returns The created group
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.create({
   *   publicId: 'company_123',
   *   displayName: 'Acme Corp',
   *   traits: {
   *     industry: 'technology',
   *     employees: 500
   *   }
   * });
   *
   * console.log(`Group created: ${response.group.id}`);
   * ```
   */
  async create(data: GroupCreateOptions): Promise<GroupCreateResponse> {
    return await this.httpClient.post<GroupCreateResponse>('/groups', data);
  }

  /**
   * List all groups with optional pagination
   * @param params Pagination parameters
   * @returns List of groups
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.list({ limit: 10 });
   *
   * response.items.forEach(group => {
   *   console.log(`${group.displayName}: ${group.publicId}`);
   * });
   *
   * if (response.hasMore) {
   *   const nextPage = await smashsend.groups.list({ cursor: response.cursor });
   * }
   * ```
   */
  async list(params?: GroupListOptions): Promise<GroupListResponse> {
    return await this.httpClient.get<GroupListResponse>('/groups', { params });
  }

  /**
   * Get a group by ID
   * @param groupId The group ID
   * @returns The group
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.get('grp_123abc');
   * console.log(response.group.displayName);
   * ```
   */
  async get(groupId: string): Promise<GroupGetResponse> {
    return await this.httpClient.get<GroupGetResponse>(`/groups/${groupId}`);
  }

  /**
   * Update a group
   * @param groupId The group ID
   * @param data Update options
   * @returns The updated group
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.update('grp_123abc', {
   *   displayName: 'Acme Corporation',
   *   traits: { employees: 600 }
   * });
   * ```
   */
  async update(groupId: string, data: GroupUpdateOptions): Promise<GroupGetResponse> {
    return await this.httpClient.patch<GroupGetResponse>(`/groups/${groupId}`, data);
  }

  /**
   * Delete a group
   * @param groupId The group ID
   * @returns Deletion confirmation
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.delete('grp_123abc');
   * if (response.isDeleted) {
   *   console.log('Group deleted successfully');
   * }
   * ```
   */
  async delete(groupId: string): Promise<GroupDeleteResponse> {
    return await this.httpClient.delete<GroupDeleteResponse>(`/groups/${groupId}`);
  }

  /**
   * Add a contact to a group
   * @param groupId The group ID
   * @param contactId The contact ID
   * @returns Confirmation of contact addition
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.addContact('grp_123abc', 'ctc_456def');
   * console.log(`Contact added at ${response.addedAt}`);
   * ```
   */
  async addContact(groupId: string, contactId: string): Promise<GroupAddContactResponse> {
    return await this.httpClient.post<GroupAddContactResponse>(`/groups/${groupId}/contacts`, {
      contactId,
    });
  }

  /**
   * Remove a contact from a group
   * @param groupId The group ID
   * @param contactId The contact ID
   * @returns Confirmation of contact removal
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.removeContact('grp_123abc', 'ctc_456def');
   * if (response.isRemoved) {
   *   console.log('Contact removed from group');
   * }
   * ```
   */
  async removeContact(groupId: string, contactId: string): Promise<GroupRemoveContactResponse> {
    return await this.httpClient.delete<GroupRemoveContactResponse>(
      `/groups/${groupId}/contacts/${contactId}`
    );
  }

  /**
   * List contacts in a group
   * @param groupId The group ID
   * @param params Pagination parameters
   * @returns List of contacts in the group
   *
   * @example
   * ```typescript
   * const response = await smashsend.groups.listContacts('grp_123abc', { limit: 20 });
   *
   * response.items.forEach(item => {
   *   console.log(`Contact ${item.contactId} added at ${item.addedAt}`);
   * });
   * ```
   */
  async listContacts(
    groupId: string,
    params?: GroupContactListOptions
  ): Promise<GroupContactListResponse> {
    return await this.httpClient.get<GroupContactListResponse>(`/groups/${groupId}/contacts`, {
      params,
    });
  }
}

