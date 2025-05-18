import { Emails } from '../api/emails';
import { HttpClient } from '../utils/http-client';

// Mock HttpClient
jest.mock('../utils/http-client');

describe('Emails', () => {
  let emails: Emails;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // Create a mocked instance of HttpClient
    mockHttpClient = new HttpClient('test-api-key') as jest.Mocked<HttpClient>;
    emails = new Emails(mockHttpClient);
  });

  describe('send', () => {
    it('should call post with correct parameters', async () => {
      // Setup mock response
      const mockResponse = {
        id: 'email-id',
        from: 'test@example.com',
        to: ['recipient@example.com'],
        created: '2023-01-01T00:00:00Z',
        statusCode: 200,
        message: 'Email sent successfully',
      };

      // Setup the mock
      mockHttpClient.post.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'Hello World',
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: 'test@example.com',
        to: ['recipient@example.com'],
        subject: 'Test Email',
        text: 'Hello World',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex email addresses', async () => {
      // Setup mock response
      const mockResponse = {
        id: 'email-id',
        from: 'sender@example.com',
        to: ['recipient@example.com'],
        created: '2023-01-01T00:00:00Z',
        statusCode: 200,
        message: 'Email sent successfully',
      };

      // Setup the mock
      mockHttpClient.post.mockResolvedValueOnce(mockResponse);

      // Call the method with complex email addresses
      const result = await emails.send({
        from: { email: 'sender@example.com', name: 'Sender Name' },
        to: [{ email: 'recipient@example.com', name: 'Recipient Name' }, 'another@example.com'],
        cc: { email: 'cc@example.com', name: 'CC Name' },
        bcc: ['bcc1@example.com', 'bcc2@example.com'],
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: { email: 'sender@example.com', name: 'Sender Name' },
        to: [{ email: 'recipient@example.com', name: 'Recipient Name' }, 'another@example.com'],
        cc: [{ email: 'cc@example.com', name: 'CC Name' }],
        bcc: ['bcc1@example.com', 'bcc2@example.com'],
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get', () => {
    it('should call get with correct parameters', async () => {
      // Setup mock response
      const mockResponse = {
        id: 'email-id',
        from: 'test@example.com',
        to: ['recipient@example.com'],
        created: '2023-01-01T00:00:00Z',
        statusCode: 200,
        message: 'Email sent successfully',
      };

      // Setup the mock
      mockHttpClient.get.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await emails.get('email-id');

      // Assertions
      expect(mockHttpClient.get).toHaveBeenCalledWith('/emails/email-id');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list', () => {
    it('should call get with correct parameters', async () => {
      // Setup mock response
      const mockResponse = {
        data: [
          {
            id: 'email-id-1',
            from: 'test@example.com',
            to: ['recipient1@example.com'],
            created: '2023-01-01T00:00:00Z',
            statusCode: 200,
            message: 'Email sent successfully',
          },
          {
            id: 'email-id-2',
            from: 'test@example.com',
            to: ['recipient2@example.com'],
            created: '2023-01-02T00:00:00Z',
            statusCode: 200,
            message: 'Email sent successfully',
          },
        ],
        total: 2,
        limit: 10,
        offset: 0,
      };

      // Setup the mock
      mockHttpClient.get.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await emails.list({
        limit: 10,
        offset: 0,
        from: 'test@example.com',
      });

      // Assertions
      expect(mockHttpClient.get).toHaveBeenCalledWith('/emails', {
        params: {
          limit: 10,
          offset: 0,
          from: 'test@example.com',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
