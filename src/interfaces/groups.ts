export interface GroupTraits {
  [key: string]: any;
}

export interface Group {
  id: string;
  publicId: string;
  displayName?: string;
  traits?: GroupTraits;
  createdAt: string;
  updatedAt?: string;
  workspaceId: string;
}

export interface GroupCreateOptions {
  publicId: string;
  displayName?: string;
  traits?: GroupTraits;
}

export interface GroupUpdateOptions {
  displayName?: string;
  traits?: GroupTraits;
}

export interface GroupListOptions {
  limit?: number;
  cursor?: string;
}

export interface GroupListResponse {
  cursor: string | null;
  hasMore: boolean;
  items: Group[];
}

export interface GroupContactListOptions {
  limit?: number;
  cursor?: string;
}

export interface GroupContactListResponse {
  cursor: string | null;
  hasMore: boolean;
  items: Array<{
    contactId: string;
    addedAt: string;
  }>;
}

export interface GroupCreateResponse {
  group: Group;
}

export interface GroupGetResponse {
  group: Group;
}

export interface GroupDeleteResponse {
  group: Group;
  isDeleted: boolean;
}

export interface GroupAddContactResponse {
  groupId: string;
  contactId: string;
  addedAt: string;
}

export interface GroupRemoveContactResponse {
  groupId: string;
  contactId: string;
  isRemoved: boolean;
}

