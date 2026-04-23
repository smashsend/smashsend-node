import { SmashSend } from '../index';
import { HttpClient } from '../utils/http-client';

jest.mock('../utils/http-client');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('Groups API', () => {
  let smashsend: SmashSend;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    smashsend = new SmashSend('test-api-key');
    mockHttpClient = MockedHttpClient.mock.instances[0] as jest.Mocked<HttpClient>;
  });

  describe('create() method', () => {
    it('should create a group with publicId only', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_123',
          createdAt: '2024-01-15T10:30:00Z',
          workspaceId: 'wks_456',
        },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.create({
        publicId: 'company_123',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/groups', {
        publicId: 'company_123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should create a group with displayName and traits', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_456',
          displayName: 'Acme Corp',
          traits: {
            industry: 'technology',
            employees: 500,
          },
          createdAt: '2024-01-15T10:30:00Z',
          workspaceId: 'wks_456',
        },
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const createData = {
        publicId: 'company_456',
        displayName: 'Acme Corp',
        traits: {
          industry: 'technology',
          employees: 500,
        },
      };

      const result = await smashsend.groups.create(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/groups', createData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list() method', () => {
    it('should list groups without parameters', async () => {
      const mockResponse = {
        cursor: null,
        hasMore: false,
        items: [
          {
            id: 'grp_123',
            publicId: 'company_123',
            displayName: 'Acme Corp',
            createdAt: '2024-01-15T10:30:00Z',
            workspaceId: 'wks_456',
          },
          {
            id: 'grp_456',
            publicId: 'company_456',
            displayName: 'Beta Inc',
            createdAt: '2024-01-16T10:30:00Z',
            workspaceId: 'wks_456',
          },
        ],
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.list();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/groups', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should list groups with pagination parameters', async () => {
      const mockResponse = {
        cursor: 'next_cursor_123',
        hasMore: true,
        items: [
          {
            id: 'grp_123',
            publicId: 'company_123',
            displayName: 'Acme Corp',
            createdAt: '2024-01-15T10:30:00Z',
            workspaceId: 'wks_456',
          },
        ],
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.list({ limit: 10, cursor: 'prev_cursor' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/groups', {
        params: { limit: 10, cursor: 'prev_cursor' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get() method', () => {
    it('should get a group by ID', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_123',
          displayName: 'Acme Corp',
          traits: { industry: 'technology' },
          createdAt: '2024-01-15T10:30:00Z',
          workspaceId: 'wks_456',
        },
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.get('grp_123abc');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/groups/grp_123abc');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update() method', () => {
    it('should update a group displayName', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_123',
          displayName: 'Acme Corporation',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T15:00:00Z',
          workspaceId: 'wks_456',
        },
      };

      mockHttpClient.patch.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.update('grp_123abc', {
        displayName: 'Acme Corporation',
      });

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/groups/grp_123abc', {
        displayName: 'Acme Corporation',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should update a group traits', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_123',
          displayName: 'Acme Corp',
          traits: { employees: 600, revenue: '10M' },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T15:00:00Z',
          workspaceId: 'wks_456',
        },
      };

      mockHttpClient.patch.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.update('grp_123abc', {
        traits: { employees: 600, revenue: '10M' },
      });

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/groups/grp_123abc', {
        traits: { employees: 600, revenue: '10M' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete() method', () => {
    it('should delete a group', async () => {
      const mockResponse = {
        group: {
          id: 'grp_123abc',
          publicId: 'company_123',
          displayName: 'Acme Corp',
          createdAt: '2024-01-15T10:30:00Z',
          workspaceId: 'wks_456',
        },
        isDeleted: true,
      };

      mockHttpClient.delete.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.delete('grp_123abc');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/groups/grp_123abc');
      expect(result).toEqual(mockResponse);
      expect(result.isDeleted).toBe(true);
    });
  });

  describe('addContact() method', () => {
    it('should add a contact to a group', async () => {
      const mockResponse = {
        groupId: 'grp_123abc',
        contactId: 'ctc_456def',
        addedAt: '2024-01-20T15:00:00Z',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.addContact('grp_123abc', 'ctc_456def');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/groups/grp_123abc/contacts', {
        contactId: 'ctc_456def',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeContact() method', () => {
    it('should remove a contact from a group', async () => {
      const mockResponse = {
        groupId: 'grp_123abc',
        contactId: 'ctc_456def',
        isRemoved: true,
      };

      mockHttpClient.delete.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.removeContact('grp_123abc', 'ctc_456def');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/groups/grp_123abc/contacts/ctc_456def');
      expect(result).toEqual(mockResponse);
      expect(result.isRemoved).toBe(true);
    });
  });

  describe('listContacts() method', () => {
    it('should list contacts in a group without parameters', async () => {
      const mockResponse = {
        cursor: null,
        hasMore: false,
        items: [
          { contactId: 'ctc_123', addedAt: '2024-01-15T10:30:00Z' },
          { contactId: 'ctc_456', addedAt: '2024-01-16T10:30:00Z' },
        ],
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.listContacts('grp_123abc');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/groups/grp_123abc/contacts', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should list contacts in a group with pagination', async () => {
      const mockResponse = {
        cursor: 'next_cursor_456',
        hasMore: true,
        items: [{ contactId: 'ctc_789', addedAt: '2024-01-17T10:30:00Z' }],
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await smashsend.groups.listContacts('grp_123abc', {
        limit: 5,
        cursor: 'prev_cursor',
      });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/groups/grp_123abc/contacts', {
        params: { limit: 5, cursor: 'prev_cursor' },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});

