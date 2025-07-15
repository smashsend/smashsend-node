import { SmashSend } from '@smashsend/node';
import type { ReactElement } from 'react';

async function sendEmails() {
  const smashsend = new SmashSend('your-api-key');

  // Example 1: Send HTML email
  await smashsend.emails.send({
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Hello from TypeScript',
    html: '<h1>Hello World</h1>',
  });

  // Example 2: Send React email (no 'as any' needed!)
  const reactElement: ReactElement = {
    type: 'div',
    props: { children: 'Hello from React' },
    key: null,
  };

  await smashsend.emails.send({
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'React Email',
    react: reactElement,
  });

  // Example 3: Send with fromName
  await smashsend.emails.send({
    from: 'sender@example.com',
    fromName: 'Sender Name',
    to: 'recipient@example.com',
    subject: 'With fromName',
    html: '<p>This email has a fromName</p>',
  });

  // Example 4: Send templated email
  await smashsend.emails.sendWithTemplate({
    template: 'welcome-email',
    to: 'recipient@example.com',
    variables: {
      firstName: 'John',
      companyName: 'Acme Corp',
    },
  });

  // Example 5: Full email with all options
  await smashsend.emails.send({
    from: 'noreply@example.com',
    to: 'user@example.com',
    subject: 'Complete Example',
    html: '<h1>Hello</h1><p>This is a complete example.</p>',
    text: 'Hello\n\nThis is a complete example.',
    replyTo: 'support@example.com',
    settings: {
      trackClicks: true,
      trackOpens: true,
    },
    groupBy: 'campaign-123',
    contactProperties: {
      firstName: 'John',
      lastName: 'Doe',
    },
  });
}

// Handle contacts
async function manageContacts() {
  const smashsend = new SmashSend('your-api-key');

  // Create contact
  const contact = await smashsend.contacts.create({
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
  });

  // Update contact
  await smashsend.contacts.update('john@example.com', {
    firstName: 'Jonathan',
  });

  // Get contact
  const retrieved = await smashsend.contacts.get('john@example.com');

  // List contacts
  const contacts = await smashsend.contacts.list({
    limit: 50,
  });

  // Delete contact
  await smashsend.contacts.delete('john@example.com');
}
