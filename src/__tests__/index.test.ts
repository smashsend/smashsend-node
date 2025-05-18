import { SmashSend, AuthenticationError } from '..';

// Mock fetch
global.fetch = jest.fn();
global.AbortController = jest.fn(() => ({
  abort: jest.fn(),
  signal: {},
})) as any;

describe('SmashSend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockImplementation((name) => {
          if (name === 'content-type') return 'application/json';
          if (name === 'x-request-id') return 'test-request-id';
          return null;
        }),
      },
      json: jest.fn().mockResolvedValue({}),
    });
  });

  describe('constructor', () => {
    it('should throw an error if API key is not provided', () => {
      expect(() => new SmashSend('')).toThrow(AuthenticationError);
    });

    it('should initialize with default options', () => {
      const client = new SmashSend('test-api-key');
      expect(client.emails).toBeDefined();
      expect(client.contacts).toBeDefined();
      expect(client.webhooks).toBeDefined();
    });

    it('should initialize with custom options', () => {
      const client = new SmashSend('test-api-key', {
        baseUrl: 'https://custom-api.smashsend.com',
        maxRetries: 5,
        timeout: 60000,
      });

      // Make a request to verify custom options
      client.emails.get('email-123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom-api.smashsend.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      );
    });
  });
});
