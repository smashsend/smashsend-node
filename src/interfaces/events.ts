// Events API types for SmashSend

/**
 * Event tracking payload for single event
 */
export interface EventPayload {
  /** Event name (alphanumeric, underscores, hyphens, dots, colons only) */
  event: string;
  /** Event properties - key-value pairs with any data */
  properties?: Record<string, any>;
  /** User identification information */
  identify: {
    /** Anonymous user ID (optional) */
    anonymousId?: string;
    /** Registered user ID (optional) */
    userId?: string;
    /** User email address (required) */
    email: string;
  };
  /** Event timestamp (ISO string or Unix timestamp) */
  timestamp?: string | number;
  /** Unique message ID for deduplication (optional) */
  messageId?: string;
}

/**
 * Batch events payload for multiple events
 */
export interface BatchEventPayload {
  /** Array of events to track */
  events: EventPayload[];
}

/**
 * Response from single event tracking
 */
export interface SingleEventResponse {
  /** Always true for successful events */
  success: true;
  /** Unique message ID assigned by SmashSend */
  messageId: string;
  /** Optional informational message */
  info?: string;
}

/**
 * Response from batch event tracking
 */
export interface BatchEventResponse {
  /** Number of events successfully accepted */
  accepted: number;
  /** Number of events that failed processing */
  failed: number;
  /** Number of duplicate events (already processed) */
  duplicated: number;
  /** Details of successfully processed events */
  events?: Array<{
    /** Index of event in the original batch */
    index: number;
    /** Message ID assigned by SmashSend */
    messageId: string;
    /** Processing status */
    status: 'accepted' | 'duplicate';
  }>;
  /** Details of failed events */
  errors?: Array<{
    /** Index of failed event in the original batch */
    index: number;
    /** Array of error details */
    errors: Array<{
      /** Error code */
      code: string;
      /** Human-readable error message */
      message: string;
    }>;
  }>;
}

/**
 * Options for tracking events
 */
export interface EventTrackingOptions {
  /** Custom headers to include with the request */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Error response from events API
 */
export interface EventsErrorResponse {
  error: {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
  };
}

/**
 * Event usage statistics
 */
export interface EventUsage {
  /** Total events tracked in the time period */
  totalEvents: number;
  /** Events tracked today */
  eventsToday: number;
  /** Events tracked this month */
  eventsThisMonth: number;
  /** Remaining events in current billing period */
  remainingEvents?: number;
  /** Next reset date for usage limits */
  resetDate?: string;
}

/**
 * Event usage query options
 */
export interface EventUsageOptions {
  /** Start date for usage statistics (ISO string) */
  startDate?: string;
  /** End date for usage statistics (ISO string) */
  endDate?: string;
  /** Include detailed breakdown by event name */
  includeBreakdown?: boolean;
}
