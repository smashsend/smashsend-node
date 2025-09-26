import { safeToISOString } from '../utils/date-utils';

describe('safeToISOString', () => {
  describe('Valid inputs', () => {
    it('should handle valid Date objects', () => {
      const date = new Date('2024-01-15T12:34:56.789Z');
      const result = safeToISOString(date);
      expect(result).toBe('2024-01-15T12:34:56.789Z');
    });

    it('should handle valid ISO date strings', () => {
      const isoString = '2024-01-15T12:34:56.789Z';
      const result = safeToISOString(isoString);
      expect(result).toBe(isoString);
    });

    it('should handle valid date strings in different formats', () => {
      const dateFormats = [
        '2024-01-15',
        '01/15/2024',
        'January 15, 2024',
        '2024-01-15 12:34:56'
      ];

      dateFormats.forEach((dateString) => {
        const result = safeToISOString(dateString);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });

    it('should handle numeric timestamps', () => {
      const timestamp = 1705327496789; // Unix timestamp in milliseconds
      const result = safeToISOString(timestamp);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle Date.now()', () => {
      const now = Date.now();
      const result = safeToISOString(now);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Invalid inputs', () => {
    it('should return undefined for null', () => {
      expect(safeToISOString(null)).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      expect(safeToISOString(undefined)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(safeToISOString('')).toBeUndefined();
    });

    it('should return undefined for invalid date strings', () => {
      const invalidDates = [
        'not-a-date',
        'invalid-date-string',
        'abc123',
        'definitely not a date',
        'random text'
      ];

      invalidDates.forEach((invalidDate) => {
        const result = safeToISOString(invalidDate);
        expect(result).toBeUndefined();
      });
    });

    it('should return undefined for invalid Date objects', () => {
      const invalidDate = new Date('invalid-date');
      const result = safeToISOString(invalidDate);
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-date objects', () => {
      const nonDateInputs = [
        { not: 'a date' },
        ['array', 'of', 'strings'],
        true,
        false,
        Symbol('test')
      ];

      nonDateInputs.forEach((input) => {
        const result = safeToISOString(input);
        expect(result).toBeUndefined();
      });
    });

    it('should return undefined for NaN', () => {
      expect(safeToISOString(NaN)).toBeUndefined();
    });

    it('should return undefined for Infinity', () => {
      expect(safeToISOString(Infinity)).toBeUndefined();
      expect(safeToISOString(-Infinity)).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle zero timestamp', () => {
      const result = safeToISOString(0);
      expect(result).toBe('1970-01-01T00:00:00.000Z');
    });

    it('should handle negative timestamps', () => {
      const negativeTimestamp = -86400000; // One day before epoch
      const result = safeToISOString(negativeTimestamp);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle whitespace-only strings', () => {
      const whitespaceStrings = ['   ', '\t', '\n', '\r\n', '  \t  \n  '];
      whitespaceStrings.forEach((str) => {
        const result = safeToISOString(str);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical API input scenarios', () => {
      const apiInputs = [
        new Date('2024-01-15T12:34:56.789Z'),
        '2024-01-15T12:34:56.789Z',
        '2024-01-15',
        1705327496789,
        Date.now()
      ];

      apiInputs.forEach((input) => {
        const result = safeToISOString(input);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });

    it('should gracefully handle user input errors', () => {
      const problematicInputs = [
        'not a date',
        'yesterday',
        undefined,
        null,
        '',
        {}
      ];

      problematicInputs.forEach((input) => {
        expect(() => safeToISOString(input)).not.toThrow();
        const result = safeToISOString(input);
        expect(result === undefined || typeof result === 'string').toBe(true);
      });
    });
  });
});
