import { SmashSend, SmashSendError } from '@smashsend/node';

// Create a client instance
const smashsend = new SmashSend('your-api-key', {
  maxRetries: 3,
  timeout: 60000,
});

// Example: Send an email
async function sendEmail() {
  try {
    const email = await smashsend.emails.send({
      from: {
        email: 'sender@example.com',
        name: 'Sender Name',
      },
      to: [
        {
          email: 'recipient1@example.com',
          name: 'Recipient 1',
        },
        'recipient2@example.com',
      ],
      subject: 'Hello from SmashSend',
      text: 'This is a test email from the SmashSend Node.js SDK.',
      html: '<p>This is a test email from the <strong>SmashSend Node.js SDK</strong>.</p>',
      attachments: [
        {
          filename: 'attachment.txt',
          content: 'SGVsbG8gV29ybGQh', // Base64 encoded content
          contentType: 'text/plain',
        },
      ],
      tags: ['example', 'test'],
    });

    console.log('Email sent successfully!');
    console.log('Email ID:', email.id);
    console.log('Status:', email.statusCode);
  } catch (error) {
    if (error instanceof SmashSendError) {
      console.error(`Error: ${error.message}`);
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Error Code: ${error.code}`);
      console.error(`Request ID: ${error.requestId}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Example: Manage contacts with error handling
async function manageContacts() {
  try {
    // Create a contact
    const contact = await smashsend.contacts.create({
      email: 'john.doe@example.com',
      name: 'John Doe',
      properties: {
        company: 'SmashSend',
        role: 'Developer',
      },
      tags: ['developer', 'node-sdk'],
    });
    console.log('Contact created:', contact.id);

    // Update the contact
    const updatedContact = await smashsend.contacts.update(contact.id, {
      name: 'Jonathan Doe',
      properties: {
        company: 'SmashSend',
        role: 'Senior Developer',
        department: 'Engineering',
      },
    });
    console.log('Contact updated:', updatedContact.properties.name);

    // List contacts
    const listResponse = await smashsend.contacts.list({ limit: 10, offset: 0 });
    console.log(`Found ${listResponse.contacts.length} contacts`);
    console.log('Total contacts:', listResponse.pagination.total);

    // Create a contact property
    const property = await smashsend.contacts.createProperty({
      name: 'industry',
      label: 'Industry',
      type: 'string',
      description: 'The industry the contact works in',
    });
    console.log('Property created:', property.id);
  } catch (error) {
    if (error instanceof SmashSendError) {
      console.error(`Error: ${error.message}`);
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Error Code: ${error.code}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run examples
(async () => {
  await sendEmail();
  await manageContacts();
})();
