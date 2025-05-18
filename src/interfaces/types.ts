// Common interfaces
export interface SmashSendClientOptions {
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
  fetch?: any;
  apiVersion?: string;
}

export interface SmashSendError {
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
  name?: string;
  tags?: string[];
  properties?: Record<string, any>;
}

export interface Contact {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  tags?: string[];
  properties?: Record<string, any>;
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
  createdAt: string;
}
