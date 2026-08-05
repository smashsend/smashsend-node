import { SmashSend } from '../index';
import { HttpClient } from '../utils/http-client';

jest.mock('../utils/http-client');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('Broadcasts API', () => {
  let smashsend: SmashSend;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const broadcast = {
    id: 'bcs_123',
    subject: 'Weekly newsletter',
    status: 'DRAFT',
    createdAt: '2026-08-01T10:12:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    smashsend = new SmashSend('test-api-key');
    mockHttpClient = MockedHttpClient.mock.instances[0] as jest.Mocked<HttpClient>;
  });

  describe('create() method', () => {
    it('should create a draft broadcast', async () => {
      mockHttpClient.post.mockResolvedValue({ broadcast });

      const payload = {
        subject: 'Weekly newsletter',
        fromEmail: 'news@yourdomain.com',
        html: '<html><body><h1>Hi</h1></body></html>',
        audience: { all: true },
      };

      const result = await smashsend.broadcasts.create(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/broadcasts', payload);
      expect(result.broadcast.id).toBe('bcs_123');
    });
  });

  describe('list() method', () => {
    it('should list broadcasts with params', async () => {
      mockHttpClient.get.mockResolvedValue({
        broadcasts: { cursor: null, hasMore: false, items: [broadcast] },
      });

      const result = await smashsend.broadcasts.list({ limit: 10 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/broadcasts', {
        params: { limit: 10 },
      });
      expect(result.broadcasts.items).toHaveLength(1);
    });
  });

  describe('get() method', () => {
    it('should fetch a single broadcast', async () => {
      mockHttpClient.get.mockResolvedValue({ broadcast });

      await smashsend.broadcasts.get('bcs_123');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/broadcasts/bcs_123');
    });
  });

  describe('schedule() method', () => {
    it('should schedule a broadcast with sendAt', async () => {
      mockHttpClient.post.mockResolvedValue({ broadcast });

      await smashsend.broadcasts.schedule('bcs_123', {
        sendAt: '2026-08-10T09:00:00.000Z',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/broadcasts/bcs_123/schedule',
        { sendAt: '2026-08-10T09:00:00.000Z' }
      );
    });

    it('should post an empty body when no options are given', async () => {
      mockHttpClient.post.mockResolvedValue({ broadcast });

      await smashsend.broadcasts.schedule('bcs_123');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/broadcasts/bcs_123/schedule',
        {}
      );
    });
  });

  describe('cancel() method', () => {
    it('should cancel a scheduled broadcast', async () => {
      mockHttpClient.post.mockResolvedValue({ broadcast });

      await smashsend.broadcasts.cancel('bcs_123');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/broadcasts/bcs_123/cancel',
        {}
      );
    });
  });

  describe('sendTest() method', () => {
    it('should send a test broadcast', async () => {
      mockHttpClient.post.mockResolvedValue({ broadcast });

      await smashsend.broadcasts.sendTest('bcs_123', {
        emails: ['you@yourcompany.com'],
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/broadcasts/bcs_123/test',
        { emails: ['you@yourcompany.com'] }
      );
    });
  });
});
