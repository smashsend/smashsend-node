import { SmashSend } from '../index';
import { HttpClient } from '../utils/http-client';

// Mock the HttpClient
jest.mock('../utils/http-client');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('Events API', () => {
  let smashsend: SmashSend;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a new SmashSend instance
    smashsend = new SmashSend('test-api-key');
    
    // Get the mocked http client instance
    mockHttpClient = MockedHttpClient.mock.instances[0] as jest.Mocked<HttpClient>;
  });

  describe('send() method', () => {
    it('should send a single event successfully', async () => {
      const mockResponse = {
        success: true,
        messageId: 'msg_123',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const eventPayload = {
        event: 'user.signup',
        identify: {
          email: 'user@example.com',
          traits: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        properties: {
          plan: 'premium',
          source: 'website',
        },
      };

      const result = await smashsend.events.send(eventPayload);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/events',
        eventPayload,
        { headers: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send event with options', async () => {
      const mockResponse = {
        success: true,
        messageId: 'msg_456',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const eventPayload = {
        event: 'purchase.completed',
        identify: { email: 'user@example.com' },
        properties: { orderId: 'order_123' },
      };

      const options = {
        headers: { 'X-Custom': 'header' },
        timeout: 5000,
      };

      await smashsend.events.send(eventPayload, options);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/events',
        eventPayload,
        { headers: { 'X-Custom': 'header' }, timeout: 5000 }
      );
    });
  });

  describe('sendBatch() method', () => {
    it('should send multiple events successfully', async () => {
      const mockResponse = {
        accepted: 2,
        failed: 0,
        duplicated: 0,
        events: [
          { index: 0, messageId: 'msg_123', status: 'accepted' as const },
          { index: 1, messageId: 'msg_456', status: 'accepted' as const },
        ],
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const events = [
        {
          event: 'page.view',
          identify: { email: 'user1@example.com' },
          properties: { page: '/home' },
        },
        {
          event: 'button.click',
          identify: { email: 'user2@example.com' },
          properties: { button: 'signup' },
        },
      ];

      const result = await smashsend.events.sendBatch(events);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/events/batch',
        { events },
        { headers: {} }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
