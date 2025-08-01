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

  describe('transactional.list', () => {
    it('should call get with correct parameters', async () => {
      // Setup mock response
      const mockResponse = {
        cursor: null,
        hasMore: false,
        items: [
          {
            id: 'trans-id-1',
            name: 'welcome-email',
            displayName: 'Welcome Email',
            subject: 'Welcome to our platform!',
            status: 'ACTIVE',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            id: 'trans-id-2',
            name: 'thank-you-email',
            displayName: 'Thank You Email',
            subject: 'Thank you for your purchase!',
            status: 'ACTIVE',
            createdAt: '2023-01-02T00:00:00Z',
            updatedAt: '2023-01-02T00:00:00Z',
          },
        ],
      };

      // Setup the mock (wrap in { transactional: ... } structure)
      mockHttpClient.get.mockResolvedValueOnce({ transactional: mockResponse });

      // Call the method
      const result = await emails.transactional.list({
        limit: 10,
        status: 'ACTIVE',
      });

      // Assertions
      expect(mockHttpClient.get).toHaveBeenCalledWith('/transactional', {
        params: {
          limit: 10,
          status: 'ACTIVE',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('transactional.get', () => {
    it('should call get with correct parameters', async () => {
      // Setup mock response
      const mockResponse = {
        id: 'template-1',
        name: 'welcome-email',
        displayName: 'Welcome Email',
        subject: 'Welcome!',
        status: 'ACTIVE',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        variables: { firstName: { id: 'var-1', defaultValue: '' } },
        fromEmail: 'noreply@example.com',
        fromName: 'Example Team',
        previewText: 'Welcome to our platform!',
      };

      // Setup the mock (wrap in { transactional: ... } structure)
      mockHttpClient.get.mockResolvedValueOnce({ transactional: mockResponse });

      // Call the method
      const result = await emails.transactional.get('template-1');

      // Assertions
      expect(mockHttpClient.get).toHaveBeenCalledWith('/transactional/template-1');
      expect(result).toEqual(mockResponse);
    });
  });
});
