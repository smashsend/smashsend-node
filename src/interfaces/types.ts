// Common interfaces
export interface SMASHSENDClientOptions {
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
  fetch?: any;
}

export interface SMASHSENDError {
  code: string;
  message: string;
  requestId?: string;
  statusCode?: number;
  data?: any;
}

// Email interfaces
export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailSendOptions {
  from: string | EmailAddress;
  to: string | EmailAddress | Array<string | EmailAddress>;
  cc?: string | EmailAddress | Array<string | EmailAddress>;
  bcc?: string | EmailAddress | Array<string | EmailAddress>;
  replyTo?: string | EmailAddress;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  tags?: string[];
  templateId?: string;
  templateData?: Record<string, any>;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array;
  contentType?: string;
}

export interface EmailSendResponse {
  id: string;
  from: string;
  to: string[];
  created: string;
  statusCode: number;
  message: string;
}

// Contact interfaces
export interface ContactCreateOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  custom?: Record<string, any>;
  tags?: string[];
  listIds?: string[];
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  custom?: Record<string, any>;
  tags?: string[];
  listIds?: string[];
  createdAt: string;
  updatedAt: string;
}

// Campaign interfaces
export interface CampaignCreateOptions {
  name: string;
  subject: string;
  content: string;
  senderEmail?: string;
  senderName?: string;
  listIds?: string[];
  segmentIds?: string[];
  scheduledAt?: string | Date;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  senderEmail: string;
  senderName?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled';
  listIds: string[];
  segmentIds?: string[];
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
  };
}

// Webhook interfaces
export interface WebhookCreateOptions {
  url: string;
  events: string[];
  description?: string;
  enabled?: boolean;
  secret?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  description?: string;
  enabled: boolean;
  secret?: string;
  createdAt: string;
  updatedAt: string;
}
