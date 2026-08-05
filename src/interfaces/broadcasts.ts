/**
 * Broadcasts API types.
 *
 * See https://smashsend.com/docs/api/broadcasts
 *
 * The Broadcasts API requires the Email API add-on, a verified workspace and
 * the early-access flag on your workspace.
 */

export interface BroadcastAudience {
  /** Send to every subscribed contact in the workspace. */
  all?: boolean;
  [key: string]: any;
}

export interface BroadcastSettings {
  trackOpens?: boolean;
  trackClicks?: boolean;
}

export interface BroadcastCreateOptions {
  /** Internal name shown in your dashboard. Defaults to the subject. */
  name?: string;
  /** Email subject line. Supports {{variables}}. */
  subject: string;
  previewText?: string;
  fromEmail: string;
  /** Sender display name. Defaults to your workspace name. */
  fromName?: string;
  replyTo?: string[];
  html: string;
  text?: string;
  audience: BroadcastAudience;
  settings?: BroadcastSettings;
  allowUnknownVariables?: boolean;
}

export interface Broadcast {
  id: string;
  name?: string;
  subject: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

export interface BroadcastResponse {
  broadcast: Broadcast;
}

export interface BroadcastListOptions {
  status?: string;
  limit?: number;
  cursor?: string;
}

export interface BroadcastListResponse {
  broadcasts: {
    cursor: string | null;
    hasMore: boolean;
    items: Broadcast[];
  };
}

export interface BroadcastScheduleOptions {
  /** ISO 8601 timestamp. Omit to send immediately, if supported. */
  sendAt?: string;
  deliveryMethod?: string;
}

export interface BroadcastTestOptions {
  /**
   * Test recipients. Must be members of your workspace. The email is sent with
   * a [TEST] subject prefix.
   */
  emails: string[];
}
