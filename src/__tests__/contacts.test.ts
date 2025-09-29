import { SmashSend } from '../index';
import fetch from 'cross-fetch';

// Mocking fetch
jest.mock('cross-fetch', () => {
  return jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        contact: { 
          id: 'contact-123', 
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        },
        isDeleted: true 
      }),
      text: () => Promise.resolve('Success'),
      headers: {
        get: jest.fn((name) => (name === 'content-type' ? 'application/json' : null)),
      },
    })
  );
});

describe('SmashSend Contacts', () => {
  let client: SmashSend;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new SmashSend('test-api-key');
  });

  describe('delete', () => {
    it('should delete a contact by ID', async () => {
      const result = await client.contacts.delete('contact-123');
      
      expect(result).toEqual({
        contact: { 
          id: 'contact-123', 
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        },
        isDeleted: true 
      });
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/contacts/contact-123'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('deleteByEmail', () => {
    it('should delete a contact by email address', async () => {
      const result = await client.contacts.deleteByEmail('test@example.com');
      
      expect(result).toEqual({
        contact: { 
          id: 'contact-123', 
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        },
        isDeleted: true 
      });
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/contacts/by-email/test%40example.com'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should properly encode email addresses with special characters', async () => {
      await client.contacts.deleteByEmail('user+test@example.com');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/contacts/by-email/user%2Btest%40example.com'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
