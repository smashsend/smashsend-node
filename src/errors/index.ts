export class SmashSendError extends Error {
  public readonly statusCode?: number;
  public readonly code: string;
  public readonly requestId?: string;
  public readonly data?: any;

  constructor(
    message: string,
    options: {
      code: string;
      statusCode?: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message);
    this.name = 'SmashSendError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.data = options.data;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((Error as any).captureStackTrace) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Error as any).captureStackTrace(this, SmashSendError);
    }
  }
}

export class APIError extends SmashSendError {
  constructor(
    message: string,
    options: {
      code: string;
      statusCode: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message, options);
    this.name = 'APIError';
  }
}

export class AuthenticationError extends SmashSendError {
  constructor(
    message: string,
    options: {
      code: string;
      statusCode?: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message, {
      ...options,
      statusCode: options.statusCode || 401,
      code: options.code || 'authentication_error',
    });
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends SmashSendError {
  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message, {
      ...options,
      statusCode: options.statusCode || 429,
      code: options.code || 'rate_limit_error',
    });
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends SmashSendError {
  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message, {
      ...options,
      code: options.code || 'network_error',
    });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends SmashSendError {
  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      data?: any;
    }
  ) {
    super(message, {
      ...options,
      code: options.code || 'timeout_error',
    });
    this.name = 'TimeoutError';
  }
}
