<p align="center">
  <img src="https://smashsend.com/brand/smashsend_logo.svg" alt="SMASHSEND" width="300" />
</p>

<p align="center">
  <b>Official TypeScript / Node.js SDK for <a href="https://smashsend.com">SMASHSEND</a></b><br/>
  Easily integrate email marketing, transactional emails, automations, and contact management into your app.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@smashsend/node">
    <img src="https://img.shields.io/npm/v/@smashsend/node.svg?style=flat-square" alt="NPM Version" />
  </a>
<!--   <a href="https://github.com/smashsend/smashsend-node/actions/workflows/ci.yml">
    <img src="https://github.com/smashsend/smashsend-node/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a> -->
  <a href="https://github.com/smashsend/smashsend-node/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/smashsend/smashsend-node.svg?style=flat-square" alt="License" />
  </a>
</p>

# SMASHSEND Node.js SDK

## What is SMASHSEND?

**SMASHSEND** is a bold, modern email platform built for **business owners, creators, and startups** — not just marketers.

- ⚡️ Drag-and-drop email builder
- 🪄 AI-powered personalization ("Magic Boxes")
- 🤖 Automations & event triggers
- 🚀 High-deliverability transactional email API
- 🗂️ Lightweight CRM & contact management
- 📈 Deep analytics & link tracking

→ [Explore more](https://smashsend.com)

## Installation

```bash
npm install @smashsend/node       # or yarn add @smashsend/node / pnpm add @smashsend/node
```

## Getting an API Key

1. Log in to your [SMASHSEND Dashboard](https://smashsend.com/signup)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Give your key a descriptive name (e.g., "Production Server", "Development")
5. Copy the key immediately — it won't be shown again!

```typescript
import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);
```

> **Security tip:** Never commit API keys to version control. Use environment variables or a secrets manager.

## Create or update a contact

```typescript
import { SmashSend, SmashsendContactStatus, SmashsendCountryCode } from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);

const contact = await smashsend.contacts.create({
  email: 'newcontact@example.com', // required
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  status: SmashsendContactStatus.SUBSCRIBED, // defaults to SUBSCRIBED
  countryCode: SmashsendCountryCode.US,
  customProperties: {}, // define in dashboard first
});

console.log(contact.id); // contact UUID
console.log(contact.properties.email); // newcontact@example.com
```

## Batch Contact Creation

Create multiple contacts efficiently in a single API call:

```typescript
const result = await smashsend.contacts.createBatch([
  { email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
  { email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' },
  { email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson' }
], {
  allowPartialSuccess: true,    // Create valid contacts even if some fail
  includeFailedContacts: true   // Include failed contacts in response
});

console.log(`Created: ${result.summary.created}, Failed: ${result.summary.failed}`);

// Handle failures and retry if needed
if (result.failedContacts?.length > 0) {
  const retryableContacts = result.failedContacts
    .filter(fc => fc.errors.some(e => e.retryable))
    .map(fc => fc.contact);
  
  if (retryableContacts.length > 0) {
    await smashsend.contacts.createBatch(retryableContacts);
  }
}
```

### ⚠️ Data Migration with Custom Creation Dates

**WARNING: Use this feature ONLY for one-time data migrations from legacy systems. Regular use will corrupt your analytics and reporting.**

When migrating contacts from another system (like Jungle), you can preserve their original creation timestamps:

```typescript
// ⚠️ MIGRATION USE ONLY - Preserve historical creation dates
const legacyContacts = [
  { 
    email: 'user@legacy-system.com', 
    firstName: 'John',
    createdAt: new Date('2023-01-15T10:30:00Z') // Historical date from legacy system
  }
];

await smashsend.contacts.createBatch(legacyContacts, { 
  overrideCreatedAt: true // 🚨 ONLY for data migration!
});
```

**When to use `overrideCreatedAt: true`:**
- ✅ One-time migration from legacy systems
- ✅ Preserving historical data during platform switches
- ✅ Maintaining accurate customer lifecycle analytics

**When NOT to use `overrideCreatedAt: true`:**
- ❌ Regular contact creation
- ❌ Ongoing API integrations
- ❌ Any production workflows

## Send email (basic example)

The simplest way to send a transactional email is with raw HTML:

```typescript
const response = await smashsend.emails.send({
  from: 'notifications@yourdomain.com',
  to: 'recipient@example.com',
  subject: 'Your order has shipped!',
  html: `
    <h1>Great news!</h1>
    <p>Your order #12345 has shipped and is on its way.</p>
    <a href="https://track.example.com/12345">Track your package</a>
  `,
  text: 'Your order #12345 has shipped. Track at: https://track.example.com/12345',
  groupBy: 'order-shipped', // Group analytics by email type
  settings: {
    trackClicks: true,
    trackOpens: true,
  },
});
```

> **📊 Analytics tip:** Use the `groupBy` parameter to group similar emails together in your analytics dashboard. This helps you track performance across all "order shipped" emails, regardless of individual recipients.

## Send email with template _(recommended)_

For better maintainability and design flexibility, use templates — the **recommended approach** for transactional emails.

**Why use templates?**

- 🎨 Design beautiful emails in the SMASHSEND visual editor
- 🔄 Update email content without deploying code
- 📊 Built-in analytics and tracking
- 🧪 A/B test different versions
- 👥 Non-technical team members can modify content
- 🌐 Automatic responsive design

**Creating a template:**

1. Go to Emails => **Transactional** in your dashboard
2. Click **Create Transactional**
3. Design your email using the drag-and-drop editor
4. Add variables (both template variables and contact variables)
5. Save with a memorable template ID (e.g., `welcome-email`, `order-confirmation`)

**Sending with a template:**

```typescript
const response = await smashsend.emails.sendWithTemplate({
  to: 'user@example.com',
  template: 'welcome-email', // Template ID from dashboard
  variables: {
    firstName: 'Sarah',
    companyName: 'Acme Corp',
    signupDate: new Date().toLocaleDateString(),
    // Any variables used in your template
  },
  settings: {
    trackClicks: true,
    trackOpens: true,
  },
});

console.log(response.messageId); // Unique ID for tracking
console.log(response.status); // SCHEDULED, SENT, etc.
```

## Reply-To Addresses

You can specify custom reply-to addresses for both raw and templated emails. This allows recipients to reply to different addresses than the sender.

**Single reply-to address:**

```typescript
await smashsend.emails.send({
  from: 'noreply@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Support Request Received',
  html: '<p>We received your support request and will respond soon.</p>',
  replyTo: 'support@yourdomain.com', // Single address
});
```

**Multiple reply-to addresses (max 5):**

```typescript
await smashsend.emails.send({
  from: 'noreply@yourdomain.com', 
  to: 'customer@example.com',
  subject: 'Welcome to our platform',
  html: '<p>Welcome! Contact us if you need help.</p>',
  replyTo: [
    'support@yourdomain.com',
    'sales@yourdomain.com',
    'billing@yourdomain.com'
  ], // Multiple addresses
});
```

**With templates:**

```typescript
await smashsend.emails.sendWithTemplate({
  template: 'welcome-email',
  to: 'user@example.com',
  variables: { firstName: 'John' },
  replyTo: ['support@yourdomain.com', 'welcome@yourdomain.com'], // Overrides template default
});
```

> **💡 Note:** Dynamic reply-to addresses override any reply-to settings configured in the template. If no dynamic reply-to is provided, the template's reply-to setting is used. Duplicate addresses are automatically removed.

## Send email with React

For developers using React, you can write emails as React components:

**First, install the React email renderer:**

```bash
npm install @react-email/render
```

**Create your email component:**

```tsx
// emails/OrderConfirmation.tsx
import * as React from 'react';

interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  items: Array<{ name: string; price: number }>;
}

export default function OrderConfirmation({
  customerName,
  orderNumber,
  items,
}: OrderConfirmationProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Thanks for your order, {customerName}!</h1>
      <p>Order #{orderNumber} has been confirmed.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: '10px 0' }}>{item.name}</td>
              <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid #333', fontWeight: 'bold' }}>
            <td style={{ padding: '10px 0' }}>Total</td>
            <td style={{ textAlign: 'right' }}>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

**Send the React email:**

```typescript
import OrderConfirmation from './emails/OrderConfirmation';

const response = await smashsend.emails.send({
  from: 'orders@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Order Confirmation',
  react: OrderConfirmation({
    customerName: 'John',
    orderNumber: '12345',
    items: [
      { name: 'T-Shirt', price: 29.99 },
      { name: 'Shipping', price: 5.0 },
    ],
  }),
  groupBy: 'order-confirmation',
});
```

## Advanced Configuration

**Custom Headers**

```typescript
// Add multiple headers
smashsend.setHeaders({
  'X-Custom-Header': 'value',
  'X-Tracking-ID': 'campaign-123',
});

// Or add an individual header
smashsend.setHeader('X-Source', 'website');
```

**Debug Mode**

```typescript
smashsend.setDebugMode(true); // logs all requests & responses
```

**Retry Configuration**

```typescript
const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!, {
  maxRetries: 5, // default 3
  timeout: 60000,
});
```

## Using with Next.js (Server-Side Only!)

> ⚠️ **SECURITY NOTE**: This SDK contains your secret API key and must **NEVER** be used in client-side code. Only use it in:
>
> - Server Components
> - API Routes
> - Server Actions
> - Middleware
>
> **Never import this SDK in client components or expose your API key to the browser!**

**Helper (Server-Side Only)**

```typescript
// lib/smashsend.ts
// ⚠️ This file should only be imported in server-side code!
import { SmashSend } from '@smashsend/node';

let client: SmashSend;

export function getSmashSendClient(apiKey?: string) {
  if (!client) {
    client = new SmashSend(apiKey ?? process.env.SMASHSEND_API_KEY!);
  }
  return client;
}
```

**Server Component Example**

```tsx
// app/contacts/page.tsx
// ✅ This is a Server Component - API key is safe here
import { getSmashSendClient } from '@/lib/smashsend';

export default async function ContactsPage() {
  const smashsend = getSmashSendClient();
  const { contacts } = await smashsend.contacts.list();

  return (
    <ul>
      {contacts.map((c) => (
        <li key={c.id}>
          {c.properties.firstName} ({c.properties.email})
        </li>
      ))}
    </ul>
  );
}
```

**API Route Example**

```typescript
// app/api/contact/route.ts
// ✅ API routes run on the server - API key is safe here
import { getSmashSendClient, SmashsendContactStatus, SmashsendCountryCode } from '@/lib/smashsend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const smashsend = getSmashSendClient();
    const contact = await smashsend.contacts.create({
      email: data.email,
      status: SmashsendContactStatus.SUBSCRIBED,
      countryCode: SmashsendCountryCode.US,
      customProperties: data.customFields,
    });
    return NextResponse.json({ success: true, contact });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
```

**❌ What NOT to do**

```tsx
// components/BadExample.tsx
'use client' // ❌ Client component

import { SmashSend } from '@smashsend/node';

export function BadExample() {
  // ❌ NEVER DO THIS! This exposes your API key to the browser!
  const smashsend = new SmashSend('your-api-key');

  // ❌ This will leak your API key in the browser's network tab
  const handleClick = async () => {
    await smashsend.emails.send({ ... });
  };
}
```

**✅ Correct approach for client-side interactions**

```tsx
// components/GoodExample.tsx
'use client';

export function GoodExample() {
  const handleSubmit = async (email: string) => {
    // ✅ Call your API route instead
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };
}
```

## Error Handling

```typescript
import { SmashSend, SmashSendError } from '@smashsend/node';

try {
  await smashsend.emails.send({
    /* … */
  });
} catch (err) {
  if (err instanceof SmashSendError) {
    console.error(err.statusCode, err.requestId, err.message);
  } else {
    console.error('Unexpected error', err);
  }
}
```

## Contact Properties

SMASHSEND supports custom contact properties with the following types:

```typescript
import { SmashsendPropertyType } from '@smashsend/node';

// Available property types:
SmashsendPropertyType.SELECT; // Single choice dropdown
SmashsendPropertyType.MULTI_SELECT; // Multiple choice selection
SmashsendPropertyType.STRING; // Text (max 255 characters)
SmashsendPropertyType.NUMBER; // Decimal numbers
SmashsendPropertyType.DATE; // Date values
SmashsendPropertyType.BOOLEAN; // True/False values
```

**Creating a custom property:**

```typescript
const property = await smashsend.contacts.createProperty({
  displayName: 'Industry',
  type: SmashsendPropertyType.SELECT,
  description: 'The industry sector',
  typeConfig: {
    multiple: false,
    options: ['Technology', 'Healthcare', 'Finance', 'Other'],
  },
});
```

**Important:** There are no separate EMAIL, URL, PHONE, TEXT, or INTEGER types. Use:

- `STRING` for email addresses, URLs, phone numbers, and any text
- `NUMBER` for both integers and decimals

## TypeScript Support

- Built **in TypeScript**
- Complete type definitions for **all resources & enums**
- Works with `strictNullChecks`, `moduleResolution=node`, etc.

## Automated Publishing Workflow

GitHub Actions publishes to **npm** automatically.

| Branch | Release type               |
| ------ | -------------------------- |
| `beta` | Prereleases `x.y.z-beta.n` |
| `main` | Stable releases `x.y.z`    |

Version bumps & Git tags (`v1.2.3` / `v1.2.3-beta.4`) are handled for you.

**Required secret**

```text
NPM_TOKEN  →  Settings ▸ Secrets ▸ Actions
```

## Documentation

Full API reference → **<https://smashsend.com/docs/api>**

## Contributing

We ❤️ PRs!

1. **Fork** → `git checkout -b feat/awesome`
2. Add tests & docs
3. **PR** against `beta` or `main`

## License

[MIT](LICENSE)
