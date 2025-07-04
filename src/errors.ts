export interface ErrorOptions {
  code?: string;
  statusCode?: number;
  requestId?: string;
  cause?: Error;
  data?: any;
}

export class SmashSendError extends Error {
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly requestId?: string;
  public readonly cause?: Error;
  public readonly data?: any;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message);
    this.name = 'SmashSendError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.cause = options.cause;
    this.data = options.data;
  }
}

export class APIError extends SmashSendError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = 'APIError';
  }
}

export class AuthenticationError extends SmashSendError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends SmashSendError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends SmashSendError {
  public readonly retryAfter?: number;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = 'RateLimitError';
    this.retryAfter = typeof options === 'number' ? options : undefined;
  }
}

export class TimeoutError extends SmashSendError {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = 'TimeoutError';
  }
}
