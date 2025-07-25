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
      mockHttpClient.post.mockResolvedValueOnce({ email: mockResponse });

      // Call the method
      const result = await emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
        text: 'Hello World',
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
        text: 'Hello World',
        sendAt: undefined,
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

      // Setup the mock (wrap in { email: ... } structure)
      mockHttpClient.post.mockResolvedValueOnce({ email: mockResponse });

      // Call the method with complex email addresses
      const result = await emails.send({
        from: 'Sender Name <sender@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: 'Sender Name <sender@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should accept empty string HTML content', async () => {
      // Mock the HTTP client response
      const mockResponse = { id: 'email123', statusCode: 200 };
      mockHttpClient.post.mockResolvedValueOnce({ email: mockResponse });

      // Call the method with empty HTML
      const result = await emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Empty HTML Test',
        html: '',
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Empty HTML Test',
        html: '',
        sendAt: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when neither html nor react is provided', async () => {
      // Test with missing html/react
      await expect(
        emails.send({
          from: 'test@example.com',
          to: 'recipient@example.com',
          subject: 'Test',
        } as any)
      ).rejects.toThrow('Either "html" or "react" must be provided when calling emails.send');
    });

    it('should accept React element that renders to empty string', async () => {
      // Mock the HTTP client response
      const mockResponse = { id: 'email123', statusCode: 200 };
      mockHttpClient.post.mockResolvedValueOnce({ email: mockResponse });

      // Mock @react-email/render to return empty string
      jest.doMock('@react-email/render', () => ({
        renderAsync: jest.fn().mockResolvedValue(''),
      }));

      // Call the method with React element
      const result = await emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Empty React Test',
        react: { type: 'div', props: {}, key: null },
      });

      // Assertions
      expect(mockHttpClient.post).toHaveBeenCalledWith('/emails', {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Empty React Test',
        html: '',
        sendAt: undefined,
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

      // Setup the mock (wrap in { email: ... } structure)
      mockHttpClient.get.mockResolvedValueOnce({ email: mockResponse });

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

      // Setup the mock (wrap in { emails: ... } structure)
      mockHttpClient.get.mockResolvedValueOnce({ emails: mockResponse });

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
