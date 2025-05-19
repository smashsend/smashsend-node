const { SmashSend } = require('@smashsend/node');

// Create a client instance
const smashsend = new SmashSend('your-api-key');

// Example: Send an email
async function sendEmail() {
  try {
    const email = await smashsend.emails.send({
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Hello from SMASHSEND',
      text: 'This is a test email from the SMASHSEND Node.js SDK.',
      html: '<p>This is a test email from the <strong>SMASHSEND Node.js SDK</strong>.</p>',
    });

    console.log('Email sent!', email.id);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

// Example: Create a contact
async function createContact() {
  try {
    const contact = await smashsend.contacts.create({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      customProperties: {
        company: 'SMASHSEND',
        role: 'Developer',
      },
    });

    console.log('Contact created!', contact.id);
  } catch (error) {
    console.error('Error creating contact:', error.message);
  }
}

// Example: Set up a webhook
async function createWebhook() {
  try {
    const webhook = await smashsend.webhooks.create({
      url: 'https://example.com/webhooks/smashsend',
      events: ['email.sent', 'email.delivered', 'email.opened'],
      description: 'Track email events',
    });

    console.log('Webhook created!', webhook.id);

    // Verify a webhook signature
    const isValid = smashsend.webhooks.verifySignature(
      '{"event":"email.sent","email":"test@example.com"}',
      'abc123signature',
      'webhook-secret'
    );

    console.log('Signature verification:', isValid ? 'valid' : 'invalid');
  } catch (error) {
    console.error('Error with webhook:', error.message);
  }
}

// Run examples
(async () => {
  await sendEmail();
  await createContact();
  await createWebhook();
})();
