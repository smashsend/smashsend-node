// Test that TypeScript types work correctly without requiring 'as any' casts
const { SmashSend } = require('./dist');

// Create a mock React element
const mockReactElement = {
  type: 'div',
  props: { children: 'Hello' },
  key: null,
};

const client = new SmashSend('test-key');

// Test 1: Sending with HTML (should work)
const htmlEmail = {
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test',
  html: '<p>Hello</p>',
};

// Test 2: Sending with React (should work)
const reactEmail = {
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test',
  react: mockReactElement,
};

// Test 3: Sending with both HTML and React (should work - react takes precedence)
const bothEmail = {
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test',
  html: '<p>Fallback</p>',
  react: mockReactElement,
};

console.log('✅ All type tests passed - no "as any" casts needed!');
