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

## Setup

First, you need to get an API key, which is available in the [SMASHSEND Dashboard](https://smashsend.com/).

```typescript
import { SmashSend } from '@smashsend/node';
const smashsend = new SmashSend('your-api-key');
```

## Usage

### Create or update a contact

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
smashsend.setDebugMode(true);
```

### Using with Next.js

This SDK is fully compatible with Next.js, supporting both client and server components, API routes, and server actions.

#### Server Component Example

```typescript
// app/contacts/page.tsx
import { getSmashSendClient } from '@/lib/smashsend';

export default async function ContactsPage() {
  const smashsend = getSmashSendClient();
  const contacts = await smashsend.contacts.list();

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### API Route Example

```typescript
// app/api/contact/route.ts
import { getSmashSendClient } from '@/lib/smashsend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const smashsend = getSmashSendClient();
    const contact = await smashsend.contacts.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
```

#### Server Action Example

```typescript
// app/actions.ts
'use server';

import { getSmashSendClient } from '@/lib/smashsend';

export async function createContact(data: FormData) {
  try {
    const smashsend = getSmashSendClient();
    const contact = await smashsend.contacts.create({
      email: data.get('email') as string,
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
    });

    return { success: true, contact };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Helper Function

For easier usage in Next.js applications, create a utility file:

```typescript
// lib/smashsend.ts
import { SmashSend } from '@smashsend/node';

let smashsendClient: SmashSend;

export function getSmashSendClient(apiKey?: string) {
  if (!smashsendClient) {
    const key = apiKey || process.env.SMASHSEND_API_KEY;
    if (!key) {
      throw new Error('SMASHSEND_API_KEY is not defined');
    }
    smashsendClient = new SmashSend(key);
  }
  return smashsendClient;
}
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
