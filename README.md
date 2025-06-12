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
   - [Send an email](#send-an-email)
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
- 🪄 AI-powered personalization (“Magic Boxes”)  
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

Get an API key from the **[SMASHSEND Dashboard](https://smashsend.com)**:

```typescript
import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);
```

---

## Usage

### Create or update a contact

```typescript
import {
  SmashSend,
  SmashsendContactStatus,
  SmashsendCountryCode,
} from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);

const { contact } = await smashsend.contacts.create({
  email: 'newcontact@example.com',              // required
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  status: SmashsendContactStatus.SUBSCRIBED,    // defaults to SUBSCRIBED
  countryCode: SmashsendCountryCode.US,
  customProperties: {},                         // define in dashboard first
});

console.log(contact.id);                        // contact UUID
console.log(contact.properties.email);          // newcontact@example.com
```

### Send an email

```typescript
const response = await smashsend.emails.send({
  from: 'you@example.com',
  to: 'recipient@example.com',
  subject: 'Hello from SMASHSEND',
  text:  'This is a test email from the SMASHSEND Node.js SDK.',
  html:  '<p>This is a test email from the <strong>SMASHSEND Node.js SDK</strong>...</p>',
});
```

---

## Advanced Configuration

### Custom Headers

```typescript
// Add multiple headers
smashsend.setHeaders({
  'X-Custom-Header': 'value',
  'X-Tracking-ID':  'campaign-123',
});

// Or add an individual header
smashsend.setHeader('X-Source', 'website');
```

### Debug Mode

```typescript
smashsend.setDebugMode(true);   // logs all requests & responses
```

### Retry Configuration

```typescript
const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!, {
  maxRetries: 5,   // default 3
  timeout:    60000,
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
      {contacts.map(c => (
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
import {
  getSmashSendClient,
  SmashsendContactStatus,
  SmashsendCountryCode,
} from '@/lib/smashsend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const smashsend = getSmashSendClient();
    const { contact } = await smashsend.contacts.create({
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
  await smashsend.emails.send({ /* … */ });
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

| Branch | Release type                    |
|--------|---------------------------------|
| `beta` | Prereleases `x.y.z-beta.n`      |
| `main` | Stable releases `x.y.z`         |

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
