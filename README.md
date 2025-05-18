# SMASHSEND Node.js SDK

[![npm version](https://img.shields.io/npm/v/@smashsend/node.svg)](https://www.npmjs.com/package/@smashsend/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Node.js CI](https://github.com/smashsend/smashsend-node/actions/workflows/ci.yml/badge.svg)](https://github.com/smashsend/smashsend-node/actions/workflows/ci.yml)

The official Node.js SDK for the SMASHSEND API - a powerful, developer-friendly email service for transactional emails, marketing campaigns, and contact management.

## Features

- 📧 **Email Sending** - Send transactional emails with attachments and tracking
- 👥 **Contact Management** - Create and manage contacts with custom fields
- 📊 **Campaign Management** - Build, send, and track email campaigns
- 🔔 **Webhooks** - Set up real-time notifications for email events
- 🔄 **Automatic Retries** - Built-in exponential backoff for reliability
- 🔍 **Debug Mode** - Detailed logging for easy troubleshooting
- 📝 **TypeScript Support** - Full TypeScript definitions for improved developer experience

## Installation

```bash
npm install @smashsend/node

# or
yarn add @smashsend/node

# or
pnpm add @smashsend/node
```

## Quick Start

```typescript
import { SMASHSEND } from '@smashsend/node';

// Initialize the client
const smashsend = new SMASHSEND('your-api-key');

// Send an email
async function sendEmail() {
  try {
    const response = await smashsend.emails.send({
      from: 'you@example.com',
      to: 'recipient@example.com',
      subject: 'Hello from SMASHSEND',
      text: 'This is a test email from the SMASHSEND Node.js SDK.',
      html: '<p>This is a test email from the <strong>SMASHSEND Node.js SDK</strong>.</p>',
    });

    console.log(`Email sent successfully with ID: ${response.id}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

sendEmail();
```

## API Reference

### Initialization

```typescript
import { SMASHSEND } from '@smashsend/node';

// Basic initialization
const smashsend = new SMASHSEND('your-api-key');

// Advanced configuration
const smashsend = new SMASHSEND('your-api-key', {
  baseUrl: 'https://api.smashsend.com', // Custom API URL if needed
  maxRetries: 5, // Number of retry attempts (default: 3)
  timeout: 60000, // Request timeout in ms (default: 30000)
});
```

### Emails API

```typescript
// Send a simple email
await smashsend.emails.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello',
  text: 'Plain text content',
  html: '<p>HTML content</p>',
});

// Send with detailed options
await smashsend.emails.send({
  from: {
    email: 'sender@example.com',
    name: 'Sender Name',
  },
  to: [
    {
      email: 'recipient1@example.com',
      name: 'Recipient One',
    },
    'recipient2@example.com',
  ],
  cc: ['cc@example.com'],
  bcc: ['bcc@example.com'],
  subject: 'Hello from SMASHSEND',
  text: 'Plain text version',
  html: '<p>HTML version</p>',
  attachments: [
    {
      filename: 'document.pdf',
      content: 'base64encodedcontent...',
      contentType: 'application/pdf',
    },
  ],
  tags: ['welcome', 'onboarding'],
  metadata: {
    userId: '123',
    campaignId: '456',
  },
  trackOpens: true,
  trackClicks: true,
  scheduleFor: '2023-12-25T12:00:00Z',
});

// Get email by ID
const email = await smashsend.emails.get('email-id-123');

// List emails with filters
const emails = await smashsend.emails.list({
  limit: 25,
  offset: 0,
  status: 'delivered',
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Welcome',
  tags: ['welcome'],
  startDate: '2023-01-01T00:00:00Z',
  endDate: '2023-12-31T23:59:59Z',
});
```

### Contacts API

```typescript
// Create a contact
const contact = await smashsend.contacts.create({
  email: 'contact@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  custom: {
    company: 'SMASHSEND',
    plan: 'premium',
  },
});

// Update a contact
await smashsend.contacts.update('contact-id-123', {
  firstName: 'Jane',
  custom: {
    plan: 'enterprise',
  },
});

// Get contact by ID
const contact = await smashsend.contacts.get('contact-id-123');

// List contacts with filters
const contacts = await smashsend.contacts.list({
  limit: 100,
  offset: 0,
  email: 'example.com', // Search by domain
  tags: ['customer'],
});

// Delete a contact
await smashsend.contacts.delete('contact-id-123');
```

### Error Handling

The SDK provides detailed error handling:

```typescript
import { SMASHSEND, SMASHSENDError, RateLimitError } from '@smashsend/node';

const smashsend = new SMASHSEND('your-api-key');

try {
  const response = await smashsend.emails.send({
    // email details
  });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter);
  } else if (error instanceof SMASHSENDError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status Code: ${error.statusCode}`);
    console.error(`Error Code: ${error.code}`);
    console.error(`Request ID: ${error.requestId}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Advanced Configuration

### Custom Headers

```typescript
// Add custom headers to all API requests
smashsend.setHeaders({
  'X-Custom-Header': 'value',
  'X-Tracking-ID': 'campaign-123',
});

// Add individual header
smashsend.setHeader('X-Source', 'website');
```

### Debug Mode

```typescript
// Enable debug mode for detailed logging
smashsend.setDebugMode(true);

// The SDK will now output detailed logs of all API interactions
```

## Examples

See the [examples](https://github.com/smashsend/smashsend-node/tree/main/examples) directory for more detailed examples.

## TypeScript Support

This SDK is built with TypeScript and provides comprehensive type definitions for all API resources, making it easy to integrate with TypeScript projects.

## Documentation

For detailed API documentation, visit [SMASHSEND API Documentation](https://smashsend.com/docs/api).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
