# SMASHSEND Node.js SDK

The official Node.js SDK for the SMASHSEND API.

## Installation

```bash
npm install @smashsend/node

# or
yarn add @smashsend/node

# or
pnpm add @smashsend/node
```

## Usage

### Initialize the client

```typescript
import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend('your-api-key');
```

### Send an email

```typescript
const response = await smashsend.emails.send({
  from: 'you@example.com',
  to: 'recipient@example.com',
  subject: 'Hello from SMASHSEND',
  text: 'This is a test email from the SMASHSEND Node.js SDK.',
  html: '<p>This is a test email from the <strong>SMASHSEND Node.js SDK</strong>...</p>',
});
```

### Create a contact

```typescript
const contact = await smashsend.contacts.create({
  email: 'newcontact@example.com',
  firstName: 'John',
  lastName: 'Doe',
  custom: {
    company: 'SMASHSEND',
    role: 'Developer',
  },
});
```

## Advanced Configuration

### Custom Headers

You can add custom headers to all API requests:

```typescript
// Add multiple headers
smashsend.setHeaders({
  'X-Custom-Header': 'value',
  'X-Tracking-ID': 'campaign-123',
});

// Or add individual headers
smashsend.setHeader('X-Source', 'website');
```

### Debug Mode

Enable debug mode to log requests and responses:

```typescript
// Enable debug mode for detailed logging
smashsend.setDebugMode(true);

// The SDK will now output detailed logs of all API interactions
```

### Retry Configuration

The SDK automatically retries failed requests with exponential backoff:

```typescript
// Configure more aggressive retries
const smashsend = new SmashSend('your-api-key', {
  maxRetries: 5, // Default is 3
  timeout: 60000, // Default is 30000 (30 seconds)
});
```

## Error Handling

The SDK uses a custom error handling system to make it easier to handle errors:

```typescript
import { SmashSend, SmashSendError } from '@smashsend/node';

const smashsend = new SmashSend('your-api-key');

try {
  const response = await smashsend.emails.send({
    // email details
  });
} catch (error) {
  if (error instanceof SmashSendError) {
    console.error(`Error: ${error.message}`);
    console.error(`Status: ${error.statusCode}`);
    console.error(`Request ID: ${error.requestId}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

This SDK is built with TypeScript and provides type definitions for all API resources.

## Documentation

For detailed documentation, visit [SMASHSEND API Documentation](https://smashsend.com/docs/api).

## License

MIT
