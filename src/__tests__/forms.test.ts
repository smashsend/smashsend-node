import { SmashSend } from '../index';
import { SmashsendCountryCode } from '../interfaces/types';
import { HttpClient } from '../utils/http-client';

// Mock the HttpClient
jest.mock('../utils/http-client');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('Forms API', () => {
  let smashsend: SmashSend;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    smashsend = new SmashSend('test-api-key');
    mockHttpClient = MockedHttpClient.mock.instances[0] as jest.Mocked<HttpClient>;
  });

  describe('getByPublicKey()', () => {
    it('fetches a published form by public key', async () => {
      const mockResponse = {
        form: {
          id: 'frm_123',
          displayName: 'Waitlist',
          publicKey: 'pk_abc',
          status: 'PUBLISHED',
          config: { version: 1, fields: [] },
        },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.getByPublicKey('pk_abc');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/forms/pk_abc', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('passes the password for protected forms', async () => {
      mockHttpClient.get.mockResolvedValue({ form: {} });

      await smashsend.forms.getByPublicKey('pk_abc', { password: 'hunter2' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/forms/pk_abc', {
        params: { password: 'hunter2' },
      });
    });
  });

  describe('submit()', () => {
    it('submits a response', async () => {
      const mockResponse = {
        success: true,
        entry: { id: 'fen_1', publicId: 'pub_1', status: 'CONFIRMED' },
      };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.submit('pk_abc', {
        email: 'jane@example.com',
        answers: { firstName: 'Jane' },
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/forms/pk_abc/submit', {
        email: 'jane@example.com',
        answers: { firstName: 'Jane' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('forwards an explicit country code for server-side submissions', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true, entry: {} });

      await smashsend.forms.submit('pk_abc', {
        email: 'jane@example.com',
        countryCode: SmashsendCountryCode.ES,
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/forms/pk_abc/submit', {
        email: 'jane@example.com',
        countryCode: 'ES',
      });
    });

    it('forwards the referral code so the sharer gets credited', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true, entry: {} });

      await smashsend.forms.submit('pk_abc', {
        email: 'jane@example.com',
        referralCode: 'ref_xyz',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/forms/pk_abc/submit', {
        email: 'jane@example.com',
        referralCode: 'ref_xyz',
      });
    });
  });

  describe('getReferralStatus()', () => {
    it('reads a participant status by public id', async () => {
      const mockResponse = {
        referralStatus: {
          entryId: 'fen_1',
          status: 'CONFIRMED',
          referralCode: 'ref_xyz',
          shareUrl: 'https://smashsend.com/f/pk_abc?ref=ref_xyz',
          points: 30,
          referralCount: 3,
          position: 12,
          peopleAhead: 11,
          participantTotal: 400,
          tasks: [],
        },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.getReferralStatus('pk_abc', 'pub_1');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/forms/pk_abc/entries/pub_1/referral-status'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('completeTask()', () => {
    it('submits proof for a manual task', async () => {
      const mockResponse = {
        task: { taskId: 'task_1', status: 'PENDING', pointsAwarded: 0 },
      };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.completeTask('pk_abc', 'pub_1', 'task_1', {
        proof: { handle: '@jane' },
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/forms/pk_abc/entries/pub_1/tasks/task_1/complete',
        { proof: { handle: '@jane' } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('sends an empty body when a task needs no proof', async () => {
      mockHttpClient.post.mockResolvedValue({ task: {} });

      await smashsend.forms.completeTask('pk_abc', 'pub_1', 'task_1');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/forms/pk_abc/entries/pub_1/tasks/task_1/complete',
        {}
      );
    });
  });

  describe('sendStatusLink()', () => {
    it('emails a participant their personal link', async () => {
      mockHttpClient.post.mockResolvedValue({ sent: true });

      await smashsend.forms.sendStatusLink('pk_abc', 'jane@example.com');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/forms/pk_abc/status-link', {
        email: 'jane@example.com',
      });
    });
  });

  describe('getLeaderboard()', () => {
    it('reads the leaderboard with a limit', async () => {
      const mockResponse = {
        leaderboard: {
          items: [{ rank: 1, email: 'jane@example.com', points: 90, referralCount: 9 }],
        },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.getLeaderboard('frm_123', { limit: 25 });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/forms/frm_123/leaderboard', {
        params: { limit: 25 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getEntryPosition()', () => {
    it('looks a position up by entry id', async () => {
      const mockResponse = {
        position: { position: 12, points: 30, referralCount: 3, participantCount: 400 },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.getEntryPosition('frm_123', 'fen_1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/forms/frm_123/entries/fen_1/position');
      expect(result).toEqual(mockResponse);
    });

    it('url-encodes an email lookup', async () => {
      mockHttpClient.get.mockResolvedValue({ position: {} });

      await smashsend.forms.getEntryPosition('frm_123', 'jane+test@example.com');

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/forms/frm_123/entries/jane%2Btest%40example.com/position'
      );
    });
  });

  describe('listEntryRewards()', () => {
    it('lists the points ledger for an entry', async () => {
      const mockResponse = {
        rewards: {
          cursor: null,
          hasMore: false,
          items: [{ id: 'fep_1', type: 'REFERRAL', points: 10, status: 'APPROVED' }],
        },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.forms.listEntryRewards('frm_123', 'fen_1', {
        limit: 50,
      });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/forms/frm_123/entries/fen_1/rewards', {
        params: { limit: 50 },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
