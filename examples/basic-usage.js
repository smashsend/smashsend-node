const { SMASHSEND } = require('@smashsend/node');

// Create a client instance
const smashsend = new SMASHSEND('your-api-key');

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
      custom: {
        company: 'SMASHSEND',
        role: 'Developer',
      },
      tags: ['developer', 'node-sdk'],
    });

    console.log('Contact created!', contact.id);
  } catch (error) {
    console.error('Error creating contact:', error.message);
  }
}

// Example: Create a campaign
async function createCampaign() {
  try {
    const campaign = await smashsend.campaigns.create({
      name: 'My First Campaign',
      subject: 'Welcome to SMASHSEND',
      content: '<h1>Welcome!</h1><p>Thanks for joining SMASHSEND.</p>',
      senderEmail: 'marketing@example.com',
      senderName: 'Marketing Team',
      listIds: ['list-id-1', 'list-id-2'],
    });

    console.log('Campaign created!', campaign.id);
  } catch (error) {
    console.error('Error creating campaign:', error.message);
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
  } catch (error) {
    console.error('Error creating webhook:', error.message);
  }
}

// Run examples
(async () => {
  await sendEmail();
  await createContact();
  await createCampaign();
  await createWebhook();
})();
