import { SmashSend } from '../index';
import fetch from 'cross-fetch';

// Mocking fetch
jest.mock('cross-fetch', () => {
  return jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'email-123', status: 'sent' }),
      text: () => Promise.resolve('Success'),
      headers: {
        get: jest.fn((name) => (name === 'content-type' ? 'application/json' : null)),
      },
    })
  );
});

describe('SmashSend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw an error when API key is not provided', () => {
      // @ts-expect-error - Testing invalid constructor arguments
      expect(() => new SmashSend()).toThrow('API key is required');
    });

    it('should initialize with default options', () => {
      const client = new SmashSend('test-api-key');
      expect(client).toBeInstanceOf(SmashSend);
    });

    it('should initialize with custom options', async () => {
      const client = new SmashSend('test-api-key', {
        baseUrl: 'https://custom-api.smashsend.com',
        maxRetries: 5,
        timeout: 60000,
        apiVersion: 'v2',
      });

      expect(client).toBeInstanceOf(SmashSend);

      // Perform a test request
      await client.emails.transactional.list();

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

  describe('setDebugMode', () => {
    it('should enable debug mode', () => {
      const client = new SmashSend('test-api-key');
      const result = client.setDebugMode(true);

      expect(result).toBe(client); // For chaining
    });
  });

  describe('setHeaders', () => {
    it('should set custom headers', async () => {
      const client = new SmashSend('test-api-key');

      client.setHeaders({
        'X-Custom-Header': 'custom-value',
        'X-Tracking-ID': 'tracking-123',
      });

      await client.emails.transactional.list();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
            'X-Tracking-ID': 'tracking-123',
          }),
        })
      );
    });
  });

  describe('setHeader', () => {
    it('should set a single custom header', async () => {
      const client = new SmashSend('test-api-key');

      client.setHeader('X-Single-Header', 'single-value');

      await client.emails.transactional.list();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Single-Header': 'single-value',
          }),
        })
      );
    });
  });

  describe('setApiVersion', () => {
    it('should set the API version', async () => {
      const client = new SmashSend('test-api-key');

      client.setApiVersion('v3');

      await client.emails.transactional.list();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/v3/'), expect.any(Object));
    });
  });
});
