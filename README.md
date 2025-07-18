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

## Table of Contents

1. [What is SMASHSEND?](#what-is-smashsend)
2. [Installation](#installation)
3. [Setup](#setup)
4. [Usage](#usage)
   - [Create or update a contact](#create-or-update-a-contact)
   - [Send transactional emails](#send-transactional-emails)
     - [Method 1: Send raw HTML](#method-1-send-raw-html)
     - [Method 2: Send with template (recommended)](#method-2-send-with-template-recommended)
     - [Method 3: Send with React](#method-3-send-with-react)
5. [Advanced Configuration](#advanced-configuration)
   - [Custom Headers](#custom-headers)
   - [Debug Mode](#debug-mode)
   - [Retry Configuration](#retry-configuration)
6. [Using with Next.js](#using-with-nextjs)
7. [Error Handling](#error-handling)
8. [TypeScript Support](#typescript-support)
9. [Automated Publishing Workflow](#automated-publishing-workflow)
10. [Documentation](#documentation)
11. [Contributing](#contributing)
12. [License](#license)

---

## What is SMASHSEND?

**SMASHSEND** is a bold, modern email platform built for **business owners, creators, and startups** — not just marketers.

- ⚡️ Drag-and-drop email builder
- 🪄 AI-powered personalization ("Magic Boxes")
- 🤖 Automations & event triggers
- 🚀 High-deliverability transactional email API
- 🗂️ Lightweight CRM & contact management
- 📈 Deep analytics & link tracking

→ [Explore more](https://smashsend.com)

---

## Installation

```bash
npm install @smashsend/node       # or yarn add @smashsend/node / pnpm add @smashsend/node
```

---

## Setup

### Getting an API Key

1. Log in to your [SMASHSEND Dashboard](https://smashsend.com/dashboard)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Give your key a descriptive name (e.g., "Production Server", "Development")
5. Copy the key immediately — it won't be shown again!

```typescript
import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);
```

> **Security tip:** Never commit API keys to version control. Use environment variables or a secrets manager.

---

## Usage

### Create or update a contact

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

### Send transactional emails

SMASHSEND offers three powerful ways to send transactional emails:

#### Method 1: Send raw HTML

The simplest way to send an email is with raw HTML:

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

#### Method 2: Send with template (recommended)

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

#### Method 3: Send with React

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

---

## Advanced Configuration

### Custom Headers

```typescript
// Add multiple headers
smashsend.setHeaders({
  'X-Custom-Header': 'value',
  'X-Tracking-ID': 'campaign-123',
});

// Or add an individual header
smashsend.setHeader('X-Source', 'website');
```

### Debug Mode

```typescript
smashsend.setDebugMode(true); // logs all requests & responses
```

### Retry Configuration

```typescript
const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!, {
  maxRetries: 5, // default 3
  timeout: 60000,
});
```

---

## Using with Next.js

This SDK works in **Next.js 14+**: server components, edge functions, API routes, and server actions.

### Helper

```typescript
// lib/smashsend.ts
import { SmashSend } from '@smashsend/node';

let client: SmashSend;

export function getSmashSendClient(apiKey?: string) {
  if (!client) {
    client = new SmashSend(apiKey ?? process.env.SMASHSEND_API_KEY!);
  }
  return client;
}
```

### Server Component

```tsx
// app/contacts/page.tsx
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

### API Route

```typescript
// app/api/contact/route.ts
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

---

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

---

## TypeScript Support

- Built **in TypeScript**
- Complete type definitions for **all resources & enums**
- Works with `strictNullChecks`, `moduleResolution=node`, etc.

---

## Automated Publishing Workflow

GitHub Actions publishes to **npm** automatically.

| Branch | Release type               |
| ------ | -------------------------- |
| `beta` | Prereleases `x.y.z-beta.n` |
| `main` | Stable releases `x.y.z`    |

Version bumps & Git tags (`v1.2.3` / `v1.2.3-beta.4`) are handled for you.

### Required secret

```text
NPM_TOKEN  →  Settings ▸ Secrets ▸ Actions
```

---

## Documentation

Full API reference → **<https://smashsend.com/docs/api>**

---

## Contributing

We ❤️ PRs!

1. **Fork** → `git checkout -b feat/awesome`
2. Add tests & docs
3. **PR** against `beta` or `main`

---

## License

[MIT](LICENSE)
